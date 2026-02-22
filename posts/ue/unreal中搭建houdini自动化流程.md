---
title: "Unreal中搭建Houdini自动化流程"
categories: ["UE"]
date: "2023-07-23"
created: "2023-07-23T13:59:00.000Z"
updated: "2025-02-28T02:34:00.000Z"
notion_url: "https://www.notion.so/Unreal-Houdini-ae80def693994452b6218730252d922a"
database: "UE Technical"
source: "notion-sync"
---
# Unreal中搭建Houdini自动化流程


## 简介


    在V2版本的HoudiniEngineForUnreal中，Houdini开放了很多C++、python和蓝图接口，也就是一个静态类，叫Houdini Public API ，HoudiniPublicAPI支持创建一个Houdini HDA Actor到场景中的，设置参数和输入，Cook，输出结果和烘焙结果。


    基于V2版本的改动，我们就可以在UE中实现一套我们自己的流水线。


![Untitled.png](assets/unreal中搭建houdini自动化流程/001-659582f8.png)


这里分为C++层级流水线，蓝图层级流水线，houdini层级流水线，C++层级流水线我已经做成插件可以直接调用，Houdini HDA层级和我们平时制作HDA一样。这里我们着重介绍一下蓝图流水线该怎么玩以及Houdini在蓝图中的调用。


    当我们能在蓝图中去操作houdini 的hda，那么我们就可以做很多有意思的事情，比如说，原本我们想做一个流程，为全场景烘焙不同Cell大小的HLOD，相当与是 两层 四叉树分割的的HLOD。那么我们需要输入全场景的Mesh进入HDA，然后在HDA中处理Mesh，按格子划分、减面等等，最后输入一系列的Mesh文件。看起来这个流程十分麻烦。当我们自动化之后，我们只需要一键或者使用定时器每晚运行一遍既可执行整个流程。
首先我们创建一个蓝图，我们需要开启一个HoudiniEngineSession。使用 Create Session或者 Restart Session都可以。(区别就是Restart会清一波缓存)


![Untitled.png](assets/unreal中搭建houdini自动化流程/002-3055c829.png)


在当前场景中创建一个HDA的Actor，我们可以使用Process HDA或者Instantiate Asset这里推荐使用Process HDA，因为Process HDA是Instantiate Asset的封装，自带了很多调节参数。比如生成位置，HDA的参数设置、HDA的输入口、是否自动Cook、是否自动Bake等等。可以自己去看注释。


![Untitled.png](assets/unreal中搭建houdini自动化流程/003-5583a659.png)


这里使用未封装的Instantiate Asset，一步一步设置。


首先设置In Houdini Asset，拖拽赋值上你要生成的Houdini HDA Asset，以下是参数含义。

- `InHoudiniAsset`: 要生成的HDA uasset
- `InInstantiateAt`: 用来实例化HDA actor的Transform。
- `InWorldContextObject`: 如果`InSpawnInLevelOverride`为空，一个`WorldContextObject`用于标识要在其中生成的世界。
- `InSpawnInLevelOverride`: 如果不是nullptr，那么`AHoudiniAssetActor` 将在该关卡中生成。如果`InSpawnInLevelOverride` 和`InWorldContextObject` 都是null，那么Actor将在当前编辑器上下文世界的当前关卡中生成。  （默认为null，就会生成在当前打开关卡）
- `bInEnableAutoCook`: 如果为`true` (默认值)，HDA将在实例化后以及参数、转换和输入更改后自动Cook。
- `bInEnableAutoBake`: 如果为`true`，则HDA输出在烹饪后自动Bake。默认为false。
- `InBakeDirectoryPath`: 如果Bake目录路径没有通过HDA输出的属性设置，将Bake到的指定目录。
- `InBakeMethod`:烘焙目标(Actor或者蓝图)。
- `bInRemoveOutputAfterBake`:如果为`true`, HDA临时输出在Bake后被移除。默认为`false`。
- `bInRecenterBakedActors`: 将烘焙的演员重新放置到它们的边界框中心。默认为`false`。
- `bInReplacePreviousBake`:如果为`true`，则在每次烘焙时用新烘焙的输出替换之前烘焙的输出(assets 或者 actors)。默认为`false`。

# Houdini Public API Asset Wrapper


    通过Process HDA或者Instantiate Asset生成的HDA会封装在`UHoudiniPublicAPIAssetWrapper`的Object。这个类允许我们对生成的HDA Actor进行设置参数、输入、烹饪、烘焙和访问输出来操作实例化的HDA。


![Untitled.png](assets/unreal中搭建houdini自动化流程/004-16801e32.png)


![Untitled.png](assets/unreal中搭建houdini自动化流程/005-ce42ffc0.png)


Asset Wrapper这个东西十分重要，一个Asset Wrapper就相当于是一个实例化的HDA。


如果我们场景里面已经有了我们预先配置好的HDA Actor那么我们可以这样拿到它的Asset Wrapper


![Untitled.png](assets/unreal中搭建houdini自动化流程/006-25afad1e.png)


有了Asset Wrapper一切就好说了，Asset Wrapper就是一个实例化的HDA，我们可以为它设置一系列的东西，首先，我们要设置好Asset Wrapper的回调函数。因为Houdini Cook是异步操纵，与主线程无关，所以我们不知道Houdini何时Cook完成，何时烘焙完成，这时候就需要用到回调函数。

- `OnPreInstantiationDelegate`: 在HDA实例化之前调用:HDA的默认参数定义是可用的，但是节点还没有在HAPI/Houdini引擎中实例化。此时可以设置参数。
- `OnPostInstantiationDelegate`:资产成功实例化后调用。这是在第一次Cook之前设置/配置输入的地方。
- `OnPostCookDelegate`: Cook完成后调用。但是输出的对象/资产尚未创建/更新。
- `OnPreProcessStateExitedDelegate`: 在预处理阶段结束时调用(在Cook之后)。输出对象/资产尚未创建/更新。
- `OnPostProcessingDelegate`: Cook后的输出处理已经在虚幻中完成调用。输出对象/资产已经创建/更新。
- `OnPostBakeDelegate`: 在资产全部Bake完成后进行调用。

通常我们就用这几个，PDG那几个回调同理。添加一个Custom Event。


![Untitled.png](assets/unreal中搭建houdini自动化流程/007-f2c20107.png)


有了回调之后，我们就可以在`OnPreInstantiationDelegate`回调的时候`设置参数拉。`


![Untitled.png](assets/unreal中搭建houdini自动化流程/008-e265f321.png)

- `SetFloatParameterValue`
- `GetFloatParameterValue`
- `SetColorParameterValue`
- `SetIntParameterValue`
- `SetBoolParameterValue`
- `SetStringParameterValue`

等等。。。。常规的设置参数都有。


参数设置好之后，我们还需要设置HDA的输入。


![Untitled.png](assets/unreal中搭建houdini自动化流程/009-7130e093.png)


创建一个空的输入类。


![Untitled.png](assets/unreal中搭建houdini自动化流程/010-a2bd25bf.png)


![Untitled.png](assets/unreal中搭建houdini自动化流程/011-82066371.png)


Create Empty Input创建输入类就相当于HDA面板上的输入口，确立好输入类型，填充好这个输入的所需要的 Actors或者Assets 。将我们创建的输入类 设置到HDA的指定输入口。


一切配置完毕，我们只需要Cook或者Build，我们配置好的HDA(Asset Wrapper )，


![Untitled.png](assets/unreal中搭建houdini自动化流程/012-b2551323.png)


如果我们还需要Bake出来的结果。那么我们还要在设置一下Bake相关。当cook完之后，回调函数就会自动调用Bake。Bake相关设置也对应HDA面板上的设置。


![Untitled.png](assets/unreal中搭建houdini自动化流程/013-e52b8ef6.png)


![Untitled.png](assets/unreal中搭建houdini自动化流程/014-fe20c904.png)


    这套流程下来就会，自动配置好一个你需要的HDA，配合上蓝图节点一些其他操作，比如重新导入FBX呀，导入贴图呀，等等系列需要手工的操作步骤封装起来，将实际流程包装为一个黑盒。实际操作人员就可以避免复杂的配置(包括看到Houdini)，实现一键完成等操作。


    因为我们已经将内部流水线包装成一个蓝图了。那么我们可以在C++层级去Call这个蓝图，C++开放一个蓝图调用函数接口，UE里面可以配置好调用哪个蓝图，之后只需要在C++层级正确的调用我们配置好的蓝图，一环套一环的运行下去就可以啦。


    我们最终的目的是做出一个自动化流程与手动化兼备的流程。这里自动化可以参考常用的[**Jenkins**](https://www.bing.com/ck/a?!=&p=fee1a43ccc3a5e1aJmltdHM9MTY5MDA3MDQwMCZpZ3VpZD0zMTdlNGIzNC03M2IwLTY4MWQtMzc1Yy00NGNkNzI5ZTY5MmImaW5zaWQ9NTE4OA&ptn=3&hsh=3&fclid=317e4b34-73b0-681d-375c-44cd729e692b&psq=jenkins&u=a1aHR0cHM6Ly93d3cuamVua2lucy5pby8&ntb=1)**，**Windows的任务计划程序，以及Github的Actions功能(我自己的网站便是使用这个功能每晚自动抓取数据)。


![Untitled.png](assets/unreal中搭建houdini自动化流程/015-328fd637.png)


通常包括一个触发器（分为事件触发与定时触发）和执行程序脚本（Windows上通常用bat文件），所以，我们只需要将我们整个Pipeline流程封装成bat文件去执行既可以。


UE便有现成的**Commandlet 命令行调用，就像这样：**


`UnrealEditor-Cmd.exe ProjectPath -run=CommandletName`


这是官方文档 ：[https://docs.unrealengine.com/5.2/zh-CN/command-line-arguments-in-unreal-engine/](https://docs.unrealengine.com/5.2/zh-CN/command-line-arguments-in-unreal-engine/)


基于这些，我们便可以实现bat一键调用以及接入Jenkins等触发或定时调用，将整个流程串了起来，选择一个你的执行蓝图，通过配置面板去生成一个对应运行流程bat文件。


我将这个流程封装成了插件


[bookmark](https://www.bilibili.com/video/BV11V4y147Sw)

---
title: "Unity破碎"
categories: ["Unity"]
date: "2023-07-07"
created: "2023-07-07T13:24:00.000Z"
updated: "2023-07-07T13:27:00.000Z"
notion_url: "https://www.notion.so/Unity-5dbc9b2e130a439a80005670c4b010b2"
database: "Unity Technical"
source: "notion-sync"
---
![Untitled.png](assets/unity破碎/001-4039c4eb.png)


通常破碎类型我们分为3类，分别是 刚体 、木头 、玻璃，三者有所不同所以一般分开讨论，破碎的使用上分为 实时(Chaos) 、预烘培(VAT) 、 混合 三种方案。


三种各有各的优缺点，说白了就是 时间与空间的不同配比，这里暂时只探讨混合这种方案。


[BrokenWall.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/6688de4a-5500-4fe7-a94b-889bba859096/BrokenWall.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666AFQSSMX%2F20260301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260301T092137Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDgEcTNiPz5ZqrnOLfPUs3GvG%2BztRQ%2Fm5IF6v5h3lfnfgIgG4UIwZNx6gbuNY5WjqhKT6KBfloW9gDRSwc9E1EhBw4q%2FwMIahAAGgw2Mzc0MjMxODM4MDUiDLCiZsQ00nxqE8%2FtXSrcA8%2FEYJ9p6Efzd7hqNIe5q5IyNA7Cpb4k2XJDqkvtswLjZoAcSFJtrrJkKkBLaCO5Pq8aNlcDlX3Eq1Rl%2BxDW18OazR%2B9Ok6J75wfg8PTZaavzkOJTWyk7PE7%2FODMSD8G93wUQ%2BqvSg2%2BpC9VXrVkenu%2FiMHncAR9isrUBLYcKqM9Nogt03NamQ9xIp%2FpK9gSPc71%2F8AA9jffJQDzjFZUpzHrBKiBB%2F0kq8fgmRnWMuroTx2H1LT5vaUZi8TsSCRUsnWIF5Qiba6qSYwWjYFBp9ahfx0fq4wOtWEIhBn61JZM1MhrbMmY0FqM%2BuYV%2BWQIujWmUYO7PRWcp1CPSEqWbjcV6HP2aCHgDaSrlIQPaoc0DxnXtR0BrXYUeEnsk0eaMMCO6%2Bm3ngyPh7SJHI0%2Fids%2Bl0bjG0nKIe%2F3PWCw9hfjXP1oVnDT9E05v1mW52LzqkAugTz1GA6WSTM3GLLUxsigaobBO9folgO%2FAr7IEOQPXzB0SI2Ozn8f8%2Fut0fcu0ImfL8tZsHlSD1TFFQekKRpgdGq5jroAZfqiGR9ByKvmr0qtYxSxELsPEHLQp%2FnsNpVYH2vFtoCm756a0%2F4Yr90fxDicnCLrnoneU0DRqjKtY7oeWb55xQUhPgm6MIryj80GOqUBkGrMcdBCKJO6BHRIF3HnfhJxpn7J7%2BX4j9oKoYOVRxLlDidATNhgtoxIW7uCnvGcMeNUth%2F%2BYHyXw58Qe2KzhAS38uQ1YrUQmTPN1V3bNiqhU4MG%2BAPEZHq3%2B%2BROjgNUpcDhLWLaCUIkseBw7xJPvM4FTq3g9EemRYIeOtmhm3hOGOLfhcOuSV0p7NK4cueFM581nyp406zsfLks3aYaKoAu0bk0&X-Amz-Signature=7b303ae68c49e23f14d240ae015ac084db6ed55ba0427a7856df7c5a11b4e151&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### RBD：


刚体这里我是用的方案为：二级破碎+粒子，破碎的话houdini很方便，常用的有三种方法：


RBD Material Fracture


![Untitled.png](assets/unity破碎/002-49c3fdfd.png)


Voronoi Fracture


![Untitled.png](assets/unity破碎/003-2c675bcd.png)


自己切


![Untitled.png](assets/unity破碎/004-28c3f92c.png)


这里用RBD Material Fracture 来做，将墙体导入进HDA之后，我们有个重新计算UV的开关，方便没有UV的模型直接生成UV。如果有UV的模型，**我们以不改变模型UV的前提下进行破碎烘培**。


为了我们的破碎烘焙的速度与性能可控，**我们这里需要对模型进行一个固定分辨率的操作**，其实就是缩放到2X2的空间大小内。


![Untitled.png](assets/unity破碎/005-a5989585.png)


之后将我们的墙切成想要的块 ，具体参数这里不说 可以自行F1 ，得到我们想要的块，我们会发现块的内部会有自动生成的UV，并且UV比较错乱，我们需要删除掉houdini帮我们生成的UV，将Group为inside的UV删除既可。最后便可以得到一个比较干净的破碎模型。


![Untitled.png](assets/unity破碎/006-e0947f7d.png)


然后我们就可以Foreach 循环遍历我们的每一块，再切一次，基本就可以得到我们最终的结果(也需要删除内部UV)


![Untitled.png](assets/unity破碎/007-e37c7e95.png)


模型导出通过Python来控制，就是每次点一下SaveToDisk ，代码就一行


```javascript
hou.node("../rop_fbx2").parm("execute").pressButton()
```


导出的时候，需要注意一下把原本的缩放给还原回来，想要导出一个模型包含多个submesh的时候我们需要把Rop_fbx的path attribute打开，这样就能导出带层级结构的模型。


![Untitled.png](assets/unity破碎/008-364367bb.png)


![Untitled.png](assets/unity破碎/009-bfe0dcf8.png)


houdini端最基本的二级破碎大概这么多就行啦，之后你可以自行扩展。


对于墙体内部带钢筋啊这些结构会让真实提升一些。所以之后我们可以扩展一下，自动生成一下钢筋结构，大体的思路是根据模型的包围盒大小生成一个对应的钢筋结构，


![Untitled.png](assets/unity破碎/010-2fd41b40.png)


首先我们将钢筋分为一段一段的pack起来，这样一段钢筋其实就是一个点云，我们就可以使用xyzdist找到离我们一定范围内的钢筋段，再将钢筋段扭曲一下模拟一下损坏的感觉既可


![Untitled.png](assets/unity破碎/011-a7cc2569.png)


得到了内部钢筋与破碎块合并输出之后，**想在unity或者unreal中使用submaterial功能，给不同的模型类别上不同的材质，这时我们需要在houdini先给两个不同的材质物体上一个Material，否则引擎检测不出来使用了submaterial功能，共用一个材质啦，**这里我为了快速用了labs的quickmaterial节点。


![Untitled.png](assets/unity破碎/012-342fbdb7.png)


////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////


[BrokenWood.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/41e92dc1-d0cb-4da3-a1f9-2967bda339ab/BrokenWood.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666AFQSSMX%2F20260301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260301T092137Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDgEcTNiPz5ZqrnOLfPUs3GvG%2BztRQ%2Fm5IF6v5h3lfnfgIgG4UIwZNx6gbuNY5WjqhKT6KBfloW9gDRSwc9E1EhBw4q%2FwMIahAAGgw2Mzc0MjMxODM4MDUiDLCiZsQ00nxqE8%2FtXSrcA8%2FEYJ9p6Efzd7hqNIe5q5IyNA7Cpb4k2XJDqkvtswLjZoAcSFJtrrJkKkBLaCO5Pq8aNlcDlX3Eq1Rl%2BxDW18OazR%2B9Ok6J75wfg8PTZaavzkOJTWyk7PE7%2FODMSD8G93wUQ%2BqvSg2%2BpC9VXrVkenu%2FiMHncAR9isrUBLYcKqM9Nogt03NamQ9xIp%2FpK9gSPc71%2F8AA9jffJQDzjFZUpzHrBKiBB%2F0kq8fgmRnWMuroTx2H1LT5vaUZi8TsSCRUsnWIF5Qiba6qSYwWjYFBp9ahfx0fq4wOtWEIhBn61JZM1MhrbMmY0FqM%2BuYV%2BWQIujWmUYO7PRWcp1CPSEqWbjcV6HP2aCHgDaSrlIQPaoc0DxnXtR0BrXYUeEnsk0eaMMCO6%2Bm3ngyPh7SJHI0%2Fids%2Bl0bjG0nKIe%2F3PWCw9hfjXP1oVnDT9E05v1mW52LzqkAugTz1GA6WSTM3GLLUxsigaobBO9folgO%2FAr7IEOQPXzB0SI2Ozn8f8%2Fut0fcu0ImfL8tZsHlSD1TFFQekKRpgdGq5jroAZfqiGR9ByKvmr0qtYxSxELsPEHLQp%2FnsNpVYH2vFtoCm756a0%2F4Yr90fxDicnCLrnoneU0DRqjKtY7oeWb55xQUhPgm6MIryj80GOqUBkGrMcdBCKJO6BHRIF3HnfhJxpn7J7%2BX4j9oKoYOVRxLlDidATNhgtoxIW7uCnvGcMeNUth%2F%2BYHyXw58Qe2KzhAS38uQ1YrUQmTPN1V3bNiqhU4MG%2BAPEZHq3%2B%2BROjgNUpcDhLWLaCUIkseBw7xJPvM4FTq3g9EemRYIeOtmhm3hOGOLfhcOuSV0p7NK4cueFM581nyp406zsfLks3aYaKoAu0bk0&X-Amz-Signature=fcb095e73a905ddf3608c7a182fd2c3c891dfedc9eb37ecb738c0225383bb14f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### 木头：


木头这里我是用的方案为：一级破碎+粒子 ,


前面一级的破碎其实和RBD差不多，只不过参数上的变化，这里我暂时没用RBDMaterialFracture的Wood模式，主要是产生的mesh点太多啦，冗余的点与面不太好清理，清理结果都不太理想。木头这边主要不同是参数与内部镶嵌物，也就木屑，木屑的生成就是循环遍历每个一级破碎片，将木头碎片缩小一点，就是随便缩放0.9左右，主要目的是为了让木屑片插进木头片，然后使用scatter节点对木头碎片的inside组上进行撒点并且把随机木屑片copy到生成点既可，为了木屑不穿插出来，我们还得做一个容错处理，使用木头碎片的包围盒与生成的木屑做一个相交判断，如果有交点那么就不生成这个木屑。


![Untitled.png](assets/unity破碎/013-5f537299.png)


最后也是用两个不同的material来标记两种物体再输出既可。


////////////////////////////////////////////////////////////////////////////////////////////////////////////////


[embed]()


### 玻璃：


玻璃这里我是用的方案为：一级破碎+粒子 ,


玻璃其实是碎成很多块，而且碎块棱角分明，所以制作的思路有些许不同，一样也是用RBDMaterialFracture，但是一开始我就将玻璃分成很多碎片。


![Untitled.png](assets/unity破碎/014-6507d6f2.png)


然后使用RBDCluster将相邻的块给组合起来，就可以得到边缘比较棱角分明的形状


![Untitled.png](assets/unity破碎/015-d4930204.png)


在将多余的点线面给剔除掉


![Untitled.png](assets/unity破碎/016-1b62516e.png)


基本就可以输出啦~！


接下来讲渲染相关(大部分houdini的活)。


![Untitled.png](assets/unity破碎/017-9f5cbc0d.png)


![Untitled.png](assets/unity破碎/018-9d370129.png)


![Untitled.png](assets/unity破碎/019-0b703de2.png)


渲染这里我主要是通过Houdini烘培三张图 SDF 、Normal 、AO。SDF用来标记边缘，做磨损，Normal和AO就不用说了。


我们先将内面 inside组生成一个新的Edges类型的组叫edge边组，然后blast掉inside面，现在可以得到一圈边线。


![Untitled.png](assets/unity破碎/020-f25df620.png)


通过labs的edgegroup_to_curver节点便可以叫边组变为curve线条(这部分自己写也行)，


然后我们只要将模型上每一个地方到这条线的距离求出来，将结果存在图上便可以得到SDF数据图啦。


这一步其实就简单啦，就是houdini烘培贴图的几种办法中的任意一种基本都做。这里我们使用先把属性转移到体素上在存图片，我们先开一个分辨率大小的2D体素。size大小1x1，center记得0.5,0.5，就是把体素在世界空间上与模型的UV在UV空间上对齐。


![Untitled.png](assets/unity破碎/021-d1544621.png)


然后使用VolumeWarangle，对每个体素(也可以理解为像素点)进行一个采样，拿到当前uv空间像素点对应的世界坐标的Pos，在用这个Pos对线条求一个xyzdist()，把得到的距离结果存会体素上既可。


![Untitled.png](assets/unity破碎/022-195d0f61.png)


```javascript
vector sppos = uvsample(2,"P","uv",v@P);
float dist = xyzdist(1,sppos);

f@d = dist;
```


然后我们创一个COP，在COP里面用sopimport将得到的体素结果传进来作为Cd属性。


直接输出既可(后续可与法线AOPack到一张图)。


![Untitled.png](assets/unity破碎/023-f004abbe.png)


想要得到一个破损的法线，我们可以直接用labs的EdgeDamage节点做模型的边缘磨损效果(也可自己写)。


![Untitled.png](assets/unity破碎/024-bfa1618e.png)


就可以直接用Maps_Baker连入低模和高模直接烘培出法线来。AO也同理。


这样烘焙出来的法线和AO有一个小的缺点，就是法线和AO的边缘与模型断裂的边缘有些地方对不齐，因为高模到低模烘焙法线的算法是找最近的点嘛，所以有些点的位置找错位置了，修复的办法就是循环遍历每个高模块与低模块，单独一块一块的将信息烘培出来。


![Untitled.png](assets/unity破碎/025-32ce82ce.png)


![Untitled.png](assets/unity破碎/026-4c0bea50.png)


有了这些贴图，材质这边就好说啦，


我们是以不修改原模型UV的基础上进行的破碎切割，那么我们可以直接用上原模型的材质作为我们破碎前的材质，破碎后的材质便是在破碎前的材质基础上扩展。


首先有两个主要的问题，破碎内部的材质应该如果解决，边缘磨损的效果实现。


对应破碎内部，这个我用的是三项投影的一次采样版本，具体名称我也忘了，就是三项投影在UV阶段做Lerp既可，少去在多次采样后在lerp的开销，只需要一次采样就行。缺点是过渡有硬边uv不能衔接，但是刚好适用于破碎这种全是棱角分明的模型切面，不需要什么圆润的过渡。


![Untitled.png](assets/unity破碎/027-69f3c9a9.png)


![Untitled.png](assets/unity破碎/028-13644363.png)


边缘磨损这边就是通过SDF 得到两个Mask，叠加两层磨损效果既可，这个就看个人发挥，这里木头给了一个拉丝的噪声既可。


![Untitled.png](assets/unity破碎/029-e2e175fb.png)


![Untitled.png](assets/unity破碎/030-82943332.png)


![Untitled.png](assets/unity破碎/031-b2d13f99.png)


玻璃材质这里有几个小的注意点，透明需要根据 Fresnel 来，越正面越透明，越边缘越不透明， 折射也是需要根据Fresnel来lerp。这两点有了 那么玻璃的大体感觉也会出来了，


![Untitled.png](assets/unity破碎/032-57a346db.png)


注意一下有色玻璃不能在BaseColor上给颜色，需要在你折射的那张 ColorBufferRT 上给一个偏色。


剩下的还有粒子、编辑器扩展和一些逻辑相关，粒子随便做的，就不说了，编辑器扩展的话就是通过设置好的命名分隔规则来制作有层级关系的Prefab，一键生成对应Prefab，提前为每个Mesh设置Tag与碰撞相关，每个Prefab都会有自己的DataScript来记录这个Prefab的一些信息。之后的GamePlay逻辑就可以通过每个Prefab上的数据来做一些不同的事情。


![Untitled.png](assets/unity破碎/033-33671c23.png)


大体就这么多啦，之后可能还有纯烘培VAT的方案。

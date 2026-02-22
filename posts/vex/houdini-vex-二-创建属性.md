---
title: "Houdini VEX(二)创建属性"
categories: ["VEX"]
date: "2023-07-07"
created: "2023-07-07T14:06:00.000Z"
updated: "2023-07-07T14:34:00.000Z"
notion_url: "https://www.notion.so/Houdini-VEX-66dc5a71919c4528a330e86b0bf7f277"
database: "Houdini Notes"
source: "notion-sync"
---
一、方法一：通过变量创建属性

1. 创建Houdini常用属性时可以不指定类型，如@N不用写成v@N
- 写法：

`@+名字//如法线：@N`

1. 常用属性

`Houdini有许多浮点型的常用属性，如@pscale,@width,以下是除浮点以外的其他类型

vector @P，@accel，@center，@dPdx，@dPDz，@Cd，@N，@scale，@force，@rest，@torque，@up，@uv，@v

vector4 @backtrack，@orient，@rot

int @id，@ix，@iy，@iz，@nextid，@pstate，@resx，@resz，@ptnum，@vtxnum，@primnum，@numpt，@numvtx，@numprim，@group_*

string @name，@instance`

1. 简写可以赋初值，赋值时，大括号{}里面不能有变量

`@N = {0,1,0}//不能写成@N = {0,@P.y,0}`

1. 如果想赋值变量，需要用set函数

`@N = set(0,@P.y,0)`

1. 创建属性时，如果@符号前不指定类型，则默认是浮点

`@foo 等价于 f@foo`

1. 简写方式
- 写法：
缩写数据类型+@+名字
- 例子：

`i@id     =8;
f@width =1.0;
u@xy ={0.3,0.9};
v@w =set(@width,$PI,0.5);
p@point = {0,0,0,1};
2@scale_2d ={ {2,0},   {0,2} };
3@scale ={2,0,0,   0,2,0,   0,0,2};
4@trans ={1,0,0,0,   0,1,0,0,   0,0,1,0,   0,0,0,1};
s@path = "op:/obj/geo1/pack1";`

1. 数组的简写方式
- 写法：
缩写数据类型+[]+@+名字
- 例子：

`i[]@pointcloud ={0,1,2};
f[]@len =arrary(1,@Time,@width);
3[]@rotation;
s[]@letters ={'H','i'};`

- 简写可以赋初值，非简写不能赋初值

`//简写
i@id     =8;
//非简写
int @id =8;//错误`

- 非简写不能有算式，简写可以

`float @mass = 1/area;//错误`

- 非简写不能用函数，简写可以

`vector @up = set(0,1,0);//错误`


二、方法二：通过函数来创建属性

1. 将attribute wrangle节点的Run Over选项修改为Detail(only once)--只运行一次，因为我们创建属性只需要创建一次就够了

    ![9148742-221514f203e44a43.webp](assets/houdini-vex-二-创建属性/001-56456473.webp)

2. 添加属性方法：

1）addpointattrib/addvertexattrib/addprimattrib/adddetailattrib(参数1，参数2，参数3)；

- 添加位置点属性/添加几号面几号顶点属性/添加面属性/添加整体属性
- 参数1：你要添加到第几个输入端
- 参数2：属性的名字
- 参数3：属性的值
- 例子：

`addpointattrib(0,"Cd",{0,0,0});
addvertexattrib(0,"Cd",{0,0,0});
addprimattrib(0,"Cd",{0,0,0});
adddetailattrib(0,"Cd",{0,0,0});`

1. 修改属性方法：
1）setpointattrib/setprimattrib(参数1，参数2，参数3，参数4);
- 设置位置点属性/设置面属性
- 参数1：你要获取到第几个输入端
- 参数2：属性的名字
- 参数3：你要设置几号点/面
- 参数4：属性的值
- 例子：

`setpointattrib(0,"Cd",3,{1,0,0});
setprimattrib(0,"Cd",3,{1,0,0});`


2）setvertexattrib(参数1，参数2，参数3，参数4，参数5);

- 设置几号面的几号顶点
- 参数1：你要获取到第几个输入端
- 参数2：属性的名字
- 参数3：你要设置几号面
- 参数4：你要设置（参数3的值）号面的几号顶点
- 参数5：属性的值
- 例子：

`setvertexattrib(0,"Cd",3,3,{1,0,0});`


3）setdetailattrib(参数1，参数2，参数3);

- 设置整体几何体的整体的属性
- 参数1：你要获取到第几个输入端
- 参数2：属性的名字
- 参数3：属性的值
- 例子：

`setdetailattrib(0,"Cd",{1,0,0});`


三、查看属性：

1. 首先

    ![9148742-8f3e62ee8c1104ab.webp](assets/houdini-vex-二-创建属性/002-b9141f6f.webp)

2. 通过这四个按键，分别查不同级别的数据

    ![9148742-527f53e6637c5e76.webp](assets/houdini-vex-二-创建属性/003-16d5e993.webp)

3. 我们输入以下vex代码：

    ![9148742-93ddb2a3a5ca607a.webp](assets/houdini-vex-二-创建属性/004-6f220784.webp)

4. 我们查了下顶点，和setvertexattrib(0,"Cd",3,3,{1,0,0})相对应

    ![9148742-93f4a8c39843c1bb.webp](assets/houdini-vex-二-创建属性/005-7ca832d5.webp)

- 貌似位置点的找不出变化的值，可能是被覆盖了？

四、Attributes to Create


![9148742-d636e1fa451c75e7.webp](assets/houdini-vex-二-创建属性/006-ecc9d610.webp)

1. 只允许创建指定属性，默认 * 允许所有属性创建
2. 可以防止因为打字错误而创建出错误的属性
3. 测试：
1.首先新建一个attribute wrangle节点：

    ![9148742-698c803cc3f753ce.webp](assets/houdini-vex-二-创建属性/007-fddf9c9e.webp)


    2.输入指定属性：


    ![9148742-c8c4753a88f52c1f.webp](assets/houdini-vex-二-创建属性/008-9e305d14.webp)


    3.输入vex语句：


    ![9148742-4725ca0d089451a1.webp](assets/houdini-vex-二-创建属性/009-cffe6ede.webp)


    4.查看属性：在attribute wrangle节点上，长按鼠标中键：


    ![9148742-15ec470293c0c1d5.webp](assets/houdini-vex-二-创建属性/010-8f616f72.webp)

- 可以发现我们创建的小写cd属性没有创建出来，但是被指定的属性却可以被创建

五、简写与非简写在用途上的区别：

1. 简写属性：无论属性存在与否，都创建并赋值
2. 非简写属性：如果属性已存在，不会覆盖掉原属性值；否则，创建并赋值
3. 一般用简写形式创建属性，除非你需要上述功能
4. 例子：

    ![9148742-116d52c7cbd0cd15.webp](assets/houdini-vex-二-创建属性/011-26b9afc5.webp)

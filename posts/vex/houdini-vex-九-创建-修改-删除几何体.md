---
title: "Houdini VEX(九)创建、修改、删除几何体"
categories: ["VEX"]
date: "2023-07-07"
created: "2023-07-07T14:06:00.000Z"
updated: "2023-11-21T09:28:00.000Z"
notion_url: "https://www.notion.so/Houdini-VEX-4eaaa38439424f35bd2ae56fb492683a"
database: "Houdini Notes"
source: "notion-sync"
---
一、创建

- addpoint函数：创建点，并返回点的序号(也可以没有返回值)
1） 以p0为例子：输入端为0号输入端，添加一个顶点坐标为0，0，0的顶点，并返回顶点序号给p0

    ![9148742-e0f0133e5613c25a.webp](assets/houdini-vex-九-创建-修改-删除几何体/001-cf299ca5.webp)

- addprim函数：创建基本几何体
    1. 输入端为0号输入端，在p2的位置创建一个球体

        ![9148742-0fb4bb46f88c64a2.webp](assets/houdini-vex-九-创建-修改-删除几何体/002-9321719b.webp)

    2. 创造线的时候，需要给定两个位置点

        ![9148742-f3d599feeeb5b753.webp](assets/houdini-vex-九-创建-修改-删除几何体/003-174516ef.webp)

    3. 创建面的时候，需要至少给定3个位置点，最多可以给定4个位置点，再多就需要用数组来

        ![9148742-d4d4f8ed48e5f4e3.webp](assets/houdini-vex-九-创建-修改-删除几何体/004-eb97ce87.webp)

    4. 对prim这种基本几何体，它本身就是一个点，要想对他操作，需要使用setprimintrinsic函数：

        ![9148742-be7ca388980a049d.webp](assets/houdini-vex-九-创建-修改-删除几何体/005-2973ba8e.webp)

- 输入端为0号，将球的几何体的transform属性修改为一个3x3矩阵，值为
0.2,0,0
0,0.2,0
0,0,0.2
也就是在原来的基础上，缩小到了0.2倍大小
- ident函数是一个4x4矩阵：
1，0，0，0
0，1，0，0
0，0，1，0
0，0，0，1
- matrix3函数：将matrix4类型的值转化为matrix3类型
- addpoint函数，还可以在第二个参数位置写一个序号
1. array函数：构建数组

    ![9148742-7711fc181a745ac0.webp](assets/houdini-vex-九-创建-修改-删除几何体/006-d545c1c2.webp)

2. addvertex函数：创建一个顶点

    ![9148742-e92bd5fa6be9d756.webp](assets/houdini-vex-九-创建-修改-删除几何体/007-a747b2e7.webp)

- 顶点必须要有寄托，不能凭空存在
二、修改
- setvertexpoint函数：修改顶点的住所（序号位置）
1）未修改前，2号面是逆时针，法线朝向背面

    ![9148742-92464001dfe690a1.webp](assets/houdini-vex-九-创建-修改-删除几何体/008-5e6e637d.webp)


    2）修改了2号面的1、2号顶点之后，法线朝前a


    ![9148742-f1e94d6b485055cf.webp](assets/houdini-vex-九-创建-修改-删除几何体/009-1d41c0df.webp)



三、删除

- removepoint函数：删除第几个输入端的第几号点

    ![9148742-c6fa55467d2cb5fc.webp](assets/houdini-vex-九-创建-修改-删除几何体/010-d186125a.webp)

- removeprim函数：删除第几个输入端的第几号面（线），是否包括点也一起删除（第三个参数为0，则不包含点；否则包含点一起删除）

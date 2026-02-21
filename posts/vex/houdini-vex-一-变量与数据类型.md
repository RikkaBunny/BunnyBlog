---
title: "Houdini VEX(一)变量与数据类型"
categories: ["VEX"]
date: "2023-07-07"
created: "2023-07-07T14:06:00.000Z"
updated: "2023-07-07T14:33:00.000Z"
notion_url: "https://www.notion.so/Houdini-VEX-041bd408738c4881ac41c10a4d266e5e"
database: "Houdini Notes"
source: "notion-sync"
---
1. 首先创建一个box，选中该节点按i进入
2. 创建attribute wrangle节点，连到box节点

    ![9148742-c59a9a7380c0f397.webp](assets/houdini-vex-一-变量与数据类型/001-f266f5f2.webp)

3. 选中attribute wrangle节点，然后按P打开参数面板，在红色区域输入vex代码：

    ![9148742-1f34eb6f971d1d11.webp](assets/houdini-vex-一-变量与数据类型/002-ca659122.webp)

4. 你也可以鼠标点击红色区域，按ALT+E打开vex代码编辑器：

    ![9148742-115aca6baba13e9b.webp](assets/houdini-vex-一-变量与数据类型/003-6d8d90bf.webp)


---


一、变量与数据类型

1. int 整数--多用来表示点、线、面的序列号，以及变换
2. float 浮点数（可以理解为小数）--多用于表示浮点标量值
3. vector2 二维向量 -- 多用于表示纹理坐标
4. vector 三维向量 -- 多用于表示位置、方向、法线、颜色RGB
5. vector4 四维向量 -- 多用于表示齐次坐标位置、带透明通道的颜色RGBA
6. matrix2 二维矩阵 -- 多用于表示2D旋转矩阵
7. matrix3 三维矩阵 -- 多用于表示3D旋转矩阵、2D变换（位移、旋转、缩放）矩阵
8. matrix 四维矩阵 -- 多用于表示3D变换矩阵
9. string 字符串
10. array 数组：有序的数据组合
11. struct 结构体

二、一些注意事项


![9148742-f1038288a3bc1727.webp](assets/houdini-vex-一-变量与数据类型/004-94346f39.webp)

1. 变量名可以用下划线
2. 变量名可以有数字，但不能放开头
3. 向量的每个分量都是浮点类型
4. 浮点数如果没有小数部分可以不加.0
5. 矩阵的每一行可以用花括号括起来，便于阅读；也可以不括
6. 字符串可以用单引号或双引号
7. 数组可以是空的
8. 数组中可以有一个数，甚至空的也可以
9. 如果把一个变量赋值给数组，则需要用array(变量)去赋值
10. 创建变量时可以不初始化，使用未初始化的变量会有绿色波浪线警告（Warning）；数组不会警告。赋值后警告消失

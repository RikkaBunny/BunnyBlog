---
title: "Houdini VEX(六)组(Group)的相关操作"
categories: ["VEX"]
date: "2023-07-07"
created: "2023-07-07T14:06:00.000Z"
updated: "2023-07-07T15:16:00.000Z"
notion_url: "https://www.notion.so/Houdini-VEX-Group-9ca21019ffe6471e8c888d6c4a9cfb01"
database: "Houdini Notes"
source: "notion-sync"
---
一、@group_name方法

- 等于1是建组，等于0是移除出去
- 这里我们对顶点的y值大于0的点打组到了up组，并对顶点序号是4的点移除出了up组

    ![9148742-93996a739a78fa0b.webp](assets/houdini-vex-六-组-group-的相关操作/001-39e2d51b.webp)

- 可以在spreadsheet中看到group分组

    ![9148742-3ec5be702bda44ed.webp](assets/houdini-vex-六-组-group-的相关操作/002-5b2e27f1.webp)

- 如果你在spreadsheet中看不到group，勾选group attributes

    ![9148742-97c1423dc2de219e.webp](assets/houdini-vex-六-组-group-的相关操作/003-13fc859b.webp)

- 我们也可以对组进行判断操作：

    ![9148742-7763e6b6ff9e083d.webp](assets/houdini-vex-六-组-group-的相关操作/004-c9991aa7.webp)


    1）这里我们判断，如果是up组，则颜色为绿色；否则为紫色


二、Dedicated Function：专门为group设计的函数

1. setpointgroup函数：把点添加到组中，或从组中移除

    ![9148742-be85956afc3a7c8e.webp](assets/houdini-vex-六-组-group-的相关操作/005-98b8e1fd.webp)


    1）把第0个输入端的顶点序号放进up组（1是放进，0是移除）

2. setpointgroup函数其他用法：多了最后一个参数--模式

    ![9148742-ac0d157ee01bca81.webp](assets/houdini-vex-六-组-group-的相关操作/006-2af61fc7.webp)


    1）toggle模式下，会切换当前的状态：如果当前的点在组里，会被切换到不在组里的状态；如果当前的点不在组里，会被切换到在组里的状态

3. inpointgroup函数：判断点在不在组里面
- 判断0号输入端中的顶点是否在up组，在组内，则返回1；否则返回0

    ![9148742-b99429c387d4c85d.webp](assets/houdini-vex-六-组-group-的相关操作/007-d9af032b.webp)

1. npointsgroup函数：返回该组中的多少点
- 0号输入端中有多少顶点是up组中的

    ![9148742-9fe468d017ebbc90.webp](assets/houdini-vex-六-组-group-的相关操作/008-f4c4aa35.webp)

1. expandpointgroup函数：把组中的元素都列出来

    ![9148742-8d06de251b12ec92.webp](assets/houdini-vex-六-组-group-的相关操作/009-fb53fdfe.webp)

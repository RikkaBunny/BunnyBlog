---
title: "Houdini VEX(八)循环语句"
categories: ["VEX"]
date: "2023-07-07"
created: "2023-07-07T14:06:00.000Z"
updated: "2023-07-07T15:16:00.000Z"
notion_url: "https://www.notion.so/Houdini-VEX-d2056bee10844d57ba98a11136f625da"
database: "Houdini Notes"
source: "notion-sync"
---
一、while循环语句


![9148742-b269962744773f63.webp](assets/houdini-vex-八-循环语句/001-5c7d7f19.webp)

- attribute wrangle节点本身就是个循环：

    ![9148742-3f91feb2e980ae01.webp](assets/houdini-vex-八-循环语句/002-75559035.webp)

- 一共是0-7号顶点，八个顶点，每个顶点执行一遍上面的while循环语句，满足条件的0123执行了七次，4567执行了0次，所以输出窗口是77770000

    ![9148742-74129e25f6a055de.webp](assets/houdini-vex-八-循环语句/003-2d6bf324.webp)


    二、do while循环语句


    ![9148742-9ed2b0a0d2317816.webp](assets/houdini-vex-八-循环语句/004-4fe3b3dd.webp)

- 用while语句达到和do while语句相同的效果：

    ![9148742-4902fae234f114f0.webp](assets/houdini-vex-八-循环语句/005-1692329b.webp)


    三、for循环语句


    ![9148742-d465458fd88a3594.webp](assets/houdini-vex-八-循环语句/006-b988d928.webp)

- @numpt：总顶点数量
- point函数：读取点的属性，上图中是读取0号输入端的第i个顶点的位置属性
- continue：跳过下方语句，进入下一次循环

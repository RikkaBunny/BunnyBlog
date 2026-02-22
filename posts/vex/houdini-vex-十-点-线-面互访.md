---
title: "Houdini VEX(十)点、线、面互访"
categories: ["VEX"]
date: "2023-07-07"
created: "2023-07-07T14:06:00.000Z"
updated: "2023-07-07T15:18:00.000Z"
notion_url: "https://www.notion.so/Houdini-VEX-a84382fe0b8746f299dd512c72dc1f81"
database: "Houdini Notes"
source: "notion-sync"
---
一、点、线、面互访


![9148742-3ec8965bdcc75c2b.webp](assets/houdini-vex-十-点-线-面互访/001-866f5f83.webp)

- 线性顶点序号：针对的是整个几何体的顶点序号
1）点击spreadsheet面板中的，勾选map offset（线性顶点序号）

    ![9148742-9f10fd67f6d6b0e8.webp](assets/houdini-vex-十-点-线-面互访/002-475e8e35.webp)

- 顶点序号：针对的是任一面的顶点序号
- setvertexattrib函数：设置顶点位置属性
1）一般情况，第三个参数是写面序号，此时第四个参数写顶点序号，但当第三个参数为-1时，表示第四个参数写线性顶点序号

    ![9148742-dcf96cf4e868fbe3.webp](assets/houdini-vex-十-点-线-面互访/003-2c44d425.webp)


    ![9148742-3756b5d58c37af71.webp](assets/houdini-vex-十-点-线-面互访/004-f7e34ce3.webp)

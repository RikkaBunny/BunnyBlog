---
title: "Houdini VEX(七)条件语句"
categories: ["VEX"]
date: "2023-07-07"
created: "2023-07-07T14:06:00.000Z"
updated: "2023-07-07T15:16:00.000Z"
notion_url: "https://www.notion.so/Houdini-VEX-3310cb31793141438d11cad3e11ce1b4"
database: "Houdini Notes"
source: "notion-sync"
---
一、if(判断条件)，条件为真则执行，假则不执行

- 非0就是真
- 判断条件写成浮点会有警告

    ![9148742-ee652ece72ffe60b.webp](assets/houdini-vex-七-条件语句/001-0558902d.webp)

- 或 or ||
- 且 and &&
- 非 not !

    ![9148742-4cbb1d604bcb3045.webp](assets/houdini-vex-七-条件语句/002-bcaa51a4.webp)

- 花括号{}

    ![9148742-8dcf5ad5db80b803.webp](assets/houdini-vex-七-条件语句/003-d62f9025.webp)

- if...else...

    ![9148742-3562276f9e272471.webp](assets/houdini-vex-七-条件语句/004-19ae39ef.webp)

- else if

    ![9148742-4342b3264c85d7aa.webp](assets/houdini-vex-七-条件语句/005-9012c665.webp)

- 三目运算符：
- 写法：语句1？语句2：语句3
- 如果语句1为真，则执行语句2；否则执行语句3

    ![9148742-88d777ed5290bd91.webp](assets/houdini-vex-七-条件语句/006-f4fb2afa.webp)

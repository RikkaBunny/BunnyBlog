---
title: "烟雾or流体or火焰简单思路"
categories: ["Trick"]
date: "2023-07-08"
created: "2023-07-08T03:48:00.000Z"
updated: "2023-07-08T03:54:00.000Z"
notion_url: "https://www.notion.so/or-or-e3b1f617cbd14b6d89e586c7b74ed288"
database: "Trick Notes"
source: "notion-sync"
---
[https://twitter.com/SoerbGames/status/1270766023139119104](https://twitter.com/SoerbGames/status/1270766023139119104)


把物体移动移动轨迹记录下来，做历史帧叠加然后衰减，像做雪和草一样，然后对历史叠加帧没帧做一个偏移(向上或者向下 ，模仿重力下落或者往上飘的感觉)，对历史叠加帧做noise扭曲使其看起来更像火焰或者流体，最后blur一下就好了


![Untitled.png](assets/烟雾or流体or火焰简单思路/001-c9a919d4.png)


![Untitled.png](assets/烟雾or流体or火焰简单思路/002-d3999a07.png)


![Untitled.png](assets/烟雾or流体or火焰简单思路/003-8943ea7d.png)


![Untitled.png](assets/烟雾or流体or火焰简单思路/004-520bbf35.png)


![Untitled.png](assets/烟雾or流体or火焰简单思路/005-f3112171.png)

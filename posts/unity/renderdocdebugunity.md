---
title: "RenderDocDebugUnity"
categories: ["Unity"]
date: "2023-07-07"
created: "2023-07-07T13:24:00.000Z"
updated: "2023-07-07T13:28:00.000Z"
notion_url: "https://www.notion.so/RenderDocDebugUnity-3bea83ab58634a65b691388f5267b7b9"
database: "Unity Technical"
source: "notion-sync"
---
下载完RenderDoc之后，unity Game视图自动有LoadRenderDoc菜单，


![Untitled.png](assets/renderdocdebugunity/001-26d025d8.png)


点击加载就可以，加载完成点击截帧就可以啦。


![Untitled.png](assets/renderdocdebugunity/002-226368fc.png)


调试我们的shader了 ,这时候要注意的一个点就是我们要在我们的shader里面加上一句宏


 `#pragma enable_d3d11_debug_symbols`

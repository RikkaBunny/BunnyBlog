---
title: "草、苔藓、Atlas小片houdini自动生成模型"
categories: ["Houdini"]
date: "2023-07-07"
created: "2023-07-07T16:30:00.000Z"
updated: "2023-07-07T16:30:00.000Z"
notion_url: "https://www.notion.so/Atlas-houdini-c15f6982cab543279a363dff300c4391"
database: "Houdini Technical"
source: "notion-sync"
---
首先下载Quixel的Atlas图集素材


![Untitled.png](assets/草-苔藓-atlas小片houdini自动生成模型/001-d77dd341.png)


我们需要在houdini里面开一个相同像素的Grid，给这个Grid片上一个从0到1的UV，然后使用attribfrommap这个节点，使用下载的Opacity图来把图上的Cd给我们Mesh点的Cd上。


![Untitled.png](assets/草-苔藓-atlas小片houdini自动生成模型/002-f9182324.png)


我们可以稍微给一点点的blur，把边缘略微的模糊一下，使用blast剔除掉Cd为0的点，保留下我们的面片模型，这时的面片顶点数有些高了，接下来就是循环处理每个面片为它自动减面啦。


![Untitled.png](assets/草-苔藓-atlas小片houdini自动生成模型/003-91abf5fc.png)


最简单的就是用一个box片去代替每个面片，一般渲染为了性能考虑我们需要把像素Opacity部分尽量减少，顶点也要尽量少，最简单这里就使用一个凸包来框住我们的mesh模型。


然后留下凸包的正面面片得到低模面片，删除冗余属性，为它赋上法线，将原本高模面片上的UV转移到低模面片，将每一个低模面片回归世界中心，设置好轴点，Pack起来便可以输出啦。


![Untitled.png](assets/草-苔藓-atlas小片houdini自动生成模型/004-965150c0.png)

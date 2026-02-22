---
title: "Houdini VEX(四)获取全局变量"
categories: ["VEX"]
date: "2023-07-07"
created: "2023-07-07T14:06:00.000Z"
updated: "2023-07-07T15:17:00.000Z"
notion_url: "https://www.notion.so/Houdini-VEX-7847f934e1f547e6a1f2c126cad04511"
database: "Houdini Notes"
source: "notion-sync"
---
一、全局变量的定义：以 符号开头的变量如：E是自然对数，F是整数帧，FF是浮点帧，$FPS是帧速率


二、 如何在vex中获取全局变量

1. 有些是可以通过"$"获取的，有些不行：

    ![9148742-b9b3578a9ba6fcf0.webp](assets/houdini-vex-四-获取全局变量/001-984a0647.webp)

- 这里有些可以有些不可以，比如$E可以，而当前帧就得用@Frame来获取

三、比较特殊的全局变量-仅仅在动力学当中才用得上

1. 简单的动力学网络：

    ![9148742-61673f2ce8b24fcf.webp](assets/houdini-vex-四-获取全局变量/002-2bf6af82.webp)

2. 解算开始帧改为24帧：

    ![9148742-3af1e4bc5c4edd52.webp](assets/houdini-vex-四-获取全局变量/003-902c2853.webp)

3. 进入dopnet节点：

    ![9148742-418e11bb19bae0df.webp](assets/houdini-vex-四-获取全局变量/004-db58cbc3.webp)

4. emptyobject节点用来存放动力学数据

    ![Untitled.png](assets/houdini-vex-四-获取全局变量/005-1ebcb50d.png)

5. 见了一个sopgeo节点，里面存放了一个box

![Untitled.png](assets/houdini-vex-四-获取全局变量/006-37ae8df3.png)

1. 用geometrywrangle节点去解算它：

![Untitled.png](assets/houdini-vex-四-获取全局变量/007-eb1f83f5.png)

- 这种紫色节点是一种解算器：

    ![9148742-6f97e521a46614b5.webp](assets/houdini-vex-四-获取全局变量/008-00218505.webp)


7.使用multisolver节点去解算动力学对象：


    ![9148742-56c81e9b7a42ee64.webp](assets/houdini-vex-四-获取全局变量/009-7bb0c201.webp)

1. @SimFrame：当前解算到了第几帧 （只能在动力学里面用）
- 把第一行注释去掉，移动到第24帧(因为咱们刚刚将解算开始帧设为第24帧)

    ![9148742-d270dee9524359b7.webp](assets/houdini-vex-四-获取全局变量/010-817bc6e6.webp)

- 在multisolver节点右键Spreadsheet...

    ![9148742-737b6bab0f80325b.webp](assets/houdini-vex-四-获取全局变量/011-62eb38fa.webp)

- 找到sopgeo节点里的box：

    ![9148742-7464fadbbae47baf.webp](assets/houdini-vex-四-获取全局变量/012-0590e2c7.webp)

- 可以看到box的y轴位置变为了2，因为我们把第24帧设为了开始的第一帧，所以当我们移动到第25帧时，也就是第二帧：

    ![9148742-6af5df750191e771.webp](assets/houdini-vex-四-获取全局变量/013-602edaba.webp)

1. @SimTime：当前解算到了第几秒
- 点右下角可以更改帧率：

    ![9148742-cc4a1fba4397a02c.webp](assets/houdini-vex-四-获取全局变量/014-9536bce1.webp)

- 更改FPS为24：

    ![9148742-8f7c5fd4e8d5e074.webp](assets/houdini-vex-四-获取全局变量/015-1cc93131.webp)

- 查看：从24帧到48帧，刚好一秒钟时间（一帧是(1/FPS)秒，FPS=24，(48-24)/FPS=1秒）

    ![9148742-8ea7df448e80d417.webp](assets/houdini-vex-四-获取全局变量/016-96c42d5c.webp)

1. @TimeInc：时间增量
- y值的计算：(62-36)_1/FPS,FPS=24,所以(62-36)_1/24=1.08333，每帧增加0.04
第36帧时：

    ![9148742-203cd822a324e9cf.webp](assets/houdini-vex-四-获取全局变量/017-42646f88.webp)


    
第62帧时：


    ![9148742-0702b7fce578d5da.webp](assets/houdini-vex-四-获取全局变量/018-f96be185.webp)

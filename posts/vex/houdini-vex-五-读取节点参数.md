---
title: "Houdini VEX(五)读取节点参数"
categories: ["VEX"]
date: "2023-07-07"
created: "2023-07-07T14:06:00.000Z"
updated: "2023-07-07T14:35:00.000Z"
notion_url: "https://www.notion.so/Houdini-VEX-37c255e7b6074ee186d15939f149bedf"
database: "Houdini Notes"
source: "notion-sync"
---
一、节点参数的定义：能够在属性面板中看到的参数


![9148742-fc3e30bed348ce2a.webp](assets/houdini-vex-五-读取节点参数/001-7d8086ac.webp)


二、既叫做节点参数，也叫做通道
三、用ch*()读取各种类型的参数(通道)

1. ch也就是channel(通道)的缩写

    ![9148742-294bcef4b46c64e1.webp](assets/houdini-vex-五-读取节点参数/002-e4859204.webp)

2. 写完vex代码，点击右侧的按钮，在下侧就会生成刚刚写的通道：

    ![9148742-1c610524da774412.webp](assets/houdini-vex-五-读取节点参数/003-e2498ddc.webp)

3. 测测前面写的：打印代码的值，看看是不是和通道中的值相同

    ![9148742-2fcca578458a0369.webp](assets/houdini-vex-五-读取节点参数/004-05927ca2.webp)


四、chramp()的用法以及注意事项

1. 以@P.x的值作为输入，经过下面的映射处理，再输出给@P.y的值

    ![9148742-67ffce4d9c43ce84.webp](assets/houdini-vex-五-读取节点参数/005-3632d640.webp)

- ramp需要自变量的范围在0-1之间，超出范围会循环
1. fit函数可以把一个范围映射到另一个范围：这里我们把@P.x的值映射到0到1之间，最小值用min通道表示，最大值用max通道表示：

    ![9148742-d25395fe8700e0b2.webp](assets/houdini-vex-五-读取节点参数/006-54fac16c.webp)

2. chf函数的其他用法：

    ![9148742-19ff6bc76475c765.webp](assets/houdini-vex-五-读取节点参数/007-8f0e29ef.webp)

- 可以用来找绝对路径的参数值
- 可以用来找相对路径的参数值（../表示当前节点的上一级）

五、可以通过鼠标拖动通道到场景视图中，切换到选择工具或者移动工具可以改变滑条的值：


![9148742-e878cc0b992f9ecd.webp](assets/houdini-vex-五-读取节点参数/008-c0bc948a.webp)

- 点这里调节手柄大小：

    ![9148742-8a918addbcc23ea5.webp](assets/houdini-vex-五-读取节点参数/009-803a6d73.webp)

- 如果滑块没效果，点击这里设置手柄的参数：

    ![9148742-5982412efd48b11f.webp](assets/houdini-vex-五-读取节点参数/010-78f6634e.webp)


    1）可以设置范围：


    ![9148742-ed7323596d0afd89.webp](assets/houdini-vex-五-读取节点参数/011-12efc611.webp)

- 如果不想看到滑条，可以在移动工具处右键隐藏：

    ![9148742-db4e4667ad82efd4.webp](assets/houdini-vex-五-读取节点参数/012-dca6a140.webp)


    六、返回矢量的chramp函数

- chramp函数默认返回的是浮点类型，用vector函数框起来后，返回的就是矢量类型：

    ![9148742-c67ce4f4b9c69709.webp](assets/houdini-vex-五-读取节点参数/013-e475cd76.webp)

- 把chramp也限定到0-1之间：

    ![9148742-ce05350fef8936fd.webp](assets/houdini-vex-五-读取节点参数/014-ba1660b4.webp)


    七、ch的其他用法


    ![9148742-26ac8f2bd204e690.webp](assets/houdini-vex-五-读取节点参数/015-526e082f.webp)

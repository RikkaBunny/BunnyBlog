---
title: "Houdini VEX(二十一)VOP中使用Snippet写VEX"
categories: ["VEX"]
date: "2023-07-07"
created: "2023-07-07T14:06:00.000Z"
updated: "2023-07-07T15:22:00.000Z"
notion_url: "https://www.notion.so/Houdini-VEX-VOP-Snippet-VEX-75df352e0b214cf0bcb5cfa32a929803"
database: "Houdini Notes"
source: "notion-sync"
---
![9148742-69b15c23ef2cf20f.webp](assets/houdini-vex-二十一-vop中使用snippet写vex/001-c731693e.webp)


![9148742-8a9d26c46479cc56.webp](assets/houdini-vex-二十一-vop中使用snippet写vex/002-bfa8b45d.webp)


![9148742-6cbea0e9e8522bf5.webp](assets/houdini-vex-二十一-vop中使用snippet写vex/003-20846d06.webp)


![9148742-d9d866d9ed3e9514.webp](assets/houdini-vex-二十一-vop中使用snippet写vex/004-4d8c7943.webp)


![9148742-a14c35e73d1baaac.webp](assets/houdini-vex-二十一-vop中使用snippet写vex/005-2554835d.webp)


![9148742-6be5d40ce3731974.webp](assets/houdini-vex-二十一-vop中使用snippet写vex/006-f77d0f8a.webp)


![9148742-fbdbc6f129c5fc58.webp](assets/houdini-vex-二十一-vop中使用snippet写vex/007-2846d858.webp)


一、VOP中使用Snippet写VEX

1. VEX本身就是snippet：点进wrangle里面，就是snippet

    [embed]()

2. 自己尝试用snippet写成和wrangle里一样的效果
- 先创建一个attribvop节点

    ![9148742-aee8452f4c9bb8cc.png](//upload-images.jianshu.io/upload_images/9148742-aee8452f4c9bb8cc.png?imageMogr2/auto-orient/strip|imageView2/2/w/549/format/webp)

- 进入attribvop节点，创建一个snippet节点

    ![9148742-68054d05eaa98243.png](//upload-images.jianshu.io/upload_images/9148742-68054d05eaa98243.png?imageMogr2/auto-orient/strip|imageView2/2/w/896/format/webp)

- 删除剩下的两个节点

    ![9148742-8eb0ab1cc296fa13.png](//upload-images.jianshu.io/upload_images/9148742-8eb0ab1cc296fa13.png?imageMogr2/auto-orient/strip|imageView2/2/w/988/format/webp)

- 写上代码，并将Bindings to Export写上星号（这样带@的属性就是可读可写的，不打星号是只读的）

    ![9148742-d5242ea85a85f936.png](//upload-images.jianshu.io/upload_images/9148742-d5242ea85a85f936.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

1. 在vop中额外的使用snippet做些其他的事情
- vop和wrangle有他们各自的好处
- vop中用noise很方便

创建一个turbnoise节点


![9148742-69b15c23ef2cf20f.png](//upload-images.jianshu.io/upload_images/9148742-69b15c23ef2cf20f.png?imageMogr2/auto-orient/strip|imageView2/2/w/1098/format/webp)


创建一个displace along normal节点，并连线


![9148742-8a9d26c46479cc56.png](//upload-images.jianshu.io/upload_images/9148742-8a9d26c46479cc56.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)


我们希望某个方向上强，然后逐渐朝某个方向上衰减，我们用点乘Dot Product节点，再用fit range节点映射范围，修改属性值，并连线


![9148742-6cbea0e9e8522bf5.png](//upload-images.jianshu.io/upload_images/9148742-6cbea0e9e8522bf5.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

- 再在以上基础上，加入snippet

![9148742-6e9fc077609dfeaa.png](//upload-images.jianshu.io/upload_images/9148742-6e9fc077609dfeaa.png?imageMogr2/auto-orient/strip|imageView2/2/w/707/format/webp)


如果要在snippet里获取noise属性，需要将noise节点连接到snippet节点
如果想要P可写，需要在Bindings to Export上写上P


![9148742-d9d866d9ed3e9514.png](//upload-images.jianshu.io/upload_images/9148742-d9d866d9ed3e9514.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)


再加个法线


![9148742-a14c35e73d1baaac.png](//upload-images.jianshu.io/upload_images/9148742-a14c35e73d1baaac.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

- 比较效果

    ![9148742-4f91da026b6af3f0.png](//upload-images.jianshu.io/upload_images/9148742-4f91da026b6af3f0.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)


打开snippet节点


![9148742-6be5d40ce3731974.png](//upload-images.jianshu.io/upload_images/9148742-6be5d40ce3731974.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)


打开vop节点


![9148742-fbdbc6f129c5fc58.png](//upload-images.jianshu.io/upload_images/9148742-fbdbc6f129c5fc58.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)


这两个效果是一样的，都是置换效果

- 给snippet添加和vop一样的dot效果
给snippet添加个用户控制，中键点击snippet上的next属性，点击Promote Parameter
显示
调整属性值
继续添加点乘，映射
再添加一个可以用户控制的值
修改代码，让用户控制的maxAngle从0-180映射到1到-1

    双击


    
继续添加点乘，映射


    ![9148742-bd62cedf530853d4.webp](assets/houdini-vex-二十一-vop中使用snippet写vex/008-8f80f70f.webp)


    ![9148742-5cf65615601e4b03.webp](assets/houdini-vex-二十一-vop中使用snippet写vex/009-240d94f8.webp)


    
修改代码，让用户控制的maxAngle从0-180映射到1到-1


    ![9148742-69c3b34db08c29a3.webp](assets/houdini-vex-二十一-vop中使用snippet写vex/010-a31383ef.webp)


    ![9148742-f8aab48c2e3b429a.webp](assets/houdini-vex-二十一-vop中使用snippet写vex/011-ecfed746.webp)

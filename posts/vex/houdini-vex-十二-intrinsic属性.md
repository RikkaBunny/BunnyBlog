---
title: "Houdini VEX(十二)Intrinsic属性"
categories: ["VEX"]
date: "2023-07-07"
created: "2023-07-07T14:06:00.000Z"
updated: "2023-07-07T15:19:00.000Z"
notion_url: "https://www.notion.so/Houdini-VEX-Intrinsic-ea01cf3997314570998aca320dc911b3"
database: "Houdini Notes"
source: "notion-sync"
---
一、Intrinsic属性和普通属性基本相似，区别在于普通属性存储在几何体上，Intrinsic属性仅在需要的时候计算出来
二、只有prim和detail有intrinsic属性


![9148742-797da39ae5b0ce6a.webp](assets/houdini-vex-十二-intrinsic属性/001-e0ca4bcc.webp)


三、solidembed节点：将模型变成四边形网格


![9148742-0bb5bce3b9cfc797.webp](assets/houdini-vex-十二-intrinsic属性/002-30d359db.webp)


![9148742-41b08a8fb85b5e93.webp](assets/houdini-vex-十二-intrinsic属性/003-63f21504.webp)


四、读取的方法一：prim函数

- 代码：

`//读取0号输入端的prim序号测量出来的体积
if(prim(0,'intrinsic:measuredvolume',@primnum) > chf('threshold'))//threshold是定义的一个阈值，可用通过调整来控制显示的面
    removeprim(0,@primnum,1);//移除这个面，1代表并删除顶点
/*   
measuredarea 测量出来的面积
measuredperimeter 测量出来的周长
measuredvolume 测量出来的体积
*/`


五、读取的方法二：primintrinsic函数（最常用）

- 代码：

`if(primintrinsic(0,'measuredarea',@primnum)>chf('threshold'))
    removeprim(0,@primnum,1);
/*   
measuredarea 测量出来的面积
measuredperimeter 测量出来的周长
measuredvolume 测量出来的体积
*/`


六、读取的方法三：在组里写，满足这个组的才会alpha变成0


![9148742-e07276eb26b55cea.webp](assets/houdini-vex-十二-intrinsic属性/004-3384b4e5.webp)

- ch('threshold')是用esc键下面的波浪线那个按键括起来的

七、写的方法一：setprimintrinsic函数

- 代码：

`matrix3 trans = 4; //意味着{4,0,0, 0,4,0, 0,0,4}
setprimintrinsic(0,'transform',0,trans);//该属性负责旋转和缩放`


八、写的方法二：先pack节点打包，然后会多出来一些intrinsic属性，再通过setprimintrinsic函数控制这些intrinsic属性


![9148742-04a59845d1743319.webp](assets/houdini-vex-十二-intrinsic属性/005-83d7e5b6.webp)

- 这些intrinsic属性都可以控制：

    ![9148742-d6186b8b43ad95db.webp](assets/houdini-vex-十二-intrinsic属性/006-6e5ebe6f.webp)

- 代码：

`setprimintrinsic(0,'viewportlod',0,'box');//pack geo在视口的显示模式
setprimintrinsic(0,'pivot',0, set(0,chf('height'),0) );//轴心点`


九、写的方法三：通过isooffset节点先转化成体积，然后通过setprimintrinsic函数控制体积独有的intrinsic属性


![9148742-5331993cfbfee537.webp](assets/houdini-vex-十二-intrinsic属性/007-988d05b0.webp)

- 读写同理，都可以找到这些intrinsic属性
- 不同种的prim有不同的intrinsic属性
十、写的方法四：先convertvdb节点转化，再跟上面同理

    ![9148742-cc011a8c25c27329.webp](assets/houdini-vex-十二-intrinsic属性/008-1eb96310.webp)

- 代码：

`setprimintrinsic(0,'vdb_class',0,'sdf volume');//vdb体积类型`


十一、还有很多不同的intrinsic属性可以写，需要去探索
十二、Spreadsheet中，灰色的Intrinsic属性是不可更改的

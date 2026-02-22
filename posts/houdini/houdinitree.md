---
title: "HoudiniTree"
categories: ["Houdini"]
date: "2023-07-07"
created: "2023-07-07T15:23:00.000Z"
updated: "2023-07-07T15:23:00.000Z"
notion_url: "https://www.notion.so/HoudiniTree-d855b33439a64b349e6019b67d994b1e"
database: "Houdini Technical"
source: "notion-sync"
---
**Houdini使用L-System生成树流程**


首先先上操作部分：


![2.png](assets/houdinitree/001-b9afb819.png)






类型为tube


![3.png](assets/houdinitree/002-d2450232.png)



勾选Apply Tube Texture Coordinates 会自动计划uv


![4.png](assets/houdinitree/003-a2611011.png)


这里先创建一个骨干树枝，含义为：(最下面有语法介绍，防止枯燥先不讲语法)


初始角度在2度之内随机在迭代次数为1或者5的时候，应用厚度缩放(厚度乘当前厚度) 应用长度缩放 应用重力 随机5度内 前进一步 A替换 ：80%概率(.8=0.8)


在迭代次数为1或者5的时候，进入在25度内随机的B分支，应用厚度缩放 应用长度缩放 应用重力 随机5度内 前进一步 A替换 ：20%概率


在迭代次数大于1并且不等于5时候，应用厚度缩放 应用长度缩放 应用重力 随机2度内 前进一步 A替换长度缩放 


长度缩放 前进一步 长度缩放 长度缩放。


接下看计算包围盒Y轴大小，每个点Y轴高度/最高点Y轴高度得到一个0-1的ramp。


![5.png](assets/houdinitree/004-a44ac579.png)


在撒点范围内撒树枝生成点，


![6.png](assets/houdinitree/005-602a1c57.png)


制作树枝：


![7.png](assets/houdinitree/006-3fd8801c.png)



 J为第一个输入口的物体。


![8.gif](assets/houdinitree/007-b51e7607.gif)



应用重力可以制作植物自然向上生长或者下垂的效果。


使用CopyToPoint把树枝生成在主树干的ScatterPoint上


![9.png](assets/houdinitree/008-7452c9c1.png)


法线传递：


![10.png](assets/houdinitree/009-07c23ea4.png)


先使用凸包构建一个mesh之后将mesh转换为VDB体素(平滑mesh)再将体素转换为mesh，连接remesh细分网格之后在smooth平滑一下，最后计算包围盒法线。使用包围盒法线转导到树mesh点上。


![11.png](assets/houdinitree/010-9bfab0d8.png)


![12.png](assets/houdinitree/011-458a4b80.png)


![13..png](assets/houdinitree/012-12b1a9e9.png)


(预览有点错误，渲染结果正确的)


最后在使用上PDG：


![14.gif](assets/houdinitree/013-9fd91a2c.gif)


一分钟就可以得到50颗不同的树 QwQ


后面便是无聊语法部分


L-System：Lindenmayer system，简称 L-system，是由荷兰乌特勒支大学的生物学和植物学家，匈牙利裔的 Aristid Lindenmayer 于 1968 年提出的有关生长发展中的细胞交互作用的数学模型，被广泛应用于植物生长过程的研究和建模，也常用于模拟各种生物体的形态。



**L-system 语法**


L-system 是一系列不同形式的语法规则，它的自然递归规则产生自相似性，也能用于生成自相似的分形，例如迭代函数系统。


例如，Lindenmayer 研究海藻生长模式时提出的最早的 L-system：


**变量** : A B


**常量** : 无


**公理 **(axiom) : A


**规则** : (A → AB), (B → A)


迭代过程：


![15.png](assets/houdinitree/014-8da1f37d.png)


L-system 规则的一般形式为:


 字符串[:条件]=[左分支]字符串[右分支][:概率]


式子通常是由一系列符合规则的表达式构成。


字符串：   


 通常为一系列符合规则的表达式。


条件：


分支：在L-systems中，使用方括号([])创建分支。放在方括号内的任何L-System命令都由一个新的L-System独立于主字符串执行。


![16.png](assets/houdinitree/015-45a9ae28.png)


![17.png](assets/houdinitree/016-e2af0636.png)


概率：


规则示例：


F：     向前移动一步，画一条线连接前一个位置和新位置。


f：     不画线就往前走。


+：     向右旋转  参数面板Values下Angle  度。


-：    向左旋转  参数面板Values下Angle  度。


![18.png](assets/houdinitree/017-3e5dc296.png)


![19.png](assets/houdinitree/018-9d85794c.png)



angle为90°


替换表达式       A=F+A


![20.png](assets/houdinitree/019-9931bc2c.png)


到目前为止所描述的系统生成平面几何。要在3D中移动L-System，您可以使用&(向上俯仰)、^(向下俯仰)、\\(顺时针滚动)和/(逆时针滚动)命令。例如，初始 Premise FFFA和Rule A=“[&FFFA] //// [&FFFA] /// [&FFFA] [&FFFA]”。


![21.png](assets/houdinitree/020-a911ddcf.png)


不同迭代次数的结果使用   


![22.png](assets/houdinitree/021-a7466bca.png)


![23.png](assets/houdinitree/022-c150e534.png)


A= " [&FFFA] //// [&FFFA] //// [&FFFA] 能看到有重复冗余部分，所以


Rule 1    A= " [B] //// [B] //// [B]


Rule 2    B= &FFFA     也是同样的效果。


注意，双规则系统需要两倍的代才能产生相同的结果。这是因为每一代执行一个规则替换。


![24.png](assets/houdinitree/023-eb112559.png)


命令参数：


F(l,w,s,d)


向前移动(创建几何体)距离l 宽度w  竖向分割数s  横向分割数d


![25.png](assets/houdinitree/024-5961d2c8.png)


T(g)


应用取向向量(重力)。这就使海龟朝向负的Y轴。改变的量由g决定。默认的改变是使用重力参数。


+(a)


右转a度。默认的角。


-(a)


向左转a度(减号)。默认的角。


&(a)


向上调高a度。默认的角。


^(a)


向下倾斜a度。默认的角。


\\(a)


顺时针旋转a度。默认的角。


/(a)


逆时针旋转a度。默认的角。


|


转180度


*


转动180度


~(a)


随机俯仰/滚动/旋转数到一个度。默认的180。


"(s)


用s乘以当前长度。默认步长。


!(s)


用s乘以当前的厚度。默认的厚度。


;(s)


将当前角度乘以s。默认角度比例。


_(s)


当前长度除以s。默认步长比例。


?(s)


当前宽度除以s。默认的厚度比例。


@(s)


将当前角度除以s。默认角度。


'(u)


默认UV增量的第一个参数。


#(v)


默认UV增量的第二个参数。


%


把树枝的剩余部分剪掉


$(x,y,z)


旋转turtle ，所以向上的向量是(0,1,0)。将turtle 指向点(x,y,z)的方向。默认的行为只是定位，而不是改变方向。


[


分支开始


]


分支结束


![26.png](assets/houdinitree/025-812f4a5e.png)



鼠标右键悬停参数便能看见。

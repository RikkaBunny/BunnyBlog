---
title: "高级水面白沫涟漪OR海浪"
categories: ["UE"]
date: "2024-01-17"
created: "2024-01-17T03:34:00.000Z"
updated: "2024-01-17T03:35:00.000Z"
notion_url: "https://www.notion.so/OR-5283a0595cae4f42b88b2552302427e4"
database: "UE Technical"
source: "notion-sync"
---
![Untitled.png](assets/高级水面白沫涟漪or海浪/001-589984b9.png)


这是我们传统的通过水面当前像素深度、世界坐标位置、场景深度、相机位置求得一个稳定的水面深度，深度有两种，一种是从摄像机出发的深度，另一种则是垂直深度。这里我们求的为垂直深度。


![Untitled.png](assets/高级水面白沫涟漪or海浪/002-da4cf22d.png)


（这里我用的SingleLayerWater，得到场景深度的节点为SceneDepthWithoutWater，正常半透明用SceneDepth）


**注意：SingleLayerWater的深度图存在降采样与半精度问题**


**r.Water.SingleLayer.RefractionDownsampleFactor 1**


**r.Water.SingleLayer.RefractionFullPrecision 1**


实际使用需要在代码里面更改一下默认值。我这里已经改过了。


得到水的深度这个线性值之后，便是捏水波或者说白沫的形状了，这部分全靠自己调整一下波形的相位、周期、振幅这些，而且也不局限于Sin波，只需要是连续可导的就行，有点像自己捏一个噪声。


![Untitled.png](assets/高级水面白沫涟漪or海浪/003-157c6484.png)


为了展示这种方法会出现的问题，这里我简单给个sin做示范。


可以看见在这种深度渐变比较均匀的地形上，这个方法是比较不错的，而且视角的变动也不会影响水波。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/0959c3b1-8235-462f-a061-bfde55041d4a/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZA5AP5QR%2F20260301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260301T121931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCeil1hZG1E7TaT8uIB1UX9tMtoRm5pc3%2Barflphix0ngIhAPRRrqZO%2BJ%2BFg8c5lMr3hyuaSS8SdlDHzEOEPudc2QJIKv8DCGkQABoMNjM3NDIzMTgzODA1Igz%2F7AOHUtVrxMj1LnMq3AOEkK%2B2%2Fy0%2FfgmlapwG2Y7kqjhtujcDwNVAI3NU9C60MRF%2Ft2ofxJqJFs8LJKiw68uvVKzDqxVzjAUzad7n%2FZDDmO%2FP7iPzVut5sndEjwNMQOcfL0jIsNzS1cfCFVg28N719746p6hl3XBKFvXN4czpjJwY2CzkzDm6THP7AfO%2F04wysxBra92PYCUs9oZ45vTz3zX02rY7wMYwRlqCy4Jf2pJq8SncmGYV2nPTFOS%2BNUC66U61CxQG1SaP%2Fnut7e77mruKl5rk0iUNjGNBwETqd4JD644BWEkh8oIMCjFTCwArvGWLoy2TtdfiWiY%2B1o0%2BZ8m8kdUt%2FrN%2FMAue9nNl8lVDOikQ5rjHn9yYI%2BIaXffhMXFFBCHOF%2BTNiwJKXsMF69QWw35Zn1Yc3vCRU5ef5LH8WkYc64yglMD6pvBhgZPzgBh%2Fm5JN5IczAYrkqlnPa0ofZmsI45tChcVUtphZ0zGfG%2BXoQhnjdAuklFLXCMs7B4TddvIU5yVbgbixtZk7PWRRy1J0SsVB49k0damVhQZxqxFD%2FsVjPVCNFD%2BO2K7s9aVGqC%2FM2BQGGd0fNt2rgc7WrimQmrNjTUBT6LJz7ftA2TQW%2B8T67GiH7sc%2BOwJwLoS%2FgNK7gAIDXTD26o%2FNBjqkAZ2CfcZNKOk%2F%2FxqU0vyjGA77vv0sMgHMLOYHdyu%2BvrZsIWL1bRuwCoGyr69E%2BGR0g1YKJwLq4X4k5cSnmuYuti%2BT9yPsXlMcsZs43r8k8wwCoOAcyHhIgQjsp3acm28gZDnRIeX5QzmJEAjLIGoJjJxSqQYzjbnzV%2Bo%2FEkGM%2FhYM2oi64tx0Pxjgotc7JyUjwCOfkTvDFrk7CT2K8IlL%2Fzy3yhpD&X-Amz-Signature=3fbe00ea6d645828eabeaec1c48aa6ee261dca8ce523326ca86b81b0e6f78a82&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


但是，如果在深度渐变不均匀的地形或者场景中，就特别容易发生白沫大面积出现的问题。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/9a4613c1-b501-4363-b2a7-8003263eda47/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZA5AP5QR%2F20260301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260301T121931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCeil1hZG1E7TaT8uIB1UX9tMtoRm5pc3%2Barflphix0ngIhAPRRrqZO%2BJ%2BFg8c5lMr3hyuaSS8SdlDHzEOEPudc2QJIKv8DCGkQABoMNjM3NDIzMTgzODA1Igz%2F7AOHUtVrxMj1LnMq3AOEkK%2B2%2Fy0%2FfgmlapwG2Y7kqjhtujcDwNVAI3NU9C60MRF%2Ft2ofxJqJFs8LJKiw68uvVKzDqxVzjAUzad7n%2FZDDmO%2FP7iPzVut5sndEjwNMQOcfL0jIsNzS1cfCFVg28N719746p6hl3XBKFvXN4czpjJwY2CzkzDm6THP7AfO%2F04wysxBra92PYCUs9oZ45vTz3zX02rY7wMYwRlqCy4Jf2pJq8SncmGYV2nPTFOS%2BNUC66U61CxQG1SaP%2Fnut7e77mruKl5rk0iUNjGNBwETqd4JD644BWEkh8oIMCjFTCwArvGWLoy2TtdfiWiY%2B1o0%2BZ8m8kdUt%2FrN%2FMAue9nNl8lVDOikQ5rjHn9yYI%2BIaXffhMXFFBCHOF%2BTNiwJKXsMF69QWw35Zn1Yc3vCRU5ef5LH8WkYc64yglMD6pvBhgZPzgBh%2Fm5JN5IczAYrkqlnPa0ofZmsI45tChcVUtphZ0zGfG%2BXoQhnjdAuklFLXCMs7B4TddvIU5yVbgbixtZk7PWRRy1J0SsVB49k0damVhQZxqxFD%2FsVjPVCNFD%2BO2K7s9aVGqC%2FM2BQGGd0fNt2rgc7WrimQmrNjTUBT6LJz7ftA2TQW%2B8T67GiH7sc%2BOwJwLoS%2FgNK7gAIDXTD26o%2FNBjqkAZ2CfcZNKOk%2F%2FxqU0vyjGA77vv0sMgHMLOYHdyu%2BvrZsIWL1bRuwCoGyr69E%2BGR0g1YKJwLq4X4k5cSnmuYuti%2BT9yPsXlMcsZs43r8k8wwCoOAcyHhIgQjsp3acm28gZDnRIeX5QzmJEAjLIGoJjJxSqQYzjbnzV%2Bo%2FEkGM%2FhYM2oi64tx0Pxjgotc7JyUjwCOfkTvDFrk7CT2K8IlL%2Fzy3yhpD&X-Amz-Signature=8ebda1e45afc95ca05b3f5d59bd1d2bb413cb742776059db0ca7b2e51b58e59f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


出现这个问题的原因就是大面积的斜率过小，导致大面积的深度值一样，同时出现白沫。


![Untitled.png](assets/高级水面白沫涟漪or海浪/004-54d283bf.png)


就如此图一样。


如何避免这类问题，以下为个人思考和经验，既然确定这个问题是由于斜率过小不合适导致的，那我们应该屏蔽这类斜率过小的区域。但是仅仅根据已知的这几个信息无法知道斜率，所以大部分人都会选择烘焙一张垂直的拍摄的信息图，像SDF或者法线这些。


然而我像做一个通用的效果，并不想去烘焙这些信息，在这个前提下，该怎么拿到水面下的场景深度斜率，这里就会想到用DDX与DDY去拿到当前深度与周围的深度的变化率，就可以算得当前点的法线，归一化的法线的Y轴便是当前点的斜率大小。


![Untitled.jpeg](assets/高级水面白沫涟漪or海浪/005-732bf526.jpeg)


这一步，我们便是使用当前水底点的世界空间坐标去和周围水底点世界空间坐标去做DDX与DDY得到当前点的水底世界空间法线。


![Untitled.png](assets/高级水面白沫涟漪or海浪/006-8250a3f0.png)


法线为-1到1大小，所以有部分为黑色。因为地形本身就是格子，一个地形面片内的法线是固定的，所以看起来结果是这样的，目前可以确认是正确的。


现在我们只需要屏蔽掉不合适的区域既可以。


![Untitled.png](assets/高级水面白沫涟漪or海浪/007-5b7fe1db.png)


这里我就屏蔽了斜率小于一定阈值的区域。最后就可以得到正确的效果啦。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/974e4a02-f3bb-4312-a1cf-7c7ae6caeb02/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZA5AP5QR%2F20260301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260301T121931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCeil1hZG1E7TaT8uIB1UX9tMtoRm5pc3%2Barflphix0ngIhAPRRrqZO%2BJ%2BFg8c5lMr3hyuaSS8SdlDHzEOEPudc2QJIKv8DCGkQABoMNjM3NDIzMTgzODA1Igz%2F7AOHUtVrxMj1LnMq3AOEkK%2B2%2Fy0%2FfgmlapwG2Y7kqjhtujcDwNVAI3NU9C60MRF%2Ft2ofxJqJFs8LJKiw68uvVKzDqxVzjAUzad7n%2FZDDmO%2FP7iPzVut5sndEjwNMQOcfL0jIsNzS1cfCFVg28N719746p6hl3XBKFvXN4czpjJwY2CzkzDm6THP7AfO%2F04wysxBra92PYCUs9oZ45vTz3zX02rY7wMYwRlqCy4Jf2pJq8SncmGYV2nPTFOS%2BNUC66U61CxQG1SaP%2Fnut7e77mruKl5rk0iUNjGNBwETqd4JD644BWEkh8oIMCjFTCwArvGWLoy2TtdfiWiY%2B1o0%2BZ8m8kdUt%2FrN%2FMAue9nNl8lVDOikQ5rjHn9yYI%2BIaXffhMXFFBCHOF%2BTNiwJKXsMF69QWw35Zn1Yc3vCRU5ef5LH8WkYc64yglMD6pvBhgZPzgBh%2Fm5JN5IczAYrkqlnPa0ofZmsI45tChcVUtphZ0zGfG%2BXoQhnjdAuklFLXCMs7B4TddvIU5yVbgbixtZk7PWRRy1J0SsVB49k0damVhQZxqxFD%2FsVjPVCNFD%2BO2K7s9aVGqC%2FM2BQGGd0fNt2rgc7WrimQmrNjTUBT6LJz7ftA2TQW%2B8T67GiH7sc%2BOwJwLoS%2FgNK7gAIDXTD26o%2FNBjqkAZ2CfcZNKOk%2F%2FxqU0vyjGA77vv0sMgHMLOYHdyu%2BvrZsIWL1bRuwCoGyr69E%2BGR0g1YKJwLq4X4k5cSnmuYuti%2BT9yPsXlMcsZs43r8k8wwCoOAcyHhIgQjsp3acm28gZDnRIeX5QzmJEAjLIGoJjJxSqQYzjbnzV%2Bo%2FEkGM%2FhYM2oi64tx0Pxjgotc7JyUjwCOfkTvDFrk7CT2K8IlL%2Fzy3yhpD&X-Amz-Signature=356684010f67485299ac3d51f108d5190f0e4d29191161fba7107b1514d6bb8d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


剩下还没有有调整白沫形状函数的细节，我就不过多介绍啦，很多地方都有。具体可以看[https://zhuanlan.zhihu.com/p/63722738](https://zhuanlan.zhihu.com/p/63722738)

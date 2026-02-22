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
![Untitled.png](assets/高级水面白沫涟漪or海浪/001-5bdf25b2.png)


这是我们传统的通过水面当前像素深度、世界坐标位置、场景深度、相机位置求得一个稳定的水面深度，深度有两种，一种是从摄像机出发的深度，另一种则是垂直深度。这里我们求的为垂直深度。


![Untitled.png](assets/高级水面白沫涟漪or海浪/002-33bf48d8.png)


（这里我用的SingleLayerWater，得到场景深度的节点为SceneDepthWithoutWater，正常半透明用SceneDepth）


**注意：SingleLayerWater的深度图存在降采样与半精度问题**


**r.Water.SingleLayer.RefractionDownsampleFactor 1**


**r.Water.SingleLayer.RefractionFullPrecision 1**


实际使用需要在代码里面更改一下默认值。我这里已经改过了。


得到水的深度这个线性值之后，便是捏水波或者说白沫的形状了，这部分全靠自己调整一下波形的相位、周期、振幅这些，而且也不局限于Sin波，只需要是连续可导的就行，有点像自己捏一个噪声。


![Untitled.png](assets/高级水面白沫涟漪or海浪/003-3a993b24.png)


为了展示这种方法会出现的问题，这里我简单给个sin做示范。


可以看见在这种深度渐变比较均匀的地形上，这个方法是比较不错的，而且视角的变动也不会影响水波。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/0959c3b1-8235-462f-a061-bfde55041d4a/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SIPZUMXT%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T151522Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEP3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDjx1zgjupmrnR7kH99fy0gXQ7yySIiVpxq5qSwoahTiQIhAP3oeaTjUHeKyeefyrkC%2FaOtlji9ysUsnAkDDXyjnYaaKogECMX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxFjIjK4O%2F9SFDhWfMq3ANFFT0AstDrPfepyGTbwz8wlgcO%2F%2Fm8%2Bxay7QENejF%2F0pHNauuccJ%2BaGZVEgiGmmEMKiKiSHTS7xHk%2F7Cnol8NWYLWW0M1HFLMImC3x2m1yoAOA4xG4gRPx7CVk0ktX5NjdV0HOxUzH7Cbj%2FkGLfSbnCDaQ6c5QHMtbJy%2FeQRbsrVmfu2TnnE2LVRsyHxkaHbcGQk38WJHr5wRU%2BEaSv75VR5P2WPVgDvgvXMG%2BJJCBvP9Rs%2B%2B80nYjDFl9ZZzWV%2B1xcbL3XI8doqx9qVR08rnv6O9OCvAlzRRVqiKcBN3mupPLqH%2FyQCPKMwGtm6fSTjffZCUBp4D8%2B95GerP3guC6G%2BFfw5lnEDIl8x1K5PQ9H1Duxd8jZMRqdm5lUN8%2BEmxSYiRSjJFzL2RuiDowfKYYMxqIAfUh9F%2FKEUmZTaq4LMlUQ6Dr04lV65nygZIDiCce5IjfBNWRt6GBSK1JXccFo2c3QVuL5OHSSSIBVLOxC0z6ZGx377yYFB0lxAGVT2ZhAAUDPVXQgoQwJ4nsvkOytrF5XvBkbY09nkem27pbel7GLg2Kv8hOH2vIILVjOHmzceCBNgifPUs2czFaxBbZd4Cf7xBlnlm47ghJnuruejy%2FbZvbhc%2FApd4A1TCP6evMBjqkAd%2B1Y2hQzLpTxyEkHHeg8Q5Q5z4zV51q1t7FC9GiQoFf%2F1n5YBv0uJ4sa6eEjTMxKqzTK4V7FwDVf15enXnpxXThvKrTdplpRVJmLAY7Vubh8NjpFukpfXBo8sRK3xg3%2B%2BWienjqdulqTrKWnw9dDVoJ%2BbZGCt6lOUORW%2Be%2FKskUqnkIzkFroxO50jlYinSvaEfOyxGmkz0gH5vOkyL1HbyAfAwY&X-Amz-Signature=657bb9657652bdea72cf375dbf2cc0d5350858258eb7c9bd33ff657b1a454e12&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


但是，如果在深度渐变不均匀的地形或者场景中，就特别容易发生白沫大面积出现的问题。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/9a4613c1-b501-4363-b2a7-8003263eda47/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SIPZUMXT%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T151522Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEP3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDjx1zgjupmrnR7kH99fy0gXQ7yySIiVpxq5qSwoahTiQIhAP3oeaTjUHeKyeefyrkC%2FaOtlji9ysUsnAkDDXyjnYaaKogECMX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxFjIjK4O%2F9SFDhWfMq3ANFFT0AstDrPfepyGTbwz8wlgcO%2F%2Fm8%2Bxay7QENejF%2F0pHNauuccJ%2BaGZVEgiGmmEMKiKiSHTS7xHk%2F7Cnol8NWYLWW0M1HFLMImC3x2m1yoAOA4xG4gRPx7CVk0ktX5NjdV0HOxUzH7Cbj%2FkGLfSbnCDaQ6c5QHMtbJy%2FeQRbsrVmfu2TnnE2LVRsyHxkaHbcGQk38WJHr5wRU%2BEaSv75VR5P2WPVgDvgvXMG%2BJJCBvP9Rs%2B%2B80nYjDFl9ZZzWV%2B1xcbL3XI8doqx9qVR08rnv6O9OCvAlzRRVqiKcBN3mupPLqH%2FyQCPKMwGtm6fSTjffZCUBp4D8%2B95GerP3guC6G%2BFfw5lnEDIl8x1K5PQ9H1Duxd8jZMRqdm5lUN8%2BEmxSYiRSjJFzL2RuiDowfKYYMxqIAfUh9F%2FKEUmZTaq4LMlUQ6Dr04lV65nygZIDiCce5IjfBNWRt6GBSK1JXccFo2c3QVuL5OHSSSIBVLOxC0z6ZGx377yYFB0lxAGVT2ZhAAUDPVXQgoQwJ4nsvkOytrF5XvBkbY09nkem27pbel7GLg2Kv8hOH2vIILVjOHmzceCBNgifPUs2czFaxBbZd4Cf7xBlnlm47ghJnuruejy%2FbZvbhc%2FApd4A1TCP6evMBjqkAd%2B1Y2hQzLpTxyEkHHeg8Q5Q5z4zV51q1t7FC9GiQoFf%2F1n5YBv0uJ4sa6eEjTMxKqzTK4V7FwDVf15enXnpxXThvKrTdplpRVJmLAY7Vubh8NjpFukpfXBo8sRK3xg3%2B%2BWienjqdulqTrKWnw9dDVoJ%2BbZGCt6lOUORW%2Be%2FKskUqnkIzkFroxO50jlYinSvaEfOyxGmkz0gH5vOkyL1HbyAfAwY&X-Amz-Signature=a389ae72b2c37e5315ff93954da472b5f8f0aa37ea86a94d580ae6a29ec4fd04&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


出现这个问题的原因就是大面积的斜率过小，导致大面积的深度值一样，同时出现白沫。


![Untitled.png](assets/高级水面白沫涟漪or海浪/004-fce62176.png)


就如此图一样。


如何避免这类问题，以下为个人思考和经验，既然确定这个问题是由于斜率过小不合适导致的，那我们应该屏蔽这类斜率过小的区域。但是仅仅根据已知的这几个信息无法知道斜率，所以大部分人都会选择烘焙一张垂直的拍摄的信息图，像SDF或者法线这些。


然而我像做一个通用的效果，并不想去烘焙这些信息，在这个前提下，该怎么拿到水面下的场景深度斜率，这里就会想到用DDX与DDY去拿到当前深度与周围的深度的变化率，就可以算得当前点的法线，归一化的法线的Y轴便是当前点的斜率大小。


![Untitled.jpeg](assets/高级水面白沫涟漪or海浪/005-4ad303fb.jpeg)


这一步，我们便是使用当前水底点的世界空间坐标去和周围水底点世界空间坐标去做DDX与DDY得到当前点的水底世界空间法线。


![Untitled.png](assets/高级水面白沫涟漪or海浪/006-5b6d56be.png)


法线为-1到1大小，所以有部分为黑色。因为地形本身就是格子，一个地形面片内的法线是固定的，所以看起来结果是这样的，目前可以确认是正确的。


现在我们只需要屏蔽掉不合适的区域既可以。


![Untitled.png](assets/高级水面白沫涟漪or海浪/007-d8d1d36c.png)


这里我就屏蔽了斜率小于一定阈值的区域。最后就可以得到正确的效果啦。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/974e4a02-f3bb-4312-a1cf-7c7ae6caeb02/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SIPZUMXT%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T151522Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEP3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDjx1zgjupmrnR7kH99fy0gXQ7yySIiVpxq5qSwoahTiQIhAP3oeaTjUHeKyeefyrkC%2FaOtlji9ysUsnAkDDXyjnYaaKogECMX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxFjIjK4O%2F9SFDhWfMq3ANFFT0AstDrPfepyGTbwz8wlgcO%2F%2Fm8%2Bxay7QENejF%2F0pHNauuccJ%2BaGZVEgiGmmEMKiKiSHTS7xHk%2F7Cnol8NWYLWW0M1HFLMImC3x2m1yoAOA4xG4gRPx7CVk0ktX5NjdV0HOxUzH7Cbj%2FkGLfSbnCDaQ6c5QHMtbJy%2FeQRbsrVmfu2TnnE2LVRsyHxkaHbcGQk38WJHr5wRU%2BEaSv75VR5P2WPVgDvgvXMG%2BJJCBvP9Rs%2B%2B80nYjDFl9ZZzWV%2B1xcbL3XI8doqx9qVR08rnv6O9OCvAlzRRVqiKcBN3mupPLqH%2FyQCPKMwGtm6fSTjffZCUBp4D8%2B95GerP3guC6G%2BFfw5lnEDIl8x1K5PQ9H1Duxd8jZMRqdm5lUN8%2BEmxSYiRSjJFzL2RuiDowfKYYMxqIAfUh9F%2FKEUmZTaq4LMlUQ6Dr04lV65nygZIDiCce5IjfBNWRt6GBSK1JXccFo2c3QVuL5OHSSSIBVLOxC0z6ZGx377yYFB0lxAGVT2ZhAAUDPVXQgoQwJ4nsvkOytrF5XvBkbY09nkem27pbel7GLg2Kv8hOH2vIILVjOHmzceCBNgifPUs2czFaxBbZd4Cf7xBlnlm47ghJnuruejy%2FbZvbhc%2FApd4A1TCP6evMBjqkAd%2B1Y2hQzLpTxyEkHHeg8Q5Q5z4zV51q1t7FC9GiQoFf%2F1n5YBv0uJ4sa6eEjTMxKqzTK4V7FwDVf15enXnpxXThvKrTdplpRVJmLAY7Vubh8NjpFukpfXBo8sRK3xg3%2B%2BWienjqdulqTrKWnw9dDVoJ%2BbZGCt6lOUORW%2Be%2FKskUqnkIzkFroxO50jlYinSvaEfOyxGmkz0gH5vOkyL1HbyAfAwY&X-Amz-Signature=189276da4743f20df9faac9711d6c9df37f6617cd81a7d76f33d763bea255720&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


剩下还没有有调整白沫形状函数的细节，我就不过多介绍啦，很多地方都有。具体可以看[https://zhuanlan.zhihu.com/p/63722738](https://zhuanlan.zhihu.com/p/63722738)

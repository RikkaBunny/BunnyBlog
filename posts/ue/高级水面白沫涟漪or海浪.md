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
![Untitled.png](assets/高级水面白沫涟漪or海浪/001-d63852db.png)


这是我们传统的通过水面当前像素深度、世界坐标位置、场景深度、相机位置求得一个稳定的水面深度，深度有两种，一种是从摄像机出发的深度，另一种则是垂直深度。这里我们求的为垂直深度。


![Untitled.png](assets/高级水面白沫涟漪or海浪/002-d57350d2.png)


（这里我用的SingleLayerWater，得到场景深度的节点为SceneDepthWithoutWater，正常半透明用SceneDepth）


**注意：SingleLayerWater的深度图存在降采样与半精度问题**


**r.Water.SingleLayer.RefractionDownsampleFactor 1**


**r.Water.SingleLayer.RefractionFullPrecision 1**


实际使用需要在代码里面更改一下默认值。我这里已经改过了。


得到水的深度这个线性值之后，便是捏水波或者说白沫的形状了，这部分全靠自己调整一下波形的相位、周期、振幅这些，而且也不局限于Sin波，只需要是连续可导的就行，有点像自己捏一个噪声。


![Untitled.png](assets/高级水面白沫涟漪or海浪/003-e40f0333.png)


为了展示这种方法会出现的问题，这里我简单给个sin做示范。


可以看见在这种深度渐变比较均匀的地形上，这个方法是比较不错的，而且视角的变动也不会影响水波。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/0959c3b1-8235-462f-a061-bfde55041d4a/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QAAB53UO%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T091517Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECgaCXVzLXdlc3QtMiJHMEUCIQCqGY%2B5uk0D4A5Gt5%2FPhTak4JdxtwssSmGfMq2HsYag7AIgBdAPLyPmcfdb2%2FyJdFMA5x%2FfSnRsFhzN2qhxOt4MtaQqiAQI8f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEqQT9J3MGwIy8inESrcAyqFV3zjFiSOV9QA09ZyRRvCT7XH2YQlXDnI9z0d9Gbni28txtKwIKugqGTgBvS59SdjR2Ev93csd5aR3qiNXCk0%2BFRbt%2B%2B1PopUhVvdwvWebq15D3MYslafkHW2tfrryT35UHUh7%2Bigj4Y0e98bCuaFGuADymfKlLU9%2BeijP%2B1sON6g%2BIjDfS8VLpq52S%2F%2BLwYa50mtC77ki4ByO8OXEQdJ9%2FGpnLr3AZpAKQKs8Wq4Nc5m%2BiLJF6PFyWi1pi5WiPKRz8qNLhNp3DffnQCIpX%2BIqoL3Yt95BS1cD5AG7pQ4LKmvqjrMP2FjO3nbU2ZwcAvXPsUbjUP7z1dNXO512ubvDtb7AkX1XquUSj%2BRiz3mlzKRc2q%2FzQKBlekeQwkmWBBMA2oZ%2BCecl0V4RgVDfVh1TyHkJYRjVLOdOthFvJpW60jkFpbqRswh%2BDi3t02HrgGbCuxVyOM6GIo37gsUa%2F4phVByZVjm5vYXs5otYzEJI%2BN8tUcohXWKD7ECjkgrx%2BndE4Y3DgaDKEgqdHLkStBLoNn8emV9ImQrEPUXnS45PDMJcapZlAMEwUczw9Uyvha355kAT1P4FkYpr%2Fd8CyshBc95Ti6zC21h01opUoSNP7IIIEhl3Q8UfUSQMKuq9cwGOqUBVZnFeva05Xx1xkR63EOYtNHqcKdEDtKgpafPTBMO1AexslEumZVk3py9D%2BfEZmzUq4FueDVcT7%2BsJSkZQU6YMA%2FE20nqRhSuKTGj5v6k0lCONMSDGTcTyuVBmZMJAQzz3tQ2XcWSiYC86dGJJUE1NBjfN0hDcu99C%2B26i65qPdNDj1ytZRI45TdvN1LwDgJ8%2BapZ%2FxmnjMLVQUzJtIy0tFT3yYzt&X-Amz-Signature=807b2ce508eca8c75473ca3307e08f0751092ea79361b4d861acc764f54dae11&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


但是，如果在深度渐变不均匀的地形或者场景中，就特别容易发生白沫大面积出现的问题。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/9a4613c1-b501-4363-b2a7-8003263eda47/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QAAB53UO%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T091517Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECgaCXVzLXdlc3QtMiJHMEUCIQCqGY%2B5uk0D4A5Gt5%2FPhTak4JdxtwssSmGfMq2HsYag7AIgBdAPLyPmcfdb2%2FyJdFMA5x%2FfSnRsFhzN2qhxOt4MtaQqiAQI8f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEqQT9J3MGwIy8inESrcAyqFV3zjFiSOV9QA09ZyRRvCT7XH2YQlXDnI9z0d9Gbni28txtKwIKugqGTgBvS59SdjR2Ev93csd5aR3qiNXCk0%2BFRbt%2B%2B1PopUhVvdwvWebq15D3MYslafkHW2tfrryT35UHUh7%2Bigj4Y0e98bCuaFGuADymfKlLU9%2BeijP%2B1sON6g%2BIjDfS8VLpq52S%2F%2BLwYa50mtC77ki4ByO8OXEQdJ9%2FGpnLr3AZpAKQKs8Wq4Nc5m%2BiLJF6PFyWi1pi5WiPKRz8qNLhNp3DffnQCIpX%2BIqoL3Yt95BS1cD5AG7pQ4LKmvqjrMP2FjO3nbU2ZwcAvXPsUbjUP7z1dNXO512ubvDtb7AkX1XquUSj%2BRiz3mlzKRc2q%2FzQKBlekeQwkmWBBMA2oZ%2BCecl0V4RgVDfVh1TyHkJYRjVLOdOthFvJpW60jkFpbqRswh%2BDi3t02HrgGbCuxVyOM6GIo37gsUa%2F4phVByZVjm5vYXs5otYzEJI%2BN8tUcohXWKD7ECjkgrx%2BndE4Y3DgaDKEgqdHLkStBLoNn8emV9ImQrEPUXnS45PDMJcapZlAMEwUczw9Uyvha355kAT1P4FkYpr%2Fd8CyshBc95Ti6zC21h01opUoSNP7IIIEhl3Q8UfUSQMKuq9cwGOqUBVZnFeva05Xx1xkR63EOYtNHqcKdEDtKgpafPTBMO1AexslEumZVk3py9D%2BfEZmzUq4FueDVcT7%2BsJSkZQU6YMA%2FE20nqRhSuKTGj5v6k0lCONMSDGTcTyuVBmZMJAQzz3tQ2XcWSiYC86dGJJUE1NBjfN0hDcu99C%2B26i65qPdNDj1ytZRI45TdvN1LwDgJ8%2BapZ%2FxmnjMLVQUzJtIy0tFT3yYzt&X-Amz-Signature=c8b4d5b036f989169bc2b9f6b3cf76443c70d717446eeea2459748d0d85c649d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


出现这个问题的原因就是大面积的斜率过小，导致大面积的深度值一样，同时出现白沫。


![Untitled.png](assets/高级水面白沫涟漪or海浪/004-52b6f4bc.png)


就如此图一样。


如何避免这类问题，以下为个人思考和经验，既然确定这个问题是由于斜率过小不合适导致的，那我们应该屏蔽这类斜率过小的区域。但是仅仅根据已知的这几个信息无法知道斜率，所以大部分人都会选择烘焙一张垂直的拍摄的信息图，像SDF或者法线这些。


然而我像做一个通用的效果，并不想去烘焙这些信息，在这个前提下，该怎么拿到水面下的场景深度斜率，这里就会想到用DDX与DDY去拿到当前深度与周围的深度的变化率，就可以算得当前点的法线，归一化的法线的Y轴便是当前点的斜率大小。


![Untitled.jpeg](assets/高级水面白沫涟漪or海浪/005-06f72c8e.jpeg)


这一步，我们便是使用当前水底点的世界空间坐标去和周围水底点世界空间坐标去做DDX与DDY得到当前点的水底世界空间法线。


![Untitled.png](assets/高级水面白沫涟漪or海浪/006-45f191f2.png)


法线为-1到1大小，所以有部分为黑色。因为地形本身就是格子，一个地形面片内的法线是固定的，所以看起来结果是这样的，目前可以确认是正确的。


现在我们只需要屏蔽掉不合适的区域既可以。


![Untitled.png](assets/高级水面白沫涟漪or海浪/007-265f0ad3.png)


这里我就屏蔽了斜率小于一定阈值的区域。最后就可以得到正确的效果啦。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/974e4a02-f3bb-4312-a1cf-7c7ae6caeb02/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QAAB53UO%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T091518Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECgaCXVzLXdlc3QtMiJHMEUCIQCqGY%2B5uk0D4A5Gt5%2FPhTak4JdxtwssSmGfMq2HsYag7AIgBdAPLyPmcfdb2%2FyJdFMA5x%2FfSnRsFhzN2qhxOt4MtaQqiAQI8f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEqQT9J3MGwIy8inESrcAyqFV3zjFiSOV9QA09ZyRRvCT7XH2YQlXDnI9z0d9Gbni28txtKwIKugqGTgBvS59SdjR2Ev93csd5aR3qiNXCk0%2BFRbt%2B%2B1PopUhVvdwvWebq15D3MYslafkHW2tfrryT35UHUh7%2Bigj4Y0e98bCuaFGuADymfKlLU9%2BeijP%2B1sON6g%2BIjDfS8VLpq52S%2F%2BLwYa50mtC77ki4ByO8OXEQdJ9%2FGpnLr3AZpAKQKs8Wq4Nc5m%2BiLJF6PFyWi1pi5WiPKRz8qNLhNp3DffnQCIpX%2BIqoL3Yt95BS1cD5AG7pQ4LKmvqjrMP2FjO3nbU2ZwcAvXPsUbjUP7z1dNXO512ubvDtb7AkX1XquUSj%2BRiz3mlzKRc2q%2FzQKBlekeQwkmWBBMA2oZ%2BCecl0V4RgVDfVh1TyHkJYRjVLOdOthFvJpW60jkFpbqRswh%2BDi3t02HrgGbCuxVyOM6GIo37gsUa%2F4phVByZVjm5vYXs5otYzEJI%2BN8tUcohXWKD7ECjkgrx%2BndE4Y3DgaDKEgqdHLkStBLoNn8emV9ImQrEPUXnS45PDMJcapZlAMEwUczw9Uyvha355kAT1P4FkYpr%2Fd8CyshBc95Ti6zC21h01opUoSNP7IIIEhl3Q8UfUSQMKuq9cwGOqUBVZnFeva05Xx1xkR63EOYtNHqcKdEDtKgpafPTBMO1AexslEumZVk3py9D%2BfEZmzUq4FueDVcT7%2BsJSkZQU6YMA%2FE20nqRhSuKTGj5v6k0lCONMSDGTcTyuVBmZMJAQzz3tQ2XcWSiYC86dGJJUE1NBjfN0hDcu99C%2B26i65qPdNDj1ytZRI45TdvN1LwDgJ8%2BapZ%2FxmnjMLVQUzJtIy0tFT3yYzt&X-Amz-Signature=474c8ff737316750e8ba13acf80b7b28e338759470f2de86da79a3a51d2c932a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


剩下还没有有调整白沫形状函数的细节，我就不过多介绍啦，很多地方都有。具体可以看[https://zhuanlan.zhihu.com/p/63722738](https://zhuanlan.zhihu.com/p/63722738)

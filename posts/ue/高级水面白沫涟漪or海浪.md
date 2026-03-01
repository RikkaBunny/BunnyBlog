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
![Untitled.png](assets/高级水面白沫涟漪or海浪/001-79439804.png)


这是我们传统的通过水面当前像素深度、世界坐标位置、场景深度、相机位置求得一个稳定的水面深度，深度有两种，一种是从摄像机出发的深度，另一种则是垂直深度。这里我们求的为垂直深度。


![Untitled.png](assets/高级水面白沫涟漪or海浪/002-b64d3f59.png)


（这里我用的SingleLayerWater，得到场景深度的节点为SceneDepthWithoutWater，正常半透明用SceneDepth）


**注意：SingleLayerWater的深度图存在降采样与半精度问题**


**r.Water.SingleLayer.RefractionDownsampleFactor 1**


**r.Water.SingleLayer.RefractionFullPrecision 1**


实际使用需要在代码里面更改一下默认值。我这里已经改过了。


得到水的深度这个线性值之后，便是捏水波或者说白沫的形状了，这部分全靠自己调整一下波形的相位、周期、振幅这些，而且也不局限于Sin波，只需要是连续可导的就行，有点像自己捏一个噪声。


![Untitled.png](assets/高级水面白沫涟漪or海浪/003-4eea190e.png)


为了展示这种方法会出现的问题，这里我简单给个sin做示范。


可以看见在这种深度渐变比较均匀的地形上，这个方法是比较不错的，而且视角的变动也不会影响水波。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/0959c3b1-8235-462f-a061-bfde55041d4a/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663AVKEWYT%2F20260301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260301T091957Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBzl4zlz6KSF%2B40zvTT8WEsswb6R5oLOCY27OuEdmBfsAiEA6iS6emwxyqFLlVvSnhAoHD2VXMDSNUphWTd2VfpAYsAq%2FwMIaRAAGgw2Mzc0MjMxODM4MDUiDAqvl8euGWg3HhKzUyrcA%2FdHxkG%2F1kMlnIXkYBPvf1vS%2FapfOv6nnEmX%2FHEwLV1r4WZrDYm6xmXZBQDM5E%2FY0lsZhUpy7z0jgS9MZ%2FTRwN4K5e8ZJZHHxZY00EDyg1D%2FZWkmjfhKgm6VHdpNnT8kXDcdzY794NIq7ue0NB7%2Fntks9P0z%2B5dS%2B9h7WjeAt0gwzLHEuruIVXz3tbcga0J7u97tK%2Blug2i1L6hKF7b0ibUOSNm05iP%2BwC0Zze3fhyBVBjtK1%2BUbmoPxdJE03PcEBysY0R6H3g8vJFjUJvt7SQ0Np%2BvCnuuNesAi13YFqf1jEJMh7ZC3FoqT07XZDjPLn8XjfuwImikIey785Vm539Pmw71p2xaA3LX%2B49KytMthzDHu62ZxDOy6j%2BTHV1HSN07h7AQmSxA3EcQYOWwlIWaDFLO5Al1soUWeTbw0ORuJVtigFLuTCW611CrNQPcqV%2FsLGvr4itAZFROtWQqoKIIR9oHRo1TqYEspbMVV5h1Ugab4%2FZXDkzg%2FG2WC31AX1IuiwQUeN7%2B8R7Dl%2FCQv8GVeQXooM7f1hd47iqwZ%2BNcO9YbbQvmCoCRsi68xx7CiDK5wVhFECLrRDOfxRs0k%2BgPRQXveO%2FnVEA%2Fqk48ncTTevyhtLlgnupsvSo89MNzqj80GOqUBR6Mplfin0JJg2wCllMY2wTez0nhzaA8ydo6hYXfiPqU818Pe%2BAq4cY%2F%2FYYC0ETyTJU7eqFmbrmrUGcELBAT3GcDNveifRxz8N5Ua372L%2BrDNI2xJShVrWEHXOv1Z9ZIFpGDTHlcyZFGJQgftCA08voW1xdaWp%2B3UTIFEjY%2FPPp5OskRXvLCJtX8PLi2AE%2FuiCi8sltOYzquFoUPpAHmi6m64Gk0u&X-Amz-Signature=2a05ad775e4fdeed0ba4443ef2ba2047b22f0d5a72602afc6a2c159d797764b2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


但是，如果在深度渐变不均匀的地形或者场景中，就特别容易发生白沫大面积出现的问题。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/9a4613c1-b501-4363-b2a7-8003263eda47/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663AVKEWYT%2F20260301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260301T091957Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBzl4zlz6KSF%2B40zvTT8WEsswb6R5oLOCY27OuEdmBfsAiEA6iS6emwxyqFLlVvSnhAoHD2VXMDSNUphWTd2VfpAYsAq%2FwMIaRAAGgw2Mzc0MjMxODM4MDUiDAqvl8euGWg3HhKzUyrcA%2FdHxkG%2F1kMlnIXkYBPvf1vS%2FapfOv6nnEmX%2FHEwLV1r4WZrDYm6xmXZBQDM5E%2FY0lsZhUpy7z0jgS9MZ%2FTRwN4K5e8ZJZHHxZY00EDyg1D%2FZWkmjfhKgm6VHdpNnT8kXDcdzY794NIq7ue0NB7%2Fntks9P0z%2B5dS%2B9h7WjeAt0gwzLHEuruIVXz3tbcga0J7u97tK%2Blug2i1L6hKF7b0ibUOSNm05iP%2BwC0Zze3fhyBVBjtK1%2BUbmoPxdJE03PcEBysY0R6H3g8vJFjUJvt7SQ0Np%2BvCnuuNesAi13YFqf1jEJMh7ZC3FoqT07XZDjPLn8XjfuwImikIey785Vm539Pmw71p2xaA3LX%2B49KytMthzDHu62ZxDOy6j%2BTHV1HSN07h7AQmSxA3EcQYOWwlIWaDFLO5Al1soUWeTbw0ORuJVtigFLuTCW611CrNQPcqV%2FsLGvr4itAZFROtWQqoKIIR9oHRo1TqYEspbMVV5h1Ugab4%2FZXDkzg%2FG2WC31AX1IuiwQUeN7%2B8R7Dl%2FCQv8GVeQXooM7f1hd47iqwZ%2BNcO9YbbQvmCoCRsi68xx7CiDK5wVhFECLrRDOfxRs0k%2BgPRQXveO%2FnVEA%2Fqk48ncTTevyhtLlgnupsvSo89MNzqj80GOqUBR6Mplfin0JJg2wCllMY2wTez0nhzaA8ydo6hYXfiPqU818Pe%2BAq4cY%2F%2FYYC0ETyTJU7eqFmbrmrUGcELBAT3GcDNveifRxz8N5Ua372L%2BrDNI2xJShVrWEHXOv1Z9ZIFpGDTHlcyZFGJQgftCA08voW1xdaWp%2B3UTIFEjY%2FPPp5OskRXvLCJtX8PLi2AE%2FuiCi8sltOYzquFoUPpAHmi6m64Gk0u&X-Amz-Signature=d325c6c2e641dc9384192e5e67db09581f7ebf8514a7798fc9ff9df7a6b154c6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


出现这个问题的原因就是大面积的斜率过小，导致大面积的深度值一样，同时出现白沫。


![Untitled.png](assets/高级水面白沫涟漪or海浪/004-03b7a146.png)


就如此图一样。


如何避免这类问题，以下为个人思考和经验，既然确定这个问题是由于斜率过小不合适导致的，那我们应该屏蔽这类斜率过小的区域。但是仅仅根据已知的这几个信息无法知道斜率，所以大部分人都会选择烘焙一张垂直的拍摄的信息图，像SDF或者法线这些。


然而我像做一个通用的效果，并不想去烘焙这些信息，在这个前提下，该怎么拿到水面下的场景深度斜率，这里就会想到用DDX与DDY去拿到当前深度与周围的深度的变化率，就可以算得当前点的法线，归一化的法线的Y轴便是当前点的斜率大小。


![Untitled.jpeg](assets/高级水面白沫涟漪or海浪/005-ceb1be9d.jpeg)


这一步，我们便是使用当前水底点的世界空间坐标去和周围水底点世界空间坐标去做DDX与DDY得到当前点的水底世界空间法线。


![Untitled.png](assets/高级水面白沫涟漪or海浪/006-b4f28b86.png)


法线为-1到1大小，所以有部分为黑色。因为地形本身就是格子，一个地形面片内的法线是固定的，所以看起来结果是这样的，目前可以确认是正确的。


现在我们只需要屏蔽掉不合适的区域既可以。


![Untitled.png](assets/高级水面白沫涟漪or海浪/007-dd144052.png)


这里我就屏蔽了斜率小于一定阈值的区域。最后就可以得到正确的效果啦。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/974e4a02-f3bb-4312-a1cf-7c7ae6caeb02/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663AVKEWYT%2F20260301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260301T091957Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBzl4zlz6KSF%2B40zvTT8WEsswb6R5oLOCY27OuEdmBfsAiEA6iS6emwxyqFLlVvSnhAoHD2VXMDSNUphWTd2VfpAYsAq%2FwMIaRAAGgw2Mzc0MjMxODM4MDUiDAqvl8euGWg3HhKzUyrcA%2FdHxkG%2F1kMlnIXkYBPvf1vS%2FapfOv6nnEmX%2FHEwLV1r4WZrDYm6xmXZBQDM5E%2FY0lsZhUpy7z0jgS9MZ%2FTRwN4K5e8ZJZHHxZY00EDyg1D%2FZWkmjfhKgm6VHdpNnT8kXDcdzY794NIq7ue0NB7%2Fntks9P0z%2B5dS%2B9h7WjeAt0gwzLHEuruIVXz3tbcga0J7u97tK%2Blug2i1L6hKF7b0ibUOSNm05iP%2BwC0Zze3fhyBVBjtK1%2BUbmoPxdJE03PcEBysY0R6H3g8vJFjUJvt7SQ0Np%2BvCnuuNesAi13YFqf1jEJMh7ZC3FoqT07XZDjPLn8XjfuwImikIey785Vm539Pmw71p2xaA3LX%2B49KytMthzDHu62ZxDOy6j%2BTHV1HSN07h7AQmSxA3EcQYOWwlIWaDFLO5Al1soUWeTbw0ORuJVtigFLuTCW611CrNQPcqV%2FsLGvr4itAZFROtWQqoKIIR9oHRo1TqYEspbMVV5h1Ugab4%2FZXDkzg%2FG2WC31AX1IuiwQUeN7%2B8R7Dl%2FCQv8GVeQXooM7f1hd47iqwZ%2BNcO9YbbQvmCoCRsi68xx7CiDK5wVhFECLrRDOfxRs0k%2BgPRQXveO%2FnVEA%2Fqk48ncTTevyhtLlgnupsvSo89MNzqj80GOqUBR6Mplfin0JJg2wCllMY2wTez0nhzaA8ydo6hYXfiPqU818Pe%2BAq4cY%2F%2FYYC0ETyTJU7eqFmbrmrUGcELBAT3GcDNveifRxz8N5Ua372L%2BrDNI2xJShVrWEHXOv1Z9ZIFpGDTHlcyZFGJQgftCA08voW1xdaWp%2B3UTIFEjY%2FPPp5OskRXvLCJtX8PLi2AE%2FuiCi8sltOYzquFoUPpAHmi6m64Gk0u&X-Amz-Signature=4f8ba0173f6e45a39da465d875c9f5aad847e27e45454c4c0e7b3c474ac2af0b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


剩下还没有有调整白沫形状函数的细节，我就不过多介绍啦，很多地方都有。具体可以看[https://zhuanlan.zhihu.com/p/63722738](https://zhuanlan.zhihu.com/p/63722738)

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
![Untitled.png](assets/高级水面白沫涟漪or海浪/001-f336f635.png)


这是我们传统的通过水面当前像素深度、世界坐标位置、场景深度、相机位置求得一个稳定的水面深度，深度有两种，一种是从摄像机出发的深度，另一种则是垂直深度。这里我们求的为垂直深度。


![Untitled.png](assets/高级水面白沫涟漪or海浪/002-4ab5fa23.png)


（这里我用的SingleLayerWater，得到场景深度的节点为SceneDepthWithoutWater，正常半透明用SceneDepth）


**注意：SingleLayerWater的深度图存在降采样与半精度问题**


**r.Water.SingleLayer.RefractionDownsampleFactor 1**


**r.Water.SingleLayer.RefractionFullPrecision 1**


实际使用需要在代码里面更改一下默认值。我这里已经改过了。


得到水的深度这个线性值之后，便是捏水波或者说白沫的形状了，这部分全靠自己调整一下波形的相位、周期、振幅这些，而且也不局限于Sin波，只需要是连续可导的就行，有点像自己捏一个噪声。


![Untitled.png](assets/高级水面白沫涟漪or海浪/003-47615e16.png)


为了展示这种方法会出现的问题，这里我简单给个sin做示范。


可以看见在这种深度渐变比较均匀的地形上，这个方法是比较不错的，而且视角的变动也不会影响水波。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/0959c3b1-8235-462f-a061-bfde55041d4a/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466563YVHRE%2F20260301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260301T151610Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCG7HRW7%2BkbRZX5t5jfzR%2BFB3OWC6Zaqy82BWaR1mn%2FNwIgA58ajjtdjnwxZ2s3D96VEia9HTke0uVnt0zSDyuvnfYq%2FwMIbxAAGgw2Mzc0MjMxODM4MDUiDOh4aEid8lxAx5feQircA0DDMrLofc1Hspu%2FeNpepoipVojPj%2FomwpJFK2FLVBOPnvxza7ubRHDre7hZbOyq16rZgM7K40uOn7KtEw0wdz%2FnVzKAtwuRq64rK5Pjbv9zoX952Wb0D5zNiRcOiTZ5%2FjgkU93P5019ENaXGnllQ9%2FRJ2%2BWAyvbAvjwVkYPs08TZE14RHS3PTQA3t8p3rWMCDkbiGJ5CRALnmddx8MsITFR3To1cb5YFLN9mDQEnn8e3F7Pf1u%2FXhhwTCRX9ZkglIFpYIcUxrW3TJXk%2BQYUd1YFBfzaA%2F6%2BdekzVrNtooynW65ymc6CG1tx7rUbOdF93uEMkAbGJcnORsRw%2Fez%2BSzbd9JTGOkbeZEdd%2BBNf3RqPVPMb0toteyVa6WrltTC%2B98O0hNA5Jl6JUXZ6u9rvKz4kGwutCVtetrB4DJRU3mF4jH52JZf%2BlM1fY%2BHR%2BZO10PivvrguGw%2FE5UQvrL0LwMcaE715h3oFx1uQXLhRfQicpKt8lz9H1wCN5ELr8oqk6snMiCKurwnSHZvgPEh9W7hYp4SHonKxByLyYKtEDo%2FLuD4GfbrJAAHM%2BhAyYZi7rH1JMLmwsl5RMhnqaSsaLn3Bf0OTy6BrXwPFnYp4HQl0r8EHkSzFaRmOTp9yMNGTkc0GOqUBp%2F57cHTQvyaarc5%2Fx8DDr3CPdpO%2FLYarCPtjsLz6t%2Bw23fMHugcWNyT4HTrO5P5lLCZfAu%2BTQl%2FadW3ck7mSaWLD1PaiknLzkl0X45aqlAW1yU%2Bt0UhgHqbVbxrpZUM7EUdFVWhC1eBUX6nVmgKXR8PDkhz7RBHM3BfgDNnIfT76ItEhLLR8%2BOTry45Ca65tYjDctBjFumsdathbZS8lWWh2BIta&X-Amz-Signature=98f230beeb740a680c7aaacb4baf04075d124c133b3c24e34693132a91acc1a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


但是，如果在深度渐变不均匀的地形或者场景中，就特别容易发生白沫大面积出现的问题。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/9a4613c1-b501-4363-b2a7-8003263eda47/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466563YVHRE%2F20260301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260301T151610Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCG7HRW7%2BkbRZX5t5jfzR%2BFB3OWC6Zaqy82BWaR1mn%2FNwIgA58ajjtdjnwxZ2s3D96VEia9HTke0uVnt0zSDyuvnfYq%2FwMIbxAAGgw2Mzc0MjMxODM4MDUiDOh4aEid8lxAx5feQircA0DDMrLofc1Hspu%2FeNpepoipVojPj%2FomwpJFK2FLVBOPnvxza7ubRHDre7hZbOyq16rZgM7K40uOn7KtEw0wdz%2FnVzKAtwuRq64rK5Pjbv9zoX952Wb0D5zNiRcOiTZ5%2FjgkU93P5019ENaXGnllQ9%2FRJ2%2BWAyvbAvjwVkYPs08TZE14RHS3PTQA3t8p3rWMCDkbiGJ5CRALnmddx8MsITFR3To1cb5YFLN9mDQEnn8e3F7Pf1u%2FXhhwTCRX9ZkglIFpYIcUxrW3TJXk%2BQYUd1YFBfzaA%2F6%2BdekzVrNtooynW65ymc6CG1tx7rUbOdF93uEMkAbGJcnORsRw%2Fez%2BSzbd9JTGOkbeZEdd%2BBNf3RqPVPMb0toteyVa6WrltTC%2B98O0hNA5Jl6JUXZ6u9rvKz4kGwutCVtetrB4DJRU3mF4jH52JZf%2BlM1fY%2BHR%2BZO10PivvrguGw%2FE5UQvrL0LwMcaE715h3oFx1uQXLhRfQicpKt8lz9H1wCN5ELr8oqk6snMiCKurwnSHZvgPEh9W7hYp4SHonKxByLyYKtEDo%2FLuD4GfbrJAAHM%2BhAyYZi7rH1JMLmwsl5RMhnqaSsaLn3Bf0OTy6BrXwPFnYp4HQl0r8EHkSzFaRmOTp9yMNGTkc0GOqUBp%2F57cHTQvyaarc5%2Fx8DDr3CPdpO%2FLYarCPtjsLz6t%2Bw23fMHugcWNyT4HTrO5P5lLCZfAu%2BTQl%2FadW3ck7mSaWLD1PaiknLzkl0X45aqlAW1yU%2Bt0UhgHqbVbxrpZUM7EUdFVWhC1eBUX6nVmgKXR8PDkhz7RBHM3BfgDNnIfT76ItEhLLR8%2BOTry45Ca65tYjDctBjFumsdathbZS8lWWh2BIta&X-Amz-Signature=475df058193e22cfabb50c6fe3eeec4d30ed72825547c2aa69b8d4b01e584bd8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


出现这个问题的原因就是大面积的斜率过小，导致大面积的深度值一样，同时出现白沫。


![Untitled.png](assets/高级水面白沫涟漪or海浪/004-cdd09549.png)


就如此图一样。


如何避免这类问题，以下为个人思考和经验，既然确定这个问题是由于斜率过小不合适导致的，那我们应该屏蔽这类斜率过小的区域。但是仅仅根据已知的这几个信息无法知道斜率，所以大部分人都会选择烘焙一张垂直的拍摄的信息图，像SDF或者法线这些。


然而我像做一个通用的效果，并不想去烘焙这些信息，在这个前提下，该怎么拿到水面下的场景深度斜率，这里就会想到用DDX与DDY去拿到当前深度与周围的深度的变化率，就可以算得当前点的法线，归一化的法线的Y轴便是当前点的斜率大小。


![Untitled.jpeg](assets/高级水面白沫涟漪or海浪/005-0349809f.jpeg)


这一步，我们便是使用当前水底点的世界空间坐标去和周围水底点世界空间坐标去做DDX与DDY得到当前点的水底世界空间法线。


![Untitled.png](assets/高级水面白沫涟漪or海浪/006-94bb7a38.png)


法线为-1到1大小，所以有部分为黑色。因为地形本身就是格子，一个地形面片内的法线是固定的，所以看起来结果是这样的，目前可以确认是正确的。


现在我们只需要屏蔽掉不合适的区域既可以。


![Untitled.png](assets/高级水面白沫涟漪or海浪/007-66ac3ab5.png)


这里我就屏蔽了斜率小于一定阈值的区域。最后就可以得到正确的效果啦。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/974e4a02-f3bb-4312-a1cf-7c7ae6caeb02/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466563YVHRE%2F20260301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260301T151610Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCG7HRW7%2BkbRZX5t5jfzR%2BFB3OWC6Zaqy82BWaR1mn%2FNwIgA58ajjtdjnwxZ2s3D96VEia9HTke0uVnt0zSDyuvnfYq%2FwMIbxAAGgw2Mzc0MjMxODM4MDUiDOh4aEid8lxAx5feQircA0DDMrLofc1Hspu%2FeNpepoipVojPj%2FomwpJFK2FLVBOPnvxza7ubRHDre7hZbOyq16rZgM7K40uOn7KtEw0wdz%2FnVzKAtwuRq64rK5Pjbv9zoX952Wb0D5zNiRcOiTZ5%2FjgkU93P5019ENaXGnllQ9%2FRJ2%2BWAyvbAvjwVkYPs08TZE14RHS3PTQA3t8p3rWMCDkbiGJ5CRALnmddx8MsITFR3To1cb5YFLN9mDQEnn8e3F7Pf1u%2FXhhwTCRX9ZkglIFpYIcUxrW3TJXk%2BQYUd1YFBfzaA%2F6%2BdekzVrNtooynW65ymc6CG1tx7rUbOdF93uEMkAbGJcnORsRw%2Fez%2BSzbd9JTGOkbeZEdd%2BBNf3RqPVPMb0toteyVa6WrltTC%2B98O0hNA5Jl6JUXZ6u9rvKz4kGwutCVtetrB4DJRU3mF4jH52JZf%2BlM1fY%2BHR%2BZO10PivvrguGw%2FE5UQvrL0LwMcaE715h3oFx1uQXLhRfQicpKt8lz9H1wCN5ELr8oqk6snMiCKurwnSHZvgPEh9W7hYp4SHonKxByLyYKtEDo%2FLuD4GfbrJAAHM%2BhAyYZi7rH1JMLmwsl5RMhnqaSsaLn3Bf0OTy6BrXwPFnYp4HQl0r8EHkSzFaRmOTp9yMNGTkc0GOqUBp%2F57cHTQvyaarc5%2Fx8DDr3CPdpO%2FLYarCPtjsLz6t%2Bw23fMHugcWNyT4HTrO5P5lLCZfAu%2BTQl%2FadW3ck7mSaWLD1PaiknLzkl0X45aqlAW1yU%2Bt0UhgHqbVbxrpZUM7EUdFVWhC1eBUX6nVmgKXR8PDkhz7RBHM3BfgDNnIfT76ItEhLLR8%2BOTry45Ca65tYjDctBjFumsdathbZS8lWWh2BIta&X-Amz-Signature=7191c4a32d05caebc8aa8d3126a81fdb497c79fdabc902fe568c57b8108cf779&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


剩下还没有有调整白沫形状函数的细节，我就不过多介绍啦，很多地方都有。具体可以看[https://zhuanlan.zhihu.com/p/63722738](https://zhuanlan.zhihu.com/p/63722738)

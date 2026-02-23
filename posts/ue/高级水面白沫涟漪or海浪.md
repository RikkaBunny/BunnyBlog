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
![Untitled.png](assets/高级水面白沫涟漪or海浪/001-66c3d906.png)


这是我们传统的通过水面当前像素深度、世界坐标位置、场景深度、相机位置求得一个稳定的水面深度，深度有两种，一种是从摄像机出发的深度，另一种则是垂直深度。这里我们求的为垂直深度。


![Untitled.png](assets/高级水面白沫涟漪or海浪/002-e43062e9.png)


（这里我用的SingleLayerWater，得到场景深度的节点为SceneDepthWithoutWater，正常半透明用SceneDepth）


**注意：SingleLayerWater的深度图存在降采样与半精度问题**


**r.Water.SingleLayer.RefractionDownsampleFactor 1**


**r.Water.SingleLayer.RefractionFullPrecision 1**


实际使用需要在代码里面更改一下默认值。我这里已经改过了。


得到水的深度这个线性值之后，便是捏水波或者说白沫的形状了，这部分全靠自己调整一下波形的相位、周期、振幅这些，而且也不局限于Sin波，只需要是连续可导的就行，有点像自己捏一个噪声。


![Untitled.png](assets/高级水面白沫涟漪or海浪/003-5fe4fe21.png)


为了展示这种方法会出现的问题，这里我简单给个sin做示范。


可以看见在这种深度渐变比较均匀的地形上，这个方法是比较不错的，而且视角的变动也不会影响水波。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/0959c3b1-8235-462f-a061-bfde55041d4a/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666NVCDTJ7%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T061516Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA4aCXVzLXdlc3QtMiJIMEYCIQCcGm4CbZOIC%2Bwx2EVxOEf2xx%2FXcQ8UptLbN2Vet8iaEAIhAIHKmoGLVp5mr0akB%2BgOTdX0QZtm5t7dG1Lwaa50GHjBKogECNf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyYGHhyirjbO90oz6Iq3AODsJRkHZ75JG5id%2F2%2BDSz17EM3AgWkXyVDvi%2Bc0Db95sqddaHVpdN9q7vPBuuTcuSUE9ekDnaHExQLCmLgQOQnqLJZoyygP6X9Ln5kVtv4H%2FGt0Ykq60F%2B9BqYKMsrkGroasufh2s9xGsp8N3ZdjWtVXtvc9dCiN0YnuRPglupPAYWMs3MaSGfPdFP2xJgOa0q0msMF%2FkEakHESod5mynyHVx8UxMX0gUeUPMX18jy3LJSdhJF%2FcQ2Dy5wD8lDAw8%2Bpgqytf0BoDLSAeru9%2Bn2vutqlqsv9BI1lOb7qIIv3L%2BLsDQYYV5CN7VV32oenOHya7oP4hH0K2RVazc6J1gqL7bgsaACTTg8ehWXkjo7%2Fyl7j3fvBZqX8yKo9VnS4CKJXJPm64%2FlhJTh5OIeFw8FJG3Ub%2BhsYnBZd10q3yw54%2FcgrlKHpPpPvwPISbqy%2FjhFGHasFzhXcxPqkjlSK0VMPMEJwgDXqVHZ290lIj2Ggx1vDVi6UWodjyTkTbJpc12mBlthV4e18KMrzARUn2lHqBmdGkATIM9MnXgacBmV4zhpC8Vduyc7rSn0Rz%2B9XNfwp3u4%2BYr1yzaYPpfrDmmsOZKfFgRSI4oiybA%2ByZEux47L%2Fe5maHq0PPU%2BhzDb2O%2FMBjqkAQqjccZuaFgO2O%2BfzG59wQyur1SB7qoRorHZCpbkUVKOJfLiqxXZYJyCkMuflNmo1m%2FENllCPROr%2Fcs7TjPNf3P7WYjqiPoNnxVMioIchghlKyC%2BfzB8eQxfQY%2BxkWyg7Ri51NP5DozMgMpVIgfZS4KsNgWE1DhqS%2FttdciyZZ4kkBUuSeUas%2BGnHMiRHNItFoA88FrGXFX4R84YJvLTUOXqzPIv&X-Amz-Signature=71ee5c1a54138ee6e492d4ab14c0c9bcf23a96b5be0f1c8b43121c13c55771a1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


但是，如果在深度渐变不均匀的地形或者场景中，就特别容易发生白沫大面积出现的问题。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/9a4613c1-b501-4363-b2a7-8003263eda47/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666NVCDTJ7%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T061516Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA4aCXVzLXdlc3QtMiJIMEYCIQCcGm4CbZOIC%2Bwx2EVxOEf2xx%2FXcQ8UptLbN2Vet8iaEAIhAIHKmoGLVp5mr0akB%2BgOTdX0QZtm5t7dG1Lwaa50GHjBKogECNf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyYGHhyirjbO90oz6Iq3AODsJRkHZ75JG5id%2F2%2BDSz17EM3AgWkXyVDvi%2Bc0Db95sqddaHVpdN9q7vPBuuTcuSUE9ekDnaHExQLCmLgQOQnqLJZoyygP6X9Ln5kVtv4H%2FGt0Ykq60F%2B9BqYKMsrkGroasufh2s9xGsp8N3ZdjWtVXtvc9dCiN0YnuRPglupPAYWMs3MaSGfPdFP2xJgOa0q0msMF%2FkEakHESod5mynyHVx8UxMX0gUeUPMX18jy3LJSdhJF%2FcQ2Dy5wD8lDAw8%2Bpgqytf0BoDLSAeru9%2Bn2vutqlqsv9BI1lOb7qIIv3L%2BLsDQYYV5CN7VV32oenOHya7oP4hH0K2RVazc6J1gqL7bgsaACTTg8ehWXkjo7%2Fyl7j3fvBZqX8yKo9VnS4CKJXJPm64%2FlhJTh5OIeFw8FJG3Ub%2BhsYnBZd10q3yw54%2FcgrlKHpPpPvwPISbqy%2FjhFGHasFzhXcxPqkjlSK0VMPMEJwgDXqVHZ290lIj2Ggx1vDVi6UWodjyTkTbJpc12mBlthV4e18KMrzARUn2lHqBmdGkATIM9MnXgacBmV4zhpC8Vduyc7rSn0Rz%2B9XNfwp3u4%2BYr1yzaYPpfrDmmsOZKfFgRSI4oiybA%2ByZEux47L%2Fe5maHq0PPU%2BhzDb2O%2FMBjqkAQqjccZuaFgO2O%2BfzG59wQyur1SB7qoRorHZCpbkUVKOJfLiqxXZYJyCkMuflNmo1m%2FENllCPROr%2Fcs7TjPNf3P7WYjqiPoNnxVMioIchghlKyC%2BfzB8eQxfQY%2BxkWyg7Ri51NP5DozMgMpVIgfZS4KsNgWE1DhqS%2FttdciyZZ4kkBUuSeUas%2BGnHMiRHNItFoA88FrGXFX4R84YJvLTUOXqzPIv&X-Amz-Signature=14c508c2df2995cf322d908e77515b51ff60843a40a00c0465310996723acbcb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


出现这个问题的原因就是大面积的斜率过小，导致大面积的深度值一样，同时出现白沫。


![Untitled.png](assets/高级水面白沫涟漪or海浪/004-de495ef4.png)


就如此图一样。


如何避免这类问题，以下为个人思考和经验，既然确定这个问题是由于斜率过小不合适导致的，那我们应该屏蔽这类斜率过小的区域。但是仅仅根据已知的这几个信息无法知道斜率，所以大部分人都会选择烘焙一张垂直的拍摄的信息图，像SDF或者法线这些。


然而我像做一个通用的效果，并不想去烘焙这些信息，在这个前提下，该怎么拿到水面下的场景深度斜率，这里就会想到用DDX与DDY去拿到当前深度与周围的深度的变化率，就可以算得当前点的法线，归一化的法线的Y轴便是当前点的斜率大小。


![Untitled.jpeg](assets/高级水面白沫涟漪or海浪/005-b3fac472.jpeg)


这一步，我们便是使用当前水底点的世界空间坐标去和周围水底点世界空间坐标去做DDX与DDY得到当前点的水底世界空间法线。


![Untitled.png](assets/高级水面白沫涟漪or海浪/006-c94acffd.png)


法线为-1到1大小，所以有部分为黑色。因为地形本身就是格子，一个地形面片内的法线是固定的，所以看起来结果是这样的，目前可以确认是正确的。


现在我们只需要屏蔽掉不合适的区域既可以。


![Untitled.png](assets/高级水面白沫涟漪or海浪/007-329ce043.png)


这里我就屏蔽了斜率小于一定阈值的区域。最后就可以得到正确的效果啦。


[Untitled.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/974e4a02-f3bb-4312-a1cf-7c7ae6caeb02/Untitled.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666NVCDTJ7%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T061517Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA4aCXVzLXdlc3QtMiJIMEYCIQCcGm4CbZOIC%2Bwx2EVxOEf2xx%2FXcQ8UptLbN2Vet8iaEAIhAIHKmoGLVp5mr0akB%2BgOTdX0QZtm5t7dG1Lwaa50GHjBKogECNf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyYGHhyirjbO90oz6Iq3AODsJRkHZ75JG5id%2F2%2BDSz17EM3AgWkXyVDvi%2Bc0Db95sqddaHVpdN9q7vPBuuTcuSUE9ekDnaHExQLCmLgQOQnqLJZoyygP6X9Ln5kVtv4H%2FGt0Ykq60F%2B9BqYKMsrkGroasufh2s9xGsp8N3ZdjWtVXtvc9dCiN0YnuRPglupPAYWMs3MaSGfPdFP2xJgOa0q0msMF%2FkEakHESod5mynyHVx8UxMX0gUeUPMX18jy3LJSdhJF%2FcQ2Dy5wD8lDAw8%2Bpgqytf0BoDLSAeru9%2Bn2vutqlqsv9BI1lOb7qIIv3L%2BLsDQYYV5CN7VV32oenOHya7oP4hH0K2RVazc6J1gqL7bgsaACTTg8ehWXkjo7%2Fyl7j3fvBZqX8yKo9VnS4CKJXJPm64%2FlhJTh5OIeFw8FJG3Ub%2BhsYnBZd10q3yw54%2FcgrlKHpPpPvwPISbqy%2FjhFGHasFzhXcxPqkjlSK0VMPMEJwgDXqVHZ290lIj2Ggx1vDVi6UWodjyTkTbJpc12mBlthV4e18KMrzARUn2lHqBmdGkATIM9MnXgacBmV4zhpC8Vduyc7rSn0Rz%2B9XNfwp3u4%2BYr1yzaYPpfrDmmsOZKfFgRSI4oiybA%2ByZEux47L%2Fe5maHq0PPU%2BhzDb2O%2FMBjqkAQqjccZuaFgO2O%2BfzG59wQyur1SB7qoRorHZCpbkUVKOJfLiqxXZYJyCkMuflNmo1m%2FENllCPROr%2Fcs7TjPNf3P7WYjqiPoNnxVMioIchghlKyC%2BfzB8eQxfQY%2BxkWyg7Ri51NP5DozMgMpVIgfZS4KsNgWE1DhqS%2FttdciyZZ4kkBUuSeUas%2BGnHMiRHNItFoA88FrGXFX4R84YJvLTUOXqzPIv&X-Amz-Signature=641064a4ff8b2e892ecc2f51e0febb97469f1b3d2e3ae4c6f5def2211109242b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


剩下还没有有调整白沫形状函数的细节，我就不过多介绍啦，很多地方都有。具体可以看[https://zhuanlan.zhihu.com/p/63722738](https://zhuanlan.zhihu.com/p/63722738)

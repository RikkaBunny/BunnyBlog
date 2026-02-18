---
title: "CombineMesh"
categories: ["Houdini"]
date: "2023-07-07"
created: "2023-07-07T15:27:00.000Z"
updated: "2023-07-07T15:53:00.000Z"
notion_url: "https://www.notion.so/CombineMesh-8dc1e5e15734423eb4c9ae2705d4fd82"
database: "Houdini Technical"
---


![](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/1a76a508-1030-41a0-9dcd-ec62e3e5c78e/CombineMesh.drawio.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X7UZM5IV%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T055013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4NTqFGePCLqSZ6Rs%2Feu%2BhlRPvx9jlkhuLuyFKF02nNAIgAhH3WQL1ctkFDn0XZ6LdWfBveLkux1AtASoIvjQdtkAq%2FwMIXhAAGgw2Mzc0MjMxODM4MDUiDHYQHLtQ3WxrZKak%2FircAwgqmshVEVvAR6TbFm9G7XoSt8sBkFHC2PkbNCaUUVdOrp%2BXPGmpadrZ3j0Qi9HMYQDnwBnBlaBvHrMLd8e0pOJejFlPO%2B9V0oOXvvdZC4j30AiK5Bn3RO3qMK6rKg9nn5oSBhBhoDPEWAcC2itSoXeHRqDMdeineaR6OS0323QrpC%2F8B45se1hhabY%2FulzRjaTcH%2Bl1ZhyxyOgVzwiCIRE1qKvpU1puYPKcz6qT9iu3cGdwnmKqujRcOXMDcSfmknJHtsHLtlqWJC3kyaAdM0hgSekeVTfsQNjTqnOz%2FX1Nxe%2B7BIpuOjF%2Bb391%2BLg5%2FV3%2Fa5ZabLyYgU7Drbt1MZWrc8E3RB2juRCRZWj7%2FiKymRiyrHgbcZi4wlPP7PuKNnvwB6iXVNzYmIj9tXOfcicssqE8Ul9ptcsJvrgpe09HZVDSIYl3HV16KnB93ACH1Zhif%2Fqimb%2FA1KfKWjXBzCVaP%2FBtfUkFl2hhS%2Fl3SFMixup5L9rtecQ49brY9YLZsgf5CLpKDBgV7pEwRM6pqUzyLWwmcqU4ck0PeD6UUZZlqQahwwUQp0uIyVHOFMNpmCOjaEFIc4%2BMskeoX1G275DUn8UAZLghlcXeGBhYAzmhUAyAj9EdlwDtHBYiMOCV1cwGOqUBcm4b7Vg3TJ6iRZYZiuE5lkkhgkkmQFFfebRGK1lXd%2BkMm7YUz50wHxaR09TsEoLZwDxgvYrUqdAgIwWpyunAkabGf%2FcNf5HWt97BTWI0McmXi2LGMsJmFlnuOW20mmqyhRDnOqb7tEHsjnECDWjjBOScN4hNCVoUMUKasmCH7odUFeLXjvHnus317IjMtNC7gfYm0vANyT15hiJKXMuKMZX0FAhf&X-Amz-Signature=f91247cde3970975f8cd4ae65874499e68605c2189a34aa043ae89a0cf761db0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

### 输入：

输入我们可以分为三种：河流水片(输入1)、湖泊水片(输入1)、外部导入水片(输入2)

进入HDA，我们需要先把输入分一下类，河流与湖泊使用自身Tag区分，分别输入两个Foreach，这边湖泊循环模式使用MergeEachIteration，河流循环模式使用FeedbackEachIteration。

### 湖泊裁剪：

湖泊裁剪这边主要还是使用boolean (A-B)，这里需要注意的一个问题是我们需要把boolean的两个输入尽量高度保持一致，这里我先把湖泊水片高度存贮在height属性上，临时把@P.y=0;输入boolean的A，并把输入端B的水片高度也设置为0；这样我们的布尔操作的话可以保证有一个好的结果。

### 湖泊网格密度设置：

这里我们可以先使用remesh节点Adaptive功能，这样会得到一个Mesh密度自适应的结果，

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/84dcc7ce-a231-4eef-8e5d-bbb4ee7781ad/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X7UZM5IV%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T055013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4NTqFGePCLqSZ6Rs%2Feu%2BhlRPvx9jlkhuLuyFKF02nNAIgAhH3WQL1ctkFDn0XZ6LdWfBveLkux1AtASoIvjQdtkAq%2FwMIXhAAGgw2Mzc0MjMxODM4MDUiDHYQHLtQ3WxrZKak%2FircAwgqmshVEVvAR6TbFm9G7XoSt8sBkFHC2PkbNCaUUVdOrp%2BXPGmpadrZ3j0Qi9HMYQDnwBnBlaBvHrMLd8e0pOJejFlPO%2B9V0oOXvvdZC4j30AiK5Bn3RO3qMK6rKg9nn5oSBhBhoDPEWAcC2itSoXeHRqDMdeineaR6OS0323QrpC%2F8B45se1hhabY%2FulzRjaTcH%2Bl1ZhyxyOgVzwiCIRE1qKvpU1puYPKcz6qT9iu3cGdwnmKqujRcOXMDcSfmknJHtsHLtlqWJC3kyaAdM0hgSekeVTfsQNjTqnOz%2FX1Nxe%2B7BIpuOjF%2Bb391%2BLg5%2FV3%2Fa5ZabLyYgU7Drbt1MZWrc8E3RB2juRCRZWj7%2FiKymRiyrHgbcZi4wlPP7PuKNnvwB6iXVNzYmIj9tXOfcicssqE8Ul9ptcsJvrgpe09HZVDSIYl3HV16KnB93ACH1Zhif%2Fqimb%2FA1KfKWjXBzCVaP%2FBtfUkFl2hhS%2Fl3SFMixup5L9rtecQ49brY9YLZsgf5CLpKDBgV7pEwRM6pqUzyLWwmcqU4ck0PeD6UUZZlqQahwwUQp0uIyVHOFMNpmCOjaEFIc4%2BMskeoX1G275DUn8UAZLghlcXeGBhYAzmhUAyAj9EdlwDtHBYiMOCV1cwGOqUBcm4b7Vg3TJ6iRZYZiuE5lkkhgkkmQFFfebRGK1lXd%2BkMm7YUz50wHxaR09TsEoLZwDxgvYrUqdAgIwWpyunAkabGf%2FcNf5HWt97BTWI0McmXi2LGMsJmFlnuOW20mmqyhRDnOqb7tEHsjnECDWjjBOScN4hNCVoUMUKasmCH7odUFeLXjvHnus317IjMtNC7gfYm0vANyT15hiJKXMuKMZX0FAhf&X-Amz-Signature=711482e108345bce53f3dfaafcde17758afdda5acde38c10dfad7d45d8c15dc2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

(houdini18以后Remesh节点布局有些许变化，功能一样，但是需要自行指定一个自适应属性)

最后可以根据具体需要再通过polyreduce减面。

### 湖泊网格属性设置：

这里我们可以先将上面高度还原回来，之后便是设置顶点色，以及其他自己需要在Shader里面信息(可在任意阶段制作)，删除掉一些冗余的数据，并打上湖泊的Tag，便可以Pack输出并结束本次循环。


### 河流部分：

河流部分其实操作与湖泊部分操作相差不多，主要是因为河流之间可能相互影响，所以我们输入节点并不是FetchPiece or Point，而是使用Feedback一次全部输入进去，使用delete节点通过index一条一条遍历，当遍历A时候，其他河流((1-A) , 也可只保留A附近河流)便可以进入布尔输入端B。

河流的Remesh与湖泊的Remesh也不太一样，河流Remesh通常使用均匀密度的Remesh，Remesh大小可以暴露，这里有个小的注意事项 Remesh节点可能会在某些Iterations下出现错误的情况，比如有些顶点为Nan，我通常会在Remesh和Boolean之前放上一个Clean以确保数据的干净，遇到过使用Clean之后再特点Iterations下也出现Nan错误，更改Iterations便没有，这时候可以用 isnan(@Cd)来判断是否有nan数据(确保有Cd属性情况下)，如果有可以更换Iterations。


### 外部水片部分：

对于外部输入的水片，我们只需要设置好自己需要的属性，并打上Tag，Pack起来就可以啦。


### 顶点衔接：

对于顶点衔接操作，只针对与Shader需要使用顶点动画的水面，普通水面如果不需要使用顶点动画那么可以不需要这步操作。

这一步我们需要使用foreach feedback来循环遍历每一个水面，因为每个水面都对其他水面产生影响，所以我们也需要使用delete节点来根据Index区分当前操作水面与其他水面，我们可以通过Group的Include by Edges功能得到网格边缘顶点。

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/54eb20eb-dbec-4d87-bca7-66e91b8e5679/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X7UZM5IV%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T055013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4NTqFGePCLqSZ6Rs%2Feu%2BhlRPvx9jlkhuLuyFKF02nNAIgAhH3WQL1ctkFDn0XZ6LdWfBveLkux1AtASoIvjQdtkAq%2FwMIXhAAGgw2Mzc0MjMxODM4MDUiDHYQHLtQ3WxrZKak%2FircAwgqmshVEVvAR6TbFm9G7XoSt8sBkFHC2PkbNCaUUVdOrp%2BXPGmpadrZ3j0Qi9HMYQDnwBnBlaBvHrMLd8e0pOJejFlPO%2B9V0oOXvvdZC4j30AiK5Bn3RO3qMK6rKg9nn5oSBhBhoDPEWAcC2itSoXeHRqDMdeineaR6OS0323QrpC%2F8B45se1hhabY%2FulzRjaTcH%2Bl1ZhyxyOgVzwiCIRE1qKvpU1puYPKcz6qT9iu3cGdwnmKqujRcOXMDcSfmknJHtsHLtlqWJC3kyaAdM0hgSekeVTfsQNjTqnOz%2FX1Nxe%2B7BIpuOjF%2Bb391%2BLg5%2FV3%2Fa5ZabLyYgU7Drbt1MZWrc8E3RB2juRCRZWj7%2FiKymRiyrHgbcZi4wlPP7PuKNnvwB6iXVNzYmIj9tXOfcicssqE8Ul9ptcsJvrgpe09HZVDSIYl3HV16KnB93ACH1Zhif%2Fqimb%2FA1KfKWjXBzCVaP%2FBtfUkFl2hhS%2Fl3SFMixup5L9rtecQ49brY9YLZsgf5CLpKDBgV7pEwRM6pqUzyLWwmcqU4ck0PeD6UUZZlqQahwwUQp0uIyVHOFMNpmCOjaEFIc4%2BMskeoX1G275DUn8UAZLghlcXeGBhYAzmhUAyAj9EdlwDtHBYiMOCV1cwGOqUBcm4b7Vg3TJ6iRZYZiuE5lkkhgkkmQFFfebRGK1lXd%2BkMm7YUz50wHxaR09TsEoLZwDxgvYrUqdAgIwWpyunAkabGf%2FcNf5HWt97BTWI0McmXi2LGMsJmFlnuOW20mmqyhRDnOqb7tEHsjnECDWjjBOScN4hNCVoUMUKasmCH7odUFeLXjvHnus317IjMtNC7gfYm0vANyT15hiJKXMuKMZX0FAhf&X-Amz-Signature=a33746f56fd51e2258a4e9efa27f3d861352a545d57b0e56cbe18413e38ee11e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

通过xyzdist()函数便可以保留与当前操作水面相近的顶点啦。

随后，我们便可以使用这些顶点作为foreach的数据遍历端(Fetch Piece or Point)，当前操作水面作为数据回滚端(Fetch Feedback)，这样就能根据相近顶点数循环Feedback遍历当前操作水面啦。

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/bbc12dee-01f3-445c-8802-4ca796c578f9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X7UZM5IV%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T055013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4NTqFGePCLqSZ6Rs%2Feu%2BhlRPvx9jlkhuLuyFKF02nNAIgAhH3WQL1ctkFDn0XZ6LdWfBveLkux1AtASoIvjQdtkAq%2FwMIXhAAGgw2Mzc0MjMxODM4MDUiDHYQHLtQ3WxrZKak%2FircAwgqmshVEVvAR6TbFm9G7XoSt8sBkFHC2PkbNCaUUVdOrp%2BXPGmpadrZ3j0Qi9HMYQDnwBnBlaBvHrMLd8e0pOJejFlPO%2B9V0oOXvvdZC4j30AiK5Bn3RO3qMK6rKg9nn5oSBhBhoDPEWAcC2itSoXeHRqDMdeineaR6OS0323QrpC%2F8B45se1hhabY%2FulzRjaTcH%2Bl1ZhyxyOgVzwiCIRE1qKvpU1puYPKcz6qT9iu3cGdwnmKqujRcOXMDcSfmknJHtsHLtlqWJC3kyaAdM0hgSekeVTfsQNjTqnOz%2FX1Nxe%2B7BIpuOjF%2Bb391%2BLg5%2FV3%2Fa5ZabLyYgU7Drbt1MZWrc8E3RB2juRCRZWj7%2FiKymRiyrHgbcZi4wlPP7PuKNnvwB6iXVNzYmIj9tXOfcicssqE8Ul9ptcsJvrgpe09HZVDSIYl3HV16KnB93ACH1Zhif%2Fqimb%2FA1KfKWjXBzCVaP%2FBtfUkFl2hhS%2Fl3SFMixup5L9rtecQ49brY9YLZsgf5CLpKDBgV7pEwRM6pqUzyLWwmcqU4ck0PeD6UUZZlqQahwwUQp0uIyVHOFMNpmCOjaEFIc4%2BMskeoX1G275DUn8UAZLghlcXeGBhYAzmhUAyAj9EdlwDtHBYiMOCV1cwGOqUBcm4b7Vg3TJ6iRZYZiuE5lkkhgkkmQFFfebRGK1lXd%2BkMm7YUz50wHxaR09TsEoLZwDxgvYrUqdAgIwWpyunAkabGf%2FcNf5HWt97BTWI0McmXi2LGMsJmFlnuOW20mmqyhRDnOqb7tEHsjnECDWjjBOScN4hNCVoUMUKasmCH7odUFeLXjvHnus317IjMtNC7gfYm0vANyT15hiJKXMuKMZX0FAhf&X-Amz-Signature=7901a82105ffe7b620f309a0dd12f834f7e38066920ded47d8983dbd69b633c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

第一步我们需要找到相近顶点(顶点A)与当前操作水面(水面B)相接的prim。我们可以使用xyzdist()来判断是否相接。如果相接则保留下相接prim序号。

```c#
int prim;
vector uvw;

vector pos = point(1,"P",0);
float dist = xyzdist(0,pos,prim,uvw);
int nearPt0 = nearpoint(0,pos);
vector nearPos = point(0,"P",nearPt0);

v@pos = nearPos;
i@prnum = -1;

if(dist < 0.01 && distance(nearPos,pos)>0.01){
    i@prnum = prim;
}
```

得到顶点A所相接的prim之后，我们还需要得到顶点A所相接的边，我们便可以通过遍历prim的顶点顺序，循环检测 Normal(当前顶点位置-顶点A位置) 是否等于 Normal(当前顶点位置-下一个顶点位置) ，查看这两向量是否相等。如果相当，那么顶点A就在当前顶点与下一个顶点构成的这条边上。

```c#
int p0 ;
int p1 ;

vector pos = point(1,"P",0);
int pvcount = primvertexcount(0,i@prnum);

for(int i = 0;i < pvcount ;i++){
    int linearV = vertexindex(0,i@prnum,i);
    int linearNextV = vertexindex(0,i@prnum,(i+1)%pvcount);
    int curPoint = vertexpoint(0,linearV);
    int nextPoint = vertexpoint(0,linearNextV);
    
    vector curPos = point(0,"P",curPoint);
    vector nextPos = point(0,"P",nextPoint);
    //printf('--%d  %d ' , curPoint, nextPoint);
    vector p0_p_dir = normalize(curPos - pos);
    vector p_p1_dir = normalize(curPos - nextPos);
    
    if((p_p1_dir+set(0.001f,0.001f,0.001f)) >= p0_p_dir && (p_p1_dir-set(0.001f,0.001f,0.001f)) <= p0_p_dir){
            p0 = curPoint;
            p1 = nextPoint;
            //printf('--%d  %d ' , p0num, p1num);
    }
}
//printf('--%d  %d ' , p0, p1);
//printf("..%d %d",p0,p1);
setedgegroup(0,"edge",p0,p1,1);
//容错处理
if(p0 == p1){
    i@prnum = -1;
}
```

得到这条边之后，我们就可以使用EdgeDivide节点用来在这条边上生成一个正确的顶点。(如果自己生成顶点的话，需要考虑顶点顺序、属性插值等等，测试下来这种方式比较简单方便)

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/2ee13514-246c-4b25-922c-f3b48a384395/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X7UZM5IV%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T055013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4NTqFGePCLqSZ6Rs%2Feu%2BhlRPvx9jlkhuLuyFKF02nNAIgAhH3WQL1ctkFDn0XZ6LdWfBveLkux1AtASoIvjQdtkAq%2FwMIXhAAGgw2Mzc0MjMxODM4MDUiDHYQHLtQ3WxrZKak%2FircAwgqmshVEVvAR6TbFm9G7XoSt8sBkFHC2PkbNCaUUVdOrp%2BXPGmpadrZ3j0Qi9HMYQDnwBnBlaBvHrMLd8e0pOJejFlPO%2B9V0oOXvvdZC4j30AiK5Bn3RO3qMK6rKg9nn5oSBhBhoDPEWAcC2itSoXeHRqDMdeineaR6OS0323QrpC%2F8B45se1hhabY%2FulzRjaTcH%2Bl1ZhyxyOgVzwiCIRE1qKvpU1puYPKcz6qT9iu3cGdwnmKqujRcOXMDcSfmknJHtsHLtlqWJC3kyaAdM0hgSekeVTfsQNjTqnOz%2FX1Nxe%2B7BIpuOjF%2Bb391%2BLg5%2FV3%2Fa5ZabLyYgU7Drbt1MZWrc8E3RB2juRCRZWj7%2FiKymRiyrHgbcZi4wlPP7PuKNnvwB6iXVNzYmIj9tXOfcicssqE8Ul9ptcsJvrgpe09HZVDSIYl3HV16KnB93ACH1Zhif%2Fqimb%2FA1KfKWjXBzCVaP%2FBtfUkFl2hhS%2Fl3SFMixup5L9rtecQ49brY9YLZsgf5CLpKDBgV7pEwRM6pqUzyLWwmcqU4ck0PeD6UUZZlqQahwwUQp0uIyVHOFMNpmCOjaEFIc4%2BMskeoX1G275DUn8UAZLghlcXeGBhYAzmhUAyAj9EdlwDtHBYiMOCV1cwGOqUBcm4b7Vg3TJ6iRZYZiuE5lkkhgkkmQFFfebRGK1lXd%2BkMm7YUz50wHxaR09TsEoLZwDxgvYrUqdAgIwWpyunAkabGf%2FcNf5HWt97BTWI0McmXi2LGMsJmFlnuOW20mmqyhRDnOqb7tEHsjnECDWjjBOScN4hNCVoUMUKasmCH7odUFeLXjvHnus317IjMtNC7gfYm0vANyT15hiJKXMuKMZX0FAhf&X-Amz-Signature=34f87ab76e3ae0e47e2f046102247d20e145ce8be348ea693fabb04bc28c2926&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

生成的顶点@ptnum = @numpt-1；我们可以设置它的Pos，让生成的顶点位置等于顶点A的位置。

上面我们找相接prim和寻找相接边时 留下了i@prnum = -1的容错处理，这是方便我们上面如果出现错误 ，或者不满足条件时候，我们可以通过i@prnum来进行一个switch处理用来选择是否使用顶点生成处理。

当我们处理完之后，我们可以得到这样的Mesh。

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/0566b2e8-5f55-4356-8f28-eabcf1b4caf5/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X7UZM5IV%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T055013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4NTqFGePCLqSZ6Rs%2Feu%2BhlRPvx9jlkhuLuyFKF02nNAIgAhH3WQL1ctkFDn0XZ6LdWfBveLkux1AtASoIvjQdtkAq%2FwMIXhAAGgw2Mzc0MjMxODM4MDUiDHYQHLtQ3WxrZKak%2FircAwgqmshVEVvAR6TbFm9G7XoSt8sBkFHC2PkbNCaUUVdOrp%2BXPGmpadrZ3j0Qi9HMYQDnwBnBlaBvHrMLd8e0pOJejFlPO%2B9V0oOXvvdZC4j30AiK5Bn3RO3qMK6rKg9nn5oSBhBhoDPEWAcC2itSoXeHRqDMdeineaR6OS0323QrpC%2F8B45se1hhabY%2FulzRjaTcH%2Bl1ZhyxyOgVzwiCIRE1qKvpU1puYPKcz6qT9iu3cGdwnmKqujRcOXMDcSfmknJHtsHLtlqWJC3kyaAdM0hgSekeVTfsQNjTqnOz%2FX1Nxe%2B7BIpuOjF%2Bb391%2BLg5%2FV3%2Fa5ZabLyYgU7Drbt1MZWrc8E3RB2juRCRZWj7%2FiKymRiyrHgbcZi4wlPP7PuKNnvwB6iXVNzYmIj9tXOfcicssqE8Ul9ptcsJvrgpe09HZVDSIYl3HV16KnB93ACH1Zhif%2Fqimb%2FA1KfKWjXBzCVaP%2FBtfUkFl2hhS%2Fl3SFMixup5L9rtecQ49brY9YLZsgf5CLpKDBgV7pEwRM6pqUzyLWwmcqU4ck0PeD6UUZZlqQahwwUQp0uIyVHOFMNpmCOjaEFIc4%2BMskeoX1G275DUn8UAZLghlcXeGBhYAzmhUAyAj9EdlwDtHBYiMOCV1cwGOqUBcm4b7Vg3TJ6iRZYZiuE5lkkhgkkmQFFfebRGK1lXd%2BkMm7YUz50wHxaR09TsEoLZwDxgvYrUqdAgIwWpyunAkabGf%2FcNf5HWt97BTWI0McmXi2LGMsJmFlnuOW20mmqyhRDnOqb7tEHsjnECDWjjBOScN4hNCVoUMUKasmCH7odUFeLXjvHnus317IjMtNC7gfYm0vANyT15hiJKXMuKMZX0FAhf&X-Amz-Signature=1b70bb4838e43492e35b4b25edf51b38e3ff7f850633cd37b4b6ae957b133253&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

我们可以在这个Mesh下使用divide节点用来得到一个正确的结果。(三角化这一步引擎也可以帮我们做)

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/15b011c8-da19-4e68-92b4-a67561f3dad1/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X7UZM5IV%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T055013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4NTqFGePCLqSZ6Rs%2Feu%2BhlRPvx9jlkhuLuyFKF02nNAIgAhH3WQL1ctkFDn0XZ6LdWfBveLkux1AtASoIvjQdtkAq%2FwMIXhAAGgw2Mzc0MjMxODM4MDUiDHYQHLtQ3WxrZKak%2FircAwgqmshVEVvAR6TbFm9G7XoSt8sBkFHC2PkbNCaUUVdOrp%2BXPGmpadrZ3j0Qi9HMYQDnwBnBlaBvHrMLd8e0pOJejFlPO%2B9V0oOXvvdZC4j30AiK5Bn3RO3qMK6rKg9nn5oSBhBhoDPEWAcC2itSoXeHRqDMdeineaR6OS0323QrpC%2F8B45se1hhabY%2FulzRjaTcH%2Bl1ZhyxyOgVzwiCIRE1qKvpU1puYPKcz6qT9iu3cGdwnmKqujRcOXMDcSfmknJHtsHLtlqWJC3kyaAdM0hgSekeVTfsQNjTqnOz%2FX1Nxe%2B7BIpuOjF%2Bb391%2BLg5%2FV3%2Fa5ZabLyYgU7Drbt1MZWrc8E3RB2juRCRZWj7%2FiKymRiyrHgbcZi4wlPP7PuKNnvwB6iXVNzYmIj9tXOfcicssqE8Ul9ptcsJvrgpe09HZVDSIYl3HV16KnB93ACH1Zhif%2Fqimb%2FA1KfKWjXBzCVaP%2FBtfUkFl2hhS%2Fl3SFMixup5L9rtecQ49brY9YLZsgf5CLpKDBgV7pEwRM6pqUzyLWwmcqU4ck0PeD6UUZZlqQahwwUQp0uIyVHOFMNpmCOjaEFIc4%2BMskeoX1G275DUn8UAZLghlcXeGBhYAzmhUAyAj9EdlwDtHBYiMOCV1cwGOqUBcm4b7Vg3TJ6iRZYZiuE5lkkhgkkmQFFfebRGK1lXd%2BkMm7YUz50wHxaR09TsEoLZwDxgvYrUqdAgIwWpyunAkabGf%2FcNf5HWt97BTWI0McmXi2LGMsJmFlnuOW20mmqyhRDnOqb7tEHsjnECDWjjBOScN4hNCVoUMUKasmCH7odUFeLXjvHnus317IjMtNC7gfYm0vANyT15hiJKXMuKMZX0FAhf&X-Amz-Signature=bf31be0f6ca9bd4ad6a4a339a374013c5183be6cce771719dfeaed7342f13b3a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

得到顶点衔接处理过后的Mesh，我们便可以把Mesh输入时的Tag Copy过来，重新进行一个Pack起来设置Tag输出的操作。

### 过渡融合：

融合过渡的操作主要是解决河流与湖泊的过渡，以及不同水域之间的过渡，过渡带 我们使用顶点色的R通道标记。shader里面 当R = 1时，使用参数A，当R = 0时，使用参数B，线性过渡。我们不同水域之间的过渡只需要在 过渡区域使用相同的参数既可。

我们需要更加不同类型水面，使用它的Tag来标记它为第几条河的Index，我们就可以在参数面板上指定第几条河流与第几条河流混合。

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/031de3c6-4dfe-49f6-85bc-b0aac40d476a/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X7UZM5IV%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T055013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4NTqFGePCLqSZ6Rs%2Feu%2BhlRPvx9jlkhuLuyFKF02nNAIgAhH3WQL1ctkFDn0XZ6LdWfBveLkux1AtASoIvjQdtkAq%2FwMIXhAAGgw2Mzc0MjMxODM4MDUiDHYQHLtQ3WxrZKak%2FircAwgqmshVEVvAR6TbFm9G7XoSt8sBkFHC2PkbNCaUUVdOrp%2BXPGmpadrZ3j0Qi9HMYQDnwBnBlaBvHrMLd8e0pOJejFlPO%2B9V0oOXvvdZC4j30AiK5Bn3RO3qMK6rKg9nn5oSBhBhoDPEWAcC2itSoXeHRqDMdeineaR6OS0323QrpC%2F8B45se1hhabY%2FulzRjaTcH%2Bl1ZhyxyOgVzwiCIRE1qKvpU1puYPKcz6qT9iu3cGdwnmKqujRcOXMDcSfmknJHtsHLtlqWJC3kyaAdM0hgSekeVTfsQNjTqnOz%2FX1Nxe%2B7BIpuOjF%2Bb391%2BLg5%2FV3%2Fa5ZabLyYgU7Drbt1MZWrc8E3RB2juRCRZWj7%2FiKymRiyrHgbcZi4wlPP7PuKNnvwB6iXVNzYmIj9tXOfcicssqE8Ul9ptcsJvrgpe09HZVDSIYl3HV16KnB93ACH1Zhif%2Fqimb%2FA1KfKWjXBzCVaP%2FBtfUkFl2hhS%2Fl3SFMixup5L9rtecQ49brY9YLZsgf5CLpKDBgV7pEwRM6pqUzyLWwmcqU4ck0PeD6UUZZlqQahwwUQp0uIyVHOFMNpmCOjaEFIc4%2BMskeoX1G275DUn8UAZLghlcXeGBhYAzmhUAyAj9EdlwDtHBYiMOCV1cwGOqUBcm4b7Vg3TJ6iRZYZiuE5lkkhgkkmQFFfebRGK1lXd%2BkMm7YUz50wHxaR09TsEoLZwDxgvYrUqdAgIwWpyunAkabGf%2FcNf5HWt97BTWI0McmXi2LGMsJmFlnuOW20mmqyhRDnOqb7tEHsjnECDWjjBOScN4hNCVoUMUKasmCH7odUFeLXjvHnus317IjMtNC7gfYm0vANyT15hiJKXMuKMZX0FAhf&X-Amz-Signature=b1ac29c6392db07f773571967225c7738575848ef7fd5d3faff0b98fae1691c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

操作方面，我们只需要把对应Index的河流或者湖泊提取出来使用xyzdist()，找到相近的部分，分别标记一个渐变的顶点色，

```c#
float dist = xyzdist(1, @P);
if(dist < ch("mix_dist")){
    float value = fit(dist,ch("mix_dist")/2,ch("mix_dist"),1,0);
    @Cd.r = value;
}
```

最后还是Pack起来CopyTag并输出。



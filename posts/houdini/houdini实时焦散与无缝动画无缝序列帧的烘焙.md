---
title: "Houdini实时焦散与无缝动画无缝序列帧的烘焙"
categories: ["Houdini"]
date: "2023-07-07"
created: "2023-07-07T16:29:00.000Z"
updated: "2023-07-07T16:29:00.000Z"
notion_url: "https://www.notion.so/Houdini-0d1537ad716a4dc58ad7893a79a537be"
database: "Houdini Technical"
source: "notion-sync"
---
这里介绍一下houdini怎么烘焙无缝动画与无缝贴图，这两个无缝就是指时间上无缝循环与空间上的无缝循环。


这里以实时焦散为例子，制作一个焦散的无缝贴图，最后做成序列帧使用。


[%E7%84%A6%E6%95%A3.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/a3fe2b9b-3b8f-444f-8cd4-06cd6a24b174/%E7%84%A6%E6%95%A3.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z45CV3MD%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T061625Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDUbjpBCZ4REjFGCXQSpGN3RGDHtjxpb1xMczu2kAiL1AIgYc4yJHuZBDwWm4z6WLTOBTjzjKN09QPunjFZXc96UTcqiAQIvv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDODt7TW6tbFZBOw06CrcA%2B6imL6PuceU%2Boi%2B6wl90oNuUTJUkDN%2F%2FY8GUaIbRzqC3sqnQO3%2BZOv644hlZWQIDRYKIwYTIu9feb0Rv30WUjIddtI%2F2KOAop3TzlCmJd5jiAmhjLzpmndRJzQ3otl%2BpmKlDyBk3blfaWPO%2BtVc0Bgx38lZy42BuTKP%2B8vzJEEzm5TnKvYoOyzku6t2GsvsO5WrL8eQSaLurZW3Zccp1iQ7cJuiqFnWLUWRJiOnx5eVBObXvRyYy8tOvlF%2Fd%2BVVHOh6AGJW5p%2BlKzBq%2B%2BYwJb2E9CPVoBvQFiPpcHCRJ%2BzKfju8ApYwHQ18wscwiugPEi92uPMtEPvr6WzS5Zg4vTGTKb42tWbf3pJJk%2BstNfnFnVdBl4jdeH%2BYG5WKYllXZ2xF6Zy07aARC5gypIJ9zPQFWjnagbdA0sZySVvsS5zvY%2BITCzLOcTUloqWOmcN%2F08YCQFQxuXk5CFAt9yc4t%2BpWEBvKA4mKjZND59OU7uUPfh%2FN4rfzq9tdG2N3pm%2BWZw1OR20jl0y%2BuB3%2B3xqa7lhSLksK81LT%2B7yNaW1DhqjpaurIsXXdgkfwdfB6h5IDzDIn1S6TQAHn0EG9DR9E9WPv4WhX6oKRNEI2ovjc8cSJql3CqFEhQDSaYKd6MLGc6swGOqUBbfBua3OBks4F9cQVD6Uq%2BKvobukJZsZgTu18PuOFPi3dPsoHNZ7998XlE0UdODjDFbo2wR%2BDy51p06LFgRpcTIHPoYw6bVTTXJL98r1bZeawzOSVtFlL0STiixjhurjaMc0FmuXs2co7A%2FRHqedIGeo7AibF80hmQup1m6PKs7z33q6aEaRDcnsigAtzecdae51qtt4TfEDgdtzNyhr1IraF%2FyHP&X-Amz-Signature=ea91fd6977943133690fb2985325825d7fc0502d19b7ae7292303c93515df532&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


焦散的原理就是水的折射形成的，那么我们只需要在houdini里面把光在水中发生折射打到地面这个过程写出来就好。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/001-008c1ed9.png)


这里我用grid创建了一个水面，在给这个水面给上uv，并且将水面细分一下，这里细分出来的每一个顶点都是我们光线的入射点，所以细分出的顶点数量越密集结果会越好，这里我给的细分为0.05到0.01之间，使用Mountain节点来简单的模拟水面波动(之后可以用ocean那一套)


有了水面之后我们还需要给一个水底，直接用grid创建一个平面当作水底接收光线。等下就可以将水底接收的光线保存下来，保存下来的结果就是焦散啦。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/002-d540c765.png)


接下来便是使用vex来计算焦散来，输入0为水面，输入1为水底，假设光线入射方向为正上方先下（0，-1，0）。使用refract计算入射光线与法线的折射角度，IOR为1/1.33。


得到折射向量之后使用，模拟光线继续走打到水底，我们就直接用intersect函数根据折射方向发射线既可，如果打到水底那么就把当前点位置等于打中位置。


```javascript
float index = ch("IOR");
vector dir = {0,-1,0};
vector p ;
vector uvhit ;

vector rn = refract(dir , normalize(@N), index);
int pr = intersect(1,@P,100*rn,p,uvhit);
if(pr != -1){
    @P = p;
}
```


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/003-836f4d63.png)


之后再按照水底的位置与大小 创建一个一样大小的2D volume，这个volume就是等下我们要传入cop里面做贴图使用。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/004-3185e162.png)


那么怎么把这些点转移到volum上勒，这里我们可以用volume rasterize particles ，嗯顾名思义就是用通过点云来光栅化volume，参数主要有三个，一个是我们需要写到那个属性，这里我们volume创建的属性为density，那么我们便写入density中。下面coverage scale一个是点云粒子强度缩放，particle scale为点云粒子范围强度缩放(这个值就用我们前面水面 remesh的密度就好)。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/005-a41fcd0d.png)


接下来我们便可以将这个2D volume 传入到Cop中输出图片，也可以再传入前对这个volume 做一些 增加对比度呀 模糊之类的自定义操作。


下面先讲无缝贴图的制作，然后再讲无缝动画的制作。


### COP中制作无缝贴图：


有缝与无缝的本质其实就是一段连续的波形突然的变化剧烈，其实栅格化之后只能说离散后结果比较平滑变化不大，而出现有接缝的原因是波形两端值不一样导致两个像素之间跳变。解决方法便是用一段没有接缝的函数波形去替换有跳变的这一段曲线。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/006-c6178372.png)


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/007-49e9ec43.png)


这是一个图像转化为波形大概是这样，Tile 2次


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/008-0fd1b09e.png)


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/009-d9926334.png)


可以看见波形之间明显的跳变。


我们可以在跳变处插入一段连续的波形，当将要产生跳变的时候，我们过渡到没有跳变的波形上。我们还需要定义一个权重W来插值两个波形。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/010-fcbb6b98.png)


最终跳变区域波形将会变为一个平滑的过渡


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/011-0ff77c72.png)


将波形连续起来


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/012-4dd1c888.png)


便从一个跳变的函数变为连续的啦。反应到贴图上：


原贴图平铺两次（原函数两个周期）


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/013-12209ecd.png)


衔接贴图（插值函数，其实就是原函数 offset半个周期既可）


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/014-a20aeec4.png)


权重函数


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/015-abf0d937.png)


然后做一个权重混合（因为blend的0与1输入反了，所以我们勾选一下 Invert Blend Mask翻转一下）


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/016-1322ce41.png)


最后我们在截取一下中间的图像


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/017-f27a9750.png)


在tile试一下，确实没有跳变接缝啦。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/018-52bb47ce.png)


如果 垂直也有接缝的话，可以在垂直做一次混合操作，上面全是原理，实际操作其实很简单，就是当前贴图offset偏移一下，在贴图tile跳变处淡入淡出偏移过后的贴图即可。操作可以简单粗暴随意实现。


### SOP中制作无缝动画：


其实上面讲这些只不过为了让了解无缝的本质，接下来更好的体会知道无缝动画该怎么做，其实动画也遵循上面波形连续的原理。


我们可以使用TimeShift 来偏移我们的 波周期


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/019-5bb458f8.png)


在1到64帧的时间 一个波形的周期为 32->63 1-> 32  ,另一个波的周期为1 ->63 ,


[%E6%97%A0%E7%BC%9D%E5%8A%A8%E7%94%BB.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/bff36743-77e9-46cf-abe5-3fb830f9de97/%E6%97%A0%E7%BC%9D%E5%8A%A8%E7%94%BB.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z45CV3MD%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T061626Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDUbjpBCZ4REjFGCXQSpGN3RGDHtjxpb1xMczu2kAiL1AIgYc4yJHuZBDwWm4z6WLTOBTjzjKN09QPunjFZXc96UTcqiAQIvv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDODt7TW6tbFZBOw06CrcA%2B6imL6PuceU%2Boi%2B6wl90oNuUTJUkDN%2F%2FY8GUaIbRzqC3sqnQO3%2BZOv644hlZWQIDRYKIwYTIu9feb0Rv30WUjIddtI%2F2KOAop3TzlCmJd5jiAmhjLzpmndRJzQ3otl%2BpmKlDyBk3blfaWPO%2BtVc0Bgx38lZy42BuTKP%2B8vzJEEzm5TnKvYoOyzku6t2GsvsO5WrL8eQSaLurZW3Zccp1iQ7cJuiqFnWLUWRJiOnx5eVBObXvRyYy8tOvlF%2Fd%2BVVHOh6AGJW5p%2BlKzBq%2B%2BYwJb2E9CPVoBvQFiPpcHCRJ%2BzKfju8ApYwHQ18wscwiugPEi92uPMtEPvr6WzS5Zg4vTGTKb42tWbf3pJJk%2BstNfnFnVdBl4jdeH%2BYG5WKYllXZ2xF6Zy07aARC5gypIJ9zPQFWjnagbdA0sZySVvsS5zvY%2BITCzLOcTUloqWOmcN%2F08YCQFQxuXk5CFAt9yc4t%2BpWEBvKA4mKjZND59OU7uUPfh%2FN4rfzq9tdG2N3pm%2BWZw1OR20jl0y%2BuB3%2B3xqa7lhSLksK81LT%2B7yNaW1DhqjpaurIsXXdgkfwdfB6h5IDzDIn1S6TQAHn0EG9DR9E9WPv4WhX6oKRNEI2ovjc8cSJql3CqFEhQDSaYKd6MLGc6swGOqUBbfBua3OBks4F9cQVD6Uq%2BKvobukJZsZgTu18PuOFPi3dPsoHNZ7998XlE0UdODjDFbo2wR%2BDy51p06LFgRpcTIHPoYw6bVTTXJL98r1bZeawzOSVtFlL0STiixjhurjaMc0FmuXs2co7A%2FRHqedIGeo7AibF80hmQup1m6PKs7z33q6aEaRDcnsigAtzecdae51qtt4TfEDgdtzNyhr1IraF%2FyHP&X-Amz-Signature=cfbb5da7d584c1e9020d74bfad4b1d72fa864233a886fe29b64bedde3acfcc1d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


一个最简单的设置，基于64帧，这个可以直接用Labs的make_loop节点也行。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/020-035eb329.png)

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


[%E7%84%A6%E6%95%A3.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/a3fe2b9b-3b8f-444f-8cd4-06cd6a24b174/%E7%84%A6%E6%95%A3.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QT6D36AK%2F20260301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260301T061731Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCqQ3urcMZVBh6bcp7I3glFHdmodIXiZm5zhXtHKKudkQIgZEwfbpnxK6HuPt7xZGtFu2YW0X7fT08%2BnZN2brn3E%2Bgq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDMi7gaYaN95LqkUTTCrcA9nzfnJON4CPRM%2FFW6J1Z7QXzwA88oNTuT0kWh9jtQXhw1wlK3KJNDOpHjTnYl5f8xjPcHPpAM%2BUM0oc0zt4z6CUwXtQRYtrnIOHQCvZcUgd%2FkBgrce3kDpiilPQqymDw%2FvJggZR6HwXLgZDJ4aaula3ltJaMAFladLJOyEuSraFbmTKaRb7PrpEzRRF4bEwJicJLhxP0JhUubYOdyvVOaJ52JvfMtJgz2wgG2NHNSKSpQLDAB4Ul2TNzf3eHsa3Xyu%2BZZcvf6oH9ciUswtUhyAnlfAoN9wwHRWsWNtM16ijA5diQWdFUdcrShpaKOI220VeP4fnbqj1FzRbd0Sbn6pTxeV84a5y2w5mVt0JGy9H8T977xYTvlMnr0AHetGjFA1nX4XqImSBq8G4kKQACht2ugfGPZLPH0Qi4iZFNaQ05eCn07HCn%2B534JCx%2BJqxRMbN4aHjvrDjQGf0Ov10kgGxZrGElZr96y8KSqNuqdjSOzKrLY3xoNdjxe1FDjUs3Cb4O8HYtNfbfWzk7ymkVMPcX4gPrAcWfEO5WMEFyqG3iVIZU3DAqsSVJS4WyGcBl1PrePt07ER%2FFw05JsjJOWtYWg4gUmnHqhvYIkz%2B93CBc%2BvoWcKgpRo3LIEuMJHOjs0GOqUBX21Pld5LAwQtNLSZlGAR%2FC7LNgiToERj42rGAmsW%2BCslU7wkINBfTZGrgShTFTYxchs4e5zPZBvH4%2BjNR1cbTVYaJlkJ67bXXoW4Fn55byeSjqgnOo3dnwXmNMAvHhLRkLXh3R%2F3qvXaptfyFt9cYhKql7K%2FD%2FZUoo5On8BzkUktHebrCrMhuFrnBzWFKtsTeArxgGHmDPXjFFNWRyASo7htIxQX&X-Amz-Signature=98b59456929c45bf90612c89dfea10eb5675033d0c1bbe9dd46bdf3aa4f9fc07&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


焦散的原理就是水的折射形成的，那么我们只需要在houdini里面把光在水中发生折射打到地面这个过程写出来就好。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/001-52e6f203.png)


这里我用grid创建了一个水面，在给这个水面给上uv，并且将水面细分一下，这里细分出来的每一个顶点都是我们光线的入射点，所以细分出的顶点数量越密集结果会越好，这里我给的细分为0.05到0.01之间，使用Mountain节点来简单的模拟水面波动(之后可以用ocean那一套)


有了水面之后我们还需要给一个水底，直接用grid创建一个平面当作水底接收光线。等下就可以将水底接收的光线保存下来，保存下来的结果就是焦散啦。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/002-2bcd8f66.png)


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


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/003-278d1b68.png)


之后再按照水底的位置与大小 创建一个一样大小的2D volume，这个volume就是等下我们要传入cop里面做贴图使用。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/004-70c9cb0c.png)


那么怎么把这些点转移到volum上勒，这里我们可以用volume rasterize particles ，嗯顾名思义就是用通过点云来光栅化volume，参数主要有三个，一个是我们需要写到那个属性，这里我们volume创建的属性为density，那么我们便写入density中。下面coverage scale一个是点云粒子强度缩放，particle scale为点云粒子范围强度缩放(这个值就用我们前面水面 remesh的密度就好)。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/005-98d1a7c6.png)


接下来我们便可以将这个2D volume 传入到Cop中输出图片，也可以再传入前对这个volume 做一些 增加对比度呀 模糊之类的自定义操作。


下面先讲无缝贴图的制作，然后再讲无缝动画的制作。


### COP中制作无缝贴图：


有缝与无缝的本质其实就是一段连续的波形突然的变化剧烈，其实栅格化之后只能说离散后结果比较平滑变化不大，而出现有接缝的原因是波形两端值不一样导致两个像素之间跳变。解决方法便是用一段没有接缝的函数波形去替换有跳变的这一段曲线。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/006-fba5b170.png)


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/007-c7200944.png)


这是一个图像转化为波形大概是这样，Tile 2次


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/008-c3d788fd.png)


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/009-5c7df5b3.png)


可以看见波形之间明显的跳变。


我们可以在跳变处插入一段连续的波形，当将要产生跳变的时候，我们过渡到没有跳变的波形上。我们还需要定义一个权重W来插值两个波形。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/010-43e33426.png)


最终跳变区域波形将会变为一个平滑的过渡


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/011-45dd8df6.png)


将波形连续起来


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/012-01659b0e.png)


便从一个跳变的函数变为连续的啦。反应到贴图上：


原贴图平铺两次（原函数两个周期）


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/013-0978fbf8.png)


衔接贴图（插值函数，其实就是原函数 offset半个周期既可）


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/014-e1419fc7.png)


权重函数


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/015-d7f6e699.png)


然后做一个权重混合（因为blend的0与1输入反了，所以我们勾选一下 Invert Blend Mask翻转一下）


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/016-8a68ee55.png)


最后我们在截取一下中间的图像


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/017-daf0fa42.png)


在tile试一下，确实没有跳变接缝啦。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/018-102bc21c.png)


如果 垂直也有接缝的话，可以在垂直做一次混合操作，上面全是原理，实际操作其实很简单，就是当前贴图offset偏移一下，在贴图tile跳变处淡入淡出偏移过后的贴图即可。操作可以简单粗暴随意实现。


### SOP中制作无缝动画：


其实上面讲这些只不过为了让了解无缝的本质，接下来更好的体会知道无缝动画该怎么做，其实动画也遵循上面波形连续的原理。


我们可以使用TimeShift 来偏移我们的 波周期


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/019-85cdb7c3.png)


在1到64帧的时间 一个波形的周期为 32->63 1-> 32  ,另一个波的周期为1 ->63 ,


[%E6%97%A0%E7%BC%9D%E5%8A%A8%E7%94%BB.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/bff36743-77e9-46cf-abe5-3fb830f9de97/%E6%97%A0%E7%BC%9D%E5%8A%A8%E7%94%BB.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QT6D36AK%2F20260301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260301T061731Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCqQ3urcMZVBh6bcp7I3glFHdmodIXiZm5zhXtHKKudkQIgZEwfbpnxK6HuPt7xZGtFu2YW0X7fT08%2BnZN2brn3E%2Bgq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDMi7gaYaN95LqkUTTCrcA9nzfnJON4CPRM%2FFW6J1Z7QXzwA88oNTuT0kWh9jtQXhw1wlK3KJNDOpHjTnYl5f8xjPcHPpAM%2BUM0oc0zt4z6CUwXtQRYtrnIOHQCvZcUgd%2FkBgrce3kDpiilPQqymDw%2FvJggZR6HwXLgZDJ4aaula3ltJaMAFladLJOyEuSraFbmTKaRb7PrpEzRRF4bEwJicJLhxP0JhUubYOdyvVOaJ52JvfMtJgz2wgG2NHNSKSpQLDAB4Ul2TNzf3eHsa3Xyu%2BZZcvf6oH9ciUswtUhyAnlfAoN9wwHRWsWNtM16ijA5diQWdFUdcrShpaKOI220VeP4fnbqj1FzRbd0Sbn6pTxeV84a5y2w5mVt0JGy9H8T977xYTvlMnr0AHetGjFA1nX4XqImSBq8G4kKQACht2ugfGPZLPH0Qi4iZFNaQ05eCn07HCn%2B534JCx%2BJqxRMbN4aHjvrDjQGf0Ov10kgGxZrGElZr96y8KSqNuqdjSOzKrLY3xoNdjxe1FDjUs3Cb4O8HYtNfbfWzk7ymkVMPcX4gPrAcWfEO5WMEFyqG3iVIZU3DAqsSVJS4WyGcBl1PrePt07ER%2FFw05JsjJOWtYWg4gUmnHqhvYIkz%2B93CBc%2BvoWcKgpRo3LIEuMJHOjs0GOqUBX21Pld5LAwQtNLSZlGAR%2FC7LNgiToERj42rGAmsW%2BCslU7wkINBfTZGrgShTFTYxchs4e5zPZBvH4%2BjNR1cbTVYaJlkJ67bXXoW4Fn55byeSjqgnOo3dnwXmNMAvHhLRkLXh3R%2F3qvXaptfyFt9cYhKql7K%2FD%2FZUoo5On8BzkUktHebrCrMhuFrnBzWFKtsTeArxgGHmDPXjFFNWRyASo7htIxQX&X-Amz-Signature=8ac1fb2e463d55a5f4ee534c86e394f58da773b2bde5eabd8cc5010dc2647900&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


一个最简单的设置，基于64帧，这个可以直接用Labs的make_loop节点也行。


![Untitled.png](assets/houdini实时焦散与无缝动画无缝序列帧的烘焙/020-3c4e7ae6.png)

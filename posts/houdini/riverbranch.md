---
title: "RiverBranch "
categories: ["Houdini"]
date: "2023-07-07"
created: "2023-07-07T15:27:00.000Z"
updated: "2023-07-07T15:54:00.000Z"
notion_url: "https://www.notion.so/RiverBranch-cc0f6a28030a4ebf9381da7cef38e7e9"
database: "Houdini Technical"
---

河流支流的重点在于怎么找到 支流河流曲线，因为生成支流这一步是为了让河流更加自然，所以我们曲线生成的方法应该采用自然的规律去生成河流，主要规律便是 水往低处流 。

首先我们的主要输入数据为curve，curver上的每一个点代表着一条支流的源头，使用add节点将curver线段变为点云，使用vex将点云贴合上地形。

```javascript
vector p = @P;
p.y = 0.0;
vector ori = point(1, "P", 0);
float h = volumesample(1, "height", @P);
@P.y = h + ori.y;
```

接下来我们需要循环遍历河流起点，将河流起点 点云转换为河流曲线，主要算法就是给定迭代次数与迭代步长，每次我们都采样地形的梯度(地形需要提前blur处理)，沿着梯度下降方向移动相应步长，每移动一次产生一个新的顶点，添加到路径曲线中。如果路径顶点距离输入的河流曲线比较近那么我们就可以提前退出并把 connected 属性设置为true。

输入1为空，输入2为河流起点点云，输入3为blur过后的地形，输入4为需要吸附的河流曲线

```javascript
int num_steps = 500;
float step = 3.0;
vector cur_p = point(1, "P", 0);
int start_num = addpoint(0, cur_p);
int prim_num = addprim(0, "polyline");
setprimattrib(0, "connected", prim_num, 0);
float start_dist = xyzdist(3, cur_p);
setpointattrib(0, "dist", start_num, start_dist);
addvertex(0, prim_num, start_num);
float min_dist = 10000;

for (int i=0; i<num_steps; i++)
{
    vector gradient = volumegradient(2, "height", cur_p);
    vector normal = normalize({0,1,0} - gradient);
    vector B = cross(normal, {0,1,0});
    vector T = normalize(cross(normal, B));
    float dist = xyzdist(3, cur_p);
    if (min_dist < step && dist > min_dist)
    {
        setprimattrib(0, "connected", prim_num, 1);
        break;
    }
    min_dist = dist;
    cur_p = cur_p + T * step;
    float height = volumesample(2, "height", cur_p);
    cur_p.y = height;
    int pt_num = addpoint(0, cur_p);
    float pt_dist = xyzdist(3, cur_p);
    setpointattrib(0, "dist", pt_num, pt_dist);
    addvertex(0, prim_num, pt_num);
}
```

接下来就是判断connected是否为 true，保留下有链接到附近河流的曲线，之后还得做两步容错操作，就是剔除过短的支流曲线 和 判断支流曲线的源头与末尾附近是否有其他河流的源头或末尾点，这个步是为了防止支流交接处与其他河流交接处相隔太近导致出现错误问题。

之后把得到的支流曲线进行resample一次便可以得到我们河流HDA最终需要的输入曲线。

得到最终支流曲线之后，我们便可以遍历每条曲线生成支流，大致流程如下：

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/ef25dc81-9261-4f2f-84af-681b6b43b376/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QCXUYXUS%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T055015Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4GNKm1l6QuaD1lq%2FrvbzgM%2BfJw30u1rAr0o70h4d%2BwAIgMgmutW4lAYp%2Bspm7u%2FL%2BSDRabbwc2r76xxTMXgkWe3Yq%2FwMIXhAAGgw2Mzc0MjMxODM4MDUiDF4BRBttF3TxMcN7cyrcA5Exjl6ptxJhu0fZY%2Fviamn5MhdK5Qirs0qhuLcQ3gFZf5Bw0M7SxkkQcgfWiFsCMfl4L36spzRWaRHc6gNK3u3z7VcHfX9AAPOt6T2cziQVdkJOdX992%2FwMqmuPZB4vENHKrtyTo8t5lhSIo4lRLJTYsTVa9CCEPH7HVFLIxDivzcci7Z%2FtQ8dsja0ELZVPA9E%2FrOWDu%2Bn9FKal8VY3ZgNoQSw0P1fM%2FPEQ%2BdsVNsDE6hgF9CRascZApjo%2BOnhXJHVpQ2cwwTMYLH3acptimkQ%2F0YxqYaTvAAUbgr6Ph3mo%2FQF3JzcRswJDatc%2BVRqbdTjxcSHpdRrGVlfP1iPtZFrqYgwF3OZUttES1SVAtbPbTagFb%2BG8%2BOSsey306uOUIgUrcXBS%2FYW9CUW%2FL4t7hS31gxzHKKpfEA%2BpKS354AOGhebmUHGYoEEmYf%2FML5CkS7Ry%2BFCAsU%2F3%2FBD9%2Fs7mcop6trZc5615B15dyHclCyQ4LEA3BqfYcH9mWcHtO4pJ%2FqmQLN8EfhKfCu5r1xciyT0ihF7%2BAX6SVz3GEJsKxY%2Bwhsan9%2B0EWVZ9vlLfk%2Fu8qhqouQedRJzxUu2F0mfeux2HIg4Qbv8cvFd%2BRZIKPoLI%2Bf9xEILkj1i7%2Fz0zMO2V1cwGOqUBLJt8zyK45UHkZPjsjugA%2Fu6NTY%2FuRza7ynftKsWdJM4RLrQgIyFk%2Fj70CN0gf8FsPyCJeYPCO%2Bjt7vuhRUFlN8F4d0JNiD%2B9huQrIJbk6qd38jnIkRvFHjHDVgF9zRGgi3JWCOcPnH%2BsKZf%2Fb9zmuMTkJE6fpNhXfSGpt7eK8AyTJr18vFI%2FvhtgKx4tiamANdbfy0LIE2bbV1QKKrx0gVJxyrOt&X-Amz-Signature=43fa6864a6b0c3aeac53f5d30608acc124d2721e70e1fd681551f02569f84ef1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

这只是普通版本，如果需要更加不错的效果的话，我们还需要将支流循环中的 water_river HDA分为大中小三个不同参数hda 或者 将water_river HDA的参数与支流曲线绑定在 一定的范围内随机，根据当前支流曲线的状态 比如 长度、坡度、等等。来动态的选择使用哪种类型的HDA，再将结果输出，

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/27658602-6aef-4f4a-8b23-59ac0ab9518e/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QCXUYXUS%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T055015Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4GNKm1l6QuaD1lq%2FrvbzgM%2BfJw30u1rAr0o70h4d%2BwAIgMgmutW4lAYp%2Bspm7u%2FL%2BSDRabbwc2r76xxTMXgkWe3Yq%2FwMIXhAAGgw2Mzc0MjMxODM4MDUiDF4BRBttF3TxMcN7cyrcA5Exjl6ptxJhu0fZY%2Fviamn5MhdK5Qirs0qhuLcQ3gFZf5Bw0M7SxkkQcgfWiFsCMfl4L36spzRWaRHc6gNK3u3z7VcHfX9AAPOt6T2cziQVdkJOdX992%2FwMqmuPZB4vENHKrtyTo8t5lhSIo4lRLJTYsTVa9CCEPH7HVFLIxDivzcci7Z%2FtQ8dsja0ELZVPA9E%2FrOWDu%2Bn9FKal8VY3ZgNoQSw0P1fM%2FPEQ%2BdsVNsDE6hgF9CRascZApjo%2BOnhXJHVpQ2cwwTMYLH3acptimkQ%2F0YxqYaTvAAUbgr6Ph3mo%2FQF3JzcRswJDatc%2BVRqbdTjxcSHpdRrGVlfP1iPtZFrqYgwF3OZUttES1SVAtbPbTagFb%2BG8%2BOSsey306uOUIgUrcXBS%2FYW9CUW%2FL4t7hS31gxzHKKpfEA%2BpKS354AOGhebmUHGYoEEmYf%2FML5CkS7Ry%2BFCAsU%2F3%2FBD9%2Fs7mcop6trZc5615B15dyHclCyQ4LEA3BqfYcH9mWcHtO4pJ%2FqmQLN8EfhKfCu5r1xciyT0ihF7%2BAX6SVz3GEJsKxY%2Bwhsan9%2B0EWVZ9vlLfk%2Fu8qhqouQedRJzxUu2F0mfeux2HIg4Qbv8cvFd%2BRZIKPoLI%2Bf9xEILkj1i7%2Fz0zMO2V1cwGOqUBLJt8zyK45UHkZPjsjugA%2Fu6NTY%2FuRza7ynftKsWdJM4RLrQgIyFk%2Fj70CN0gf8FsPyCJeYPCO%2Bjt7vuhRUFlN8F4d0JNiD%2B9huQrIJbk6qd38jnIkRvFHjHDVgF9zRGgi3JWCOcPnH%2BsKZf%2Fb9zmuMTkJE6fpNhXfSGpt7eK8AyTJr18vFI%2FvhtgKx4tiamANdbfy0LIE2bbV1QKKrx0gVJxyrOt&X-Amz-Signature=86a5dcf4f0b5055a45d8e7ffa58a13732c0c5195b63f59bda47c69d35dec7d77&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)



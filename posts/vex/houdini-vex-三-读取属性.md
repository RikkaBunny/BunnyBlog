---
title: "Houdini VEX(三)读取属性"
categories: ["VEX"]
date: "2023-07-07"
created: "2023-07-07T14:06:00.000Z"
updated: "2023-07-07T14:34:00.000Z"
notion_url: "https://www.notion.so/Houdini-VEX-73baedf67b1046798f03e7b4bb617ce1"
database: "Houdini Notes"
source: "notion-sync"
---
一、使用@符号

1. 例子：

`float y = @P.y;//x,y,z
等价于
float y = @P.g;//r,g,b
等价于
float y = @P[1];//0,1,2`


二、使用@opinput?_

1. 例子：

`float r = @opinput1_Cd.y;//获取第二个输入端 相同序号的点 的Cd属性，常用属性不用标明属性类型

float f = v@opinput1_foo.y;//Houdini不认识的属性必须标明属性类型`


三、使用函数

1. 例子：

`vector color = point(1,"Cd",0);
color = prim(1,"Cd",0);
color = vertex(1,"Cd",0);
color = detail(1,"Cd");
//具体用法参考帮助文档VEX Functions`

1. 查看一个节点存在哪些属性，可以通过attribute vop节点查看：这些就是存在的全局属性，可以通过@+红色框选的这些全局属性获取这些本身存在的属性

    ![9148742-944ee2837e2be598.webp](assets/houdini-vex-三-读取属性/001-21f62db1.webp)


    1）例子：


    ![9148742-c33fdda8dfa29972.webp](assets/houdini-vex-三-读取属性/002-9779533f.webp)


四、特别的：体积，不同于位置点、顶点、面的读取属性

1. 读取方式：@+体积名称，来读取体素值
1）例子：

    ![9148742-58e27290ed32864b.webp](assets/houdini-vex-三-读取属性/003-33cdef8f.webp)

2. 测试：
1）新建一个box节点，选中按i进入，连上isooffset节点，修改属性：name改为density，uniform sampling divs改为5：

    ![9148742-8592f7c7464a6fc9.webp](assets/houdini-vex-三-读取属性/004-6bbec98c.webp)


    



    2）在isooffset节点上长按鼠标中键：可以查看到是刚刚采样细分的2次方


    ![9148742-ebe7e818882fa223.webp](assets/houdini-vex-三-读取属性/005-96ffff43.webp)


3）连上volum wrangle节点进行vex代码


![9148742-dffaa9d4841dfe96.webp](assets/houdini-vex-三-读取属性/006-2e180e80.webp)


五、注意事项


![9148742-472630fdae761279.webp](assets/houdini-vex-三-读取属性/007-bb31cf5c.webp)

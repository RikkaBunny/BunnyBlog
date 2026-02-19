
基于物理的渲染（PBR）已经是很成熟的东西了，两大商业引擎（Unity，虚幻）里很早之前就有了完善的实现，使用OpenGL实现pbr有完备的教程，链接如下：


[LearnOpenGL - Theory](https://link.zhihu.com/?target=https%3A%2F%2Flearnopengl.com%2FPBR%2FTheory)


[learnopengl.com/PBR/Theory](https://link.zhihu.com/?target=https%3A%2F%2Flearnopengl.com%2FPBR%2FTheory)


![v2-e47e6c1ed42afd424e25c03b7e98c74a_180x120.jpg](https://pic3.zhimg.com/v2-e47e6c1ed42afd424e25c03b7e98c74a_180x120.jpg)


从我学习中查找的资料来看，现有的PBR教程要么只讲原理不讲实现，要么是照着上面的教程使用OpenGL或dx实现的。虽说想学好图形学OpenGL或dx这一步是逃不掉的，但毕竟这两者的学习成本太高，而且使用它们搭起一个能看到渲染结果的框架所花的精力可能比学习pbr本身还要多。同时，PBR作为一种渲染方法，我也没看到什么文章介绍其中的每个步骤能使被渲染的图像达到什么样的效果。这些给我的学习带来了一定的障碍。


在这篇文章中我将使用商业引擎中最好上手的Unity，通过手写包含直接光照和间接光照（ibl）的PBR
 shader的方式得到和Unity自带的standard 
shader相近的光照效果。文中将结合原理，以尽量简洁的实现，接地气的一步步讲解PBR BRDF（双向反射分布函数）方程各部分的实现和具体效果。


对于本文的读者，有几点我必须提一下：


1. 本文在讲解时会尽量淡化数学公式的作用，遇到公式只要领会精神就行，不用担心因为数学不好而看不懂这篇文章。要是有人想看数学演算过程的话可以去看《Real-Time Rendering》这本书，里面讲的很详细。


2. 本文追求以尽量简单而容易理解的方式实现PBR，仅处理了单光源的情况，贴图上也只添加了MainTexture用于做颜色上的Debug。其他各种功能性贴图的写法不在本文考虑范围内（添加的方法和在非PBR shader中差不多）。


3. Unity standard shader使用的光照模型已经不是传统的BRDF，且针对运行环境存在大量的优化措施。本人才疏学浅无力复现standard shader，只能尽量在简单的情况下使渲染结果和standard shader相近。


本文实现的PBR shader如下：


[Shader的Github链接](https://link.zhihu.com/?target=https%3A%2F%2Fgithub.com%2FArcob%2FUnityPbrRendering%2Fblob%2Fmaster%2FAssets%2FShaders%2FArcHandWritePbr.shader)


那我们开始吧。


## 设置Unity


项目用的Unity版本是2018.3.0f2，你用别的版本区别也不会很大。需要改下以下几项设置：

- Editor>Project Setting>Player>Other Settings中将Color Space改成Linear
- Windows>Rendering>Lighting Setting最下面的Auto Generate关掉，如果已经有烘焙好的光照贴图就删掉。这一点主要是防止光照贴图对渲染效果产生影响。

## BRDF方程


先稍微讲下PBR的原理，PBR的本质就是如下的一个BRDF方程：


![v2-3491b7ecd5be7defa078cd2dc9c14aa1_720w.png](https://pic2.zhimg.com/80/v2-3491b7ecd5be7defa078cd2dc9c14aa1_720w.png)


这个方程看起来怪吓人的，把它翻译下是这样的：


![v2-d3dbb607a86eca67f365353ad6b8fcc4_720w.png](https://pic1.zhimg.com/80/v2-d3dbb607a86eca67f365353ad6b8fcc4_720w.png)


对于BRDF方程的解释到处都是，我在这就不复读了，贴一个讲的比较好的：


[理论 - LearnOpenGL CN](https://link.zhihu.com/?target=https%3A%2F%2Flearnopengl-cn.github.io%2F07%2520PBR%2F01%2520Theory%2F)


[learnopengl-cn.github.io/07%20PBR/01%20Theory/](https://link.zhihu.com/?target=https%3A%2F%2Flearnopengl-cn.github.io%2F07%2520PBR%2F01%2520Theory%2F)


![v2-cc9f98488da2d477be10b1b3de06a3c0_180x120.jpg](https://pic1.zhimg.com/v2-cc9f98488da2d477be10b1b3de06a3c0_180x120.jpg)


方程括号里的前半部分为漫反射部分，后半部分为镜面反射部分。而这个方程又同时代表了直接光照和间接光照（ibl）。所以排列组合下就出现了四个部分：直接光漫反射，直接光镜面反射，间接光漫反射，间接光镜面反射。PBR渲染效果就是这四个部分的加和，在下面的教程中将依次实现这四部分以得到和standard
 shader相同的渲染效果。


## shader骨架与参数


先搭建下我们手写PBR shader 的骨架，骨架的代码如下：


`Shader "Arc/ArcHandWritePbrExp"
{
	Properties
	{
		_MainTex("Texture", 2D) = "white" {}
		_Tint("Tint", Color) = (1 ,1 ,1 ,1)
		[Gamma] _Metallic("Metallic", Range(0, 1)) = 0 //金属度要经过伽马校正
		_Smoothness("Smoothness", Range(0, 1)) = 0.5
		_LUT("LUT", 2D) = "white" {}
	}

		SubShader
	{
		Tags { "RenderType" = "Opaque" }
		LOD 100

		Pass
		{
			Tags {
				"LightMode" = "ForwardBase"
			}
			CGPROGRAM


			#pragma target 3.0

			#pragma vertex vert
			#pragma fragment frag

			#include "UnityStandardBRDF.cginc" 

			struct appdata
			{
				float4 vertex : POSITION;
				float3 normal : NORMAL;
				float2 uv : TEXCOORD0;
			};

			struct v2f
			{
				float4 vertex : SV_POSITION;
				float2 uv : TEXCOORD0;
				float3 normal : TEXCOORD1;
				float3 worldPos : TEXCOORD2;
			};

			float4 _Tint;
			float _Metallic;
			float _Smoothness;
			sampler2D _MainTex;
			float4 _MainTex_ST;
			sampler2D _LUT;

			v2f vert(appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.worldPos = mul(unity_ObjectToWorld, v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				o.normal = UnityObjectToWorldNormal(v.normal);
				o.normal = normalize(o.normal);
				return o;
			}

			fixed4 frag(v2f i) : SV_Target
			{
				float3 diffColor = 0;
				float3 specColor = 0;
				float3 DirectLightResult = diffColor + specColor;

				float3 iblDiffuseResult = 0;
				float3 iblSpecularResult = 0;
				float3 IndirectResult = iblDiffuseResult + iblSpecularResult;

				float4 result = float4(DirectLightResult + IndirectResult, 1);

				return result;
			}

			ENDCG
		}
	}
}`


要传入的参数只有五个，_MainTex是物体的贴图，_Tint是贴图要乘上的颜色，_Metallic是金属度，_Smoothness是材质的光滑度，_LUT是一张作为查找表的贴图，具体作用会在后面讲到。


这里稍微讲下金属度和光滑度的意义（感谢迪士尼的前辈把PBR的复杂属性融合到这仅有的两个参数里）。金属度是一个0到1范围内的浮点数，表示被渲染物的表面材质是不是金属，0表示非金属，1表示金属，0和1之间的值的作用是表现诸如沾有沙子的金属表面之类的复杂材质。光滑度也是一个0到1范围内的浮点数，表示被渲染物表面材质的光滑程度，0表示光滑，1表示粗糙。这两个参数看似有些重复，其实是完全剥离开的，比如存在粗糙的金属（磨砂钢或是带锈迹的栏杆）和光滑的非金属（橡皮擦、塑料台球等）。使用这两个参数可以表示大部分物体的表面特征。


可以看到在参数中的金属度前面有一个[Gamma]。这是因为金属度这个值是用于伽马空间的，而即使你开了Linear模式Unity也不会对一个滑动条做伽马校正。在这里加[Gamma]就是告诉Unity这个值也要和贴图一样在使用前从伽马空间转换到线性空间中。如果不加[Gamma]的话在金属度为0和1中间值的时候渲染效果会和Standard
 Shader不一样。


骨架中其他代码都很容易理解，作用基本是只是将各种数据传递到片元着色器，在这里我就不细讲了。稍微要提一下的是我引用了Unity自带的UnityStandardBRDF.cginc这个文件，这是Unity
 PBR的核心文件，我本文中shader也参考了其中的实现（Unity的PBR实现中有一些trick，不看源码很难把效果调整到和standard
 shader相近）。想看这个shader的可以去Unity官网下载内置shader。


吐个槽，Unity的内置shader源码实在是难读，无数个宏和函数调用根本不知道去哪里找。要是哪位好心人有一键Find Reference的vscode插件或vs插件麻烦给我说下，在下先行谢过。。。


## 效果比对场景搭建


接下来做一些用于效果比对的工作（如果只是想看shader怎么写可以跳过这一步）。


准备这样一个shader：


`Shader "Arc/MyFirstPbr"
{
    Properties
    {
	_Tint ("Tint", Color) = (1 ,1 ,1 ,1)
        _MainTex ("Texture", 2D) = "white" {}
	[Gamma] _Metallic("Metallic", Range(0, 1)) = 0
	_Smoothness("Smoothness", Range(0, 1)) = 0.5
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 100

        Pass
        {
		Tags {
			"LightMode" = "ForwardBase"
		}
            CGPROGRAM

	    #pragma target 3.0

            #pragma vertex vert
            #pragma fragment frag

	    #include "UnityPBSLighting.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
		float3 normal : NORMAL;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float4 vertex : SV_POSITION;
		float2 uv : TEXCOORD0;
		float3 normal : TEXCOORD1;
		float3 worldPos : TEXCOORD2;
            };

	    float4 _Tint;
	    float _Metallic;
	    float _Smoothness;
            sampler2D _MainTex;
            float4 _MainTex_ST;

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
		o.worldPos = mul(unity_ObjectToWorld, v.vertex);
                o.uv = TRANSFORM_TEX(v.uv, _MainTex);
		o.normal = UnityObjectToWorldNormal(v.normal);
		o.normal = normalize(o.normal);
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
		i.normal = normalize(i.normal);
		float3 lightDir = _WorldSpaceLightPos0.xyz;
		float3 viewDir = normalize(_WorldSpaceCameraPos - i.worldPos);
		float3 lightColor = _LightColor0.rgb;

		float3 specularTint;
		float oneMinusReflectivity;
		float3 albedo = tex2D(_MainTex, i.uv).rgb * _Tint.rgb;
		albedo = DiffuseAndSpecularFromMetallic( // 从金属度生成漫反射颜色，镜面反射颜色等
			albedo, _Metallic, specularTint, oneMinusReflectivity
		);
				
		UnityLight light;
		light.color = lightColor;
		light.dir = lightDir;
		light.ndotl = DotClamped(i.normal, lightDir);
		UnityIndirect indirectLight;
		indirectLight.diffuse = 0;
		indirectLight.specular = 0;

		return UNITY_BRDF_PBS( //生成直接光pbr结果
			albedo, specularTint,
			oneMinusReflectivity, _Smoothness,
			i.normal, viewDir,
			light, indirectLight
		);

            }
            ENDCG
        }
    }
}`


这个shader使用Unity内置的函数DiffuseAndSpecularFromMetallic和UNITY_BRDF_PBS宏实现直接光PBR效果，即standard shader里的直接光部分。写这个shader是为了进行PBR直接光照效果的比对。


建立一个用于效果比对的场景。在场景中排布4×3的12个球体，最上面一排四个球贴上装载有上面写的直接光PBR
 shader的材质，中间一排贴装载有上面的Shader骨架的材质，最下面一排贴装载有standard 
shader的材质（你可能需要建12个Material来完成这一步）。每个球体使用同一张黄色贴图并将颜色设为#28FFFF，贴图在这：


[贴图的Github链接](https://link.zhihu.com/?target=https%3A%2F%2Fgithub.com%2FArcob%2FUnityPbrRendering%2Fblob%2Fmaster%2FAssets%2FTextures%2F11_lambert1_AlbedoTransparency.png)


其实这里设置的贴图和颜色只是为了Debug。。。你想设什么都行。


将场景中的摄像机投影模式设置为正交方便看结果。根据图中的参数更改每个球的金属度和粗糙度，改完后会得到以下结果：


![v2-e73967346f4186de6e768ea84de06e89_720w.jpg](https://pic2.zhimg.com/80/v2-e73967346f4186de6e768ea84de06e89_720w.jpg)


上面一排是pbr直接光效果，下面一排就是我们最终要实现的standard shader效果。中间一排由于用的是我们之前的shader骨架所以还是黑的。


## shader编写


准备工作结束，现在正式开始写shader。先把后面会用到的一些数据算好，算好后的片元着色器长这样：


`fixed4 frag(v2f i) : SV_Target
{
	i.normal = normalize(i.normal);
	float3 lightDir = normalize(_WorldSpaceLightPos0.xyz);
	float3 viewDir = normalize(_WorldSpaceCameraPos.xyz - i.worldPos.xyz);
	float3 lightColor = _LightColor0.rgb;
	float3 halfVector = normalize(lightDir + viewDir);  //半角向量

	float perceptualRoughness = 1 - _Smoothness;

	float roughness = perceptualRoughness * perceptualRoughness;
	float squareRoughness = roughness * roughness;

	float nl = max(saturate(dot(i.normal, lightDir)), 0.000001);//防止除0
	float nv = max(saturate(dot(i.normal, viewDir)), 0.000001);
	float vh = max(saturate(dot(viewDir, halfVector)), 0.000001);
	float lh = max(saturate(dot(lightDir, halfVector)), 0.000001);
	float nh = max(saturate(dot(i.normal, halfVector)), 0.000001);

	float3 diffColor = 0;
	float3 specColor = 0;
	float3 DirectLightResult = diffColor + specColor;

	float3 iblDiffuseResult = 0;
	float3 iblSpecularResult = 0;
	float3 IndirectResult = iblDiffuseResult + iblSpecularResult;

	float4 result = float4(DirectLightResult + IndirectResult, 1);

	return result;
}`


lightDir是光照的方向，viewDir是视角方向，lightColor是光源的颜色，这三者都直接使用Unity的内置参数计算出。halfVector是Blinn-phong光照模型中的半角向量，讲Blinn-phong模型的文章大多把这个向量作为一个经验值，但其实半角向量是有理论依据的，具体的在下面会讲到。


接下来是粗糙度一家。perceptualRoughness是一次方的粗糙度，即1-光滑度参数。roughness是粗糙度的二次方，squareRoughness是粗糙度的四次方。他们在后面的计算中都会被用到。


接着是向量点积一家，顾名思义就是各种向量互相点积。值得注意的是这些向量都要被Clamp一下防止除0的情况出现。


该算的也算好了，让我们开始依次写掉BRDF的四个部分。


## 直接光漫反射


首先写直接光的漫反射部分，这部分在BRDF方程中长这样：


![v2-52100d7ee0db7da7c4cab0e9cb3bbe0a_720w.png](https://pic3.zhimg.com/80/v2-52100d7ee0db7da7c4cab0e9cb3bbe0a_720w.png)


这其实就是个兰伯特光照模型，不同之处是下面除了个PI，这个PI的作用是保证能量守恒，数学推导可以去看《Real-time Rendering》我在这里就不讲了。这部分写好后长这样：


`float3 Albedo = _Tint * tex2D(_MainTex, i.uv);
float3 diffColor = kd * Albedo * lightColor * nl;`


就两行，第一行是贴图采样并乘上颜色得到Albedo，第二行是乘上光源颜色和nl得到结果，乘的kd是一个保证能量守恒的系数，我们先不管它。注意，我们这里又没有除PI，这不是我忘了而是为了向Unity妥协，Unity的UnityStandardBRDF.cginc中有这么一段注释：


`// HACK: theoretically we should divide diffuseTerm by Pi and not multiply specularTerm!
// BUT 1) that will make shader look significantly darker than Legacy ones
// and 2) on engine side "Non-important" lights have to be divided by Pi too in cases when they are injected into ambient SH`


也就是说Unity为了1. 保证shader看起来和Legacy版本差不多亮 2. 避免在ibl部分对非重要光源做特殊处理 在这里没有除PI。我们为了达到和Unity相近的渲染效果也不去除这个PI。改完后的这部分长这样：


`float nh = max(saturate(dot(i.normal, halfVector)), 0.000001);

//添加的代码从这开始
float kd = 1;
float3 Albedo = _Tint * tex2D(_MainTex, i.uv);
float3 diffColor = kd * Albedo * lightColor * nl;
//添加的代码到这里结束

float3 specColor = 0;
float3 DirectLightResult = diffColor + specColor;`


此时我们的中间一排从黑色变成了下图的这个样子：


![v2-33d13920f39855b3572353076f92edbf_720w.jpg](https://pic4.zhimg.com/80/v2-33d13920f39855b3572353076f92edbf_720w.jpg)


简直是教科书般的兰伯特光照效果。。。于是我们完成了四个部分中最简单的第一部分，下面进入直接光镜面反射部分。


## 直接光镜面反射


直接光镜面反射部分的方程长这样：


![v2-eb8ce0142e97c8357d04c944523f802a_720w.jpg](https://pic3.zhimg.com/80/v2-eb8ce0142e97c8357d04c944523f802a_720w.jpg)


分母是4×nv×nl，这是个积分积出来的配平系数，要看推导过程的继续找《 Real-time Rendering》，我们在这直接拿着用 。关键在于分子上的DFG三个值。


D是Normal
 Distribution 
Function，应该翻译成法线分布函数，这是个统计学的函数，它描述的是在受到表面粗糙度的影响下，取向方向与中间向量一致的微平面的数量。换句话说，比如假设给定向量h，如果我们的微平面中有35%与向量h取向一致，则法线分布函数将会返回0.35。常用的公式如下：


![v2-216b55173e30034240093598ef325a7c_720w.jpg](https://pic1.zhimg.com/80/v2-216b55173e30034240093598ef325a7c_720w.jpg)


这个式子被称为Trowbridge-Reitz GGX，其中的h为半角向量，n为法线，


是表面的粗糙度。这里的粗糙度Unity用的是（1-smoothness）的平方，即为代码中的roughness。除以PI也是为了保证能量守恒。下面我们在代码里计算这个值：


`float3 Albedo = _Tint * tex2D(_MainTex, i.uv);

//添加的代码从这开始
float lerpSquareRoughness = pow(lerp(0.002, 1, roughness), 2);//Unity把roughness lerp到了0.002
float D = lerpSquareRoughness / (pow((pow(nh, 2) * (lerpSquareRoughness - 1) + 1), 2) * UNITY_PI);
//添加的代码到这里结束

float3 diffColor = kd * Albedo * lightColor * nl;`


按照上文的计算roughness已经是（1-smoothness）的平方了，在这里直接用。值得注意的是这里将roughness
 
clamp到了0.002到1之间，这也是Unity的做法，的目的是保证在smoothness为0表面完全光滑时也会留有一点点高光。完成这一步后我们输出D来看看是什么样的效果：


![v2-8f5e0e59ca507686c3bdea6cbdbebd8f_720w.jpg](https://pic4.zhimg.com/80/v2-8f5e0e59ca507686c3bdea6cbdbebd8f_720w.jpg)


可见在smoothness为0的时候整个球面的D值是都1/PI也就是灰的，在smoothness为1的时候几乎全黑的球面上留下了一个高光的亮点，如果把smoothness从1向0调整这个亮点会不断变大变暗最后覆盖整个球。可以看到这和高光反射的效果很相似，这个D的值也正是高光亮斑效果的来源。（如果没有之前将smoothness
 clamp到0.002到1之间的过程，在smoothness为1的时候球面上两点会消失）


接下来看G，G被称为几何函数，描述的是微平面间相互遮蔽的比率，如图（图片嫖自learn opengl）：


![v2-21d3cd65cead5b819f03b699c59a6cfd_720w.jpg](https://pic2.zhimg.com/80/v2-21d3cd65cead5b819f03b699c59a6cfd_720w.jpg)


这种遮蔽会消耗掉光的能量导致表面变暗，计算方法如下：


![v2-8e20524346e9ec0c1175210da6f4aab0_720w.jpg](https://pic1.zhimg.com/80/v2-8e20524346e9ec0c1175210da6f4aab0_720w.jpg)


之所以要乘两遍是因为光线在入射时会进行一次以光线方向l为参数的遮蔽，出射时会进行一次以视线方向v为参数的遮蔽，二者乘起来才是完整的G。关于k的计算，直接光照和间接光照时的k都在逼近二分之一，只不过直接光照时这个值最小为八分之一而不是0。这是为了保证在表面绝对光滑时也会吸收一部分光线，毕竟完全不吸收光线的物体在现实中不存在。这部分的代码如下：


`float D = lerpSquareRoughness / (pow((pow(nh, 2) * (lerpSquareRoughness - 1) + 1), 2) * UNITY_PI);

//添加的代码从这开始
float kInDirectLight = pow(squareRoughness + 1, 2) / 8;
float kInIBL = pow(squareRoughness, 2) / 8;
float GLeft = nl / lerp(nl, 1, kInDirectLight);
float GRight = nv / lerp(nv, 1, kInDirectLight);
float G = GLeft * GRight;
//添加的代码到这里结束

float3 diffColor = kd * Albedo * lightColor * nl;`


输出G看效果前需要先把相机从正交模式调回透视模式否则会因为正交相机神奇的视角方向导致结果出错。G的结果如下：


![v2-5ef99666448b90abcadeb302d9a7d71d_720w.jpg](https://pic2.zhimg.com/80/v2-5ef99666448b90abcadeb302d9a7d71d_720w.jpg)


从结果可以看出，在光滑度为0的时候由于吸收率高所以整个球会灰一些。在光线照不到的地方和照得到的地方产生了明显的明暗分界，其实在视线看得到和看不到的地方也有这么一条分界线只是摄像机看不到背面（视线导致的分界线在正交相机下是能看到的）。


接下来是F，F是大家耳熟能详的菲涅尔系数，对菲涅尔系数的介绍我直接照抄OpenGL文档了：


菲涅尔（发音为Freh-nel）方程描述的是被反射的光线对比光线被折射的部分所占的比率，这个比率会随着我们观察的角度不同而不同。当光线碰撞到一个表面的时候，菲涅尔方程会根据观察角度告诉我们被反射的光线所占的百分比。利用这个反射比率和能量守恒原则，我们可以直接得出光线被折射的部分以及光线剩余的能量。


当垂直观察的时候，任何物体或者材质表面都有一个基础反射率(Base Reflectivity)，但是如果以一定的角度往平面上看的时候[所有](https://link.zhihu.com/?target=http%3A%2F%2Ffilmicgames.com%2Farchives%2F557)反光都会变得明显起来。你可以自己尝试一下，用垂直的视角观察你自己的木制/金属桌面，此时一定只有最基本的反射性。但是如果你从近乎90度（译注：应该是指和法线的夹角）的角度观察的话反光就会变得明显的多。如果从理想的90度视角观察，所有的平面理论上来说都能完全的反射光线。这种现象因菲涅尔而闻名，并体现在了菲涅尔方程之中。


菲涅尔函数的实际实现和理论有一定的不同，下面说说不同在什么地方：


首先，真正的菲涅尔方程超级复杂，不太具有实用价值。实际实现时用的是菲涅尔方程的近似版本，有两种：


![v2-e90acd044cc38a91824aa91643aa5999_720w.png](https://pic2.zhimg.com/80/v2-e90acd044cc38a91824aa91643aa5999_720w.png)


![v2-07e05c89765120b812df5136ff1dfc84_720w.png](https://pic1.zhimg.com/80/v2-07e05c89765120b812df5136ff1dfc84_720w.png)


上面一种是Fresnel-Schlick近似法求得的常用版本，下面一种是虚幻引擎用的拟合版本，后面一种由于exp2函数的高效率算起来会快一些。


其次，方程中的F0理论上是平面的基础反射率，但实际实现时需要考虑另一个情况，即菲涅尔方程只对非金属有效，在表面为金属时需要用到跟金属表面颜色相关的另一个方程。为了能够用同一个材质表示金属和非金属的不同属性，将材料的金属性参数整合到F0的计算中，实际F0计算的代码如下：


`float3 F0 = lerp(unity_ColorSpaceDielectricSpec.rgb, Albedo, _Metallic);`


unity_ColorSpaceDielectricSpec.rgb是一个常数，大致是float3(0.04,
 0.04, 
0.04)这样的东西，F0的计算就是在这个常数和表面颜色之间根据材质的金属性进行插值。在材料为金属时F0为表面颜色，为非金属时F0是很接近黑色的一个值。做了这一步后F0按理说已经不是基础反射率也不应该叫F0了，Unity把这玩意叫SpecColor，但我感觉SpecColor这个名称比F0更容易产生混淆。。。所以我这里还是把变量名命名为F0.


最后，有些地方的菲涅尔方程是这样的：


![v2-2fbc99fa34c4ec7fb2c9e8f3fae6382e_720w.png](https://pic3.zhimg.com/80/v2-2fbc99fa34c4ec7fb2c9e8f3fae6382e_720w.png)


在这个方程里使用的是nv而不是vh。这一点困惑了我很久，最后才理解这nv和vh的冲突其实是宏观和微观的冲突。


使用nv的菲涅尔方程是宏观的，即菲涅尔方程确实由表面法线和视角方向求得。但在这里我们处理的不是宏观平面而是由法线分布函数D筛选出的法线为h的微平面，故这里实际用的应该是vh。也可以这么理解，微观上半角向量h就是微平面的法线，这也就是说我们熟悉的Blinn-Phong光照模型本质上是一个BRDF。。。


这里最大的坑在于如果你输出由使用nv的菲涅尔方程得到的结果，你会发现它实在是太符合菲涅尔效应的物理特性，而使用vh的效果很不明显。但实际上使用nv得到的效果和真实菲涅尔效应完全相反，边缘会反而比中间暗。所以在这里大胆使用vh就好。Unity在这里用的是lh，这是一种对GGX
 shader渲染效果的优化方法，感兴趣的可以看看，链接如下：


[Optimizing GGX Shaders with dot(L,H)](https://link.zhihu.com/?target=http%3A%2F%2Ffilmicworlds.com%2Fblog%2Foptimizing-ggx-shaders-with-dotlh%2F)


[filmicworlds.com/blog/optimizing-ggx-shaders-with-dotlh/](https://link.zhihu.com/?target=http%3A%2F%2Ffilmicworlds.com%2Fblog%2Foptimizing-ggx-shaders-with-dotlh%2F)


![v2-369bc050ab7b0f36eb8597d67358638a_180x120.jpg](https://pic3.zhimg.com/v2-369bc050ab7b0f36eb8597d67358638a_180x120.jpg)


计算F的实际代码如下：


`float G = GLeft * GRight;

//添加的代码从这开始
float3 F0 = lerp(unity_ColorSpaceDielectricSpec.rgb, Albedo, _Metallic);
float3 F = F0 + (1 - F0) * exp2((-5.55473 * vh - 6.98316) * vh);
//添加的代码到这里结束

float3 diffColor = kd * Albedo * lightColor * nl;`


注意F0和F均为float3，F0中带有表面颜色信息，最终效果中光滑度和金属度均为1的表面的高光带有的颜色就是从F0中来的。


输出得到的F：


![v2-300d7756b50f8bf31cf776e017f4503d_720w.jpg](https://pic2.zhimg.com/80/v2-300d7756b50f8bf31cf776e017f4503d_720w.jpg)


可以看到完全看不出菲涅尔的效果。。。但是无论是Unity还是OpenGl都是这么实现的，最后得到的渲染结果也是对的，所以我个人理解而言菲涅尔这一步的作用与其说是表现菲涅尔效应还不如说是把金属表面和非金属表面区分开来，即金属的高光带有表面颜色Albedo而非金属不带。同时菲涅尔系数也是一个用于计算能量守恒的重要参数，这点在下面再详细讲。


算出了DGF这三个系数，我们只要除掉配平系数就可以得到高光部分结果。配平系数分母中的nl和nv实际上是可以和G的分子约掉的，Unity的做法就是约掉nl和nv后把配平系数和G的相乘得到一个变量V拿来计算高光部分结果。约掉这两者可以降低运算开销还能防止除0好处多多，不过我这里为了容易理解还是不约了。


最后把DFG和配平系数乘起来并和漫反射结果加和的代码如下：


`float3 F = F0 + (1 - F0) * exp2((-5.55473 * vh - 6.98316) * vh);

//添加到部分从这里开始
float3 SpecularResult = (D * G * F * 0.25) / (nv * nl);

//直接光照部分结果
float3 specColor = SpecularResult * lightColor * nl * UNITY_PI;
//添加到部分到这里结束

float3 diffColor = kd * Albedo * lightColor * nl;
float3 DirectLightResult = diffColor + specColor;`


SpecularResult分子的乘0.25是Unity的做法，毕竟用乘法比除4效率高。注意到在镜面反射结果这里乘上了一个PI，这也是Unity的trick，因为之前少给漫反射除了个PI，这里为了保证漫反射和镜面反射的比例所以多乘了个PI。


然后我们把之前设置成1的kd重新计算，kd为（1-F）乘上（1-_Metallic）。乘上（1-F）是为了保证能量守恒，乘一次(1-_Metallic)是因为金属会更多的吸收折射光线导致漫反射消失，这是金属物质的特殊物理性质。镜面反射方程中的ks就是菲涅尔系数F这里不用再乘一遍。


然后我们把漫反射和镜面反射结果加起来，直接光部分就此完成，直接光部分的完整代码如下：


`float3 Albedo = _Tint * tex2D(_MainTex, i.uv);

float lerpSquareRoughness = pow(lerp(0.002, 1, roughness), 2);//Unity把roughness lerp到了0.002
float D = lerpSquareRoughness / (pow((pow(nh, 2) * (lerpSquareRoughness - 1) + 1), 2) * UNITY_PI);

float kInDirectLight = pow(squareRoughness + 1, 2) / 8;
float kInIBL = pow(squareRoughness, 2) / 8;
float GLeft = nl / lerp(nl, 1, kInDirectLight);
float GRight = nv / lerp(nv, 1, kInDirectLight);
float G = GLeft * GRight;

float3 F0 = lerp(unity_ColorSpaceDielectricSpec.rgb, Albedo, _Metallic);
float3 F = F0 + (1 - F0) * exp2((-5.55473 * vh - 6.98316) * vh);

float3 SpecularResult = (D * G * F * 0.25) / (nv * nl);

//漫反射系数
float3 kd = (1 - F)*(1 - _Metallic);

//直接光照部分结果
float3 specColor = SpecularResult * lightColor * nl * UNITY_PI;
float3 diffColor = kd * Albedo * lightColor * nl;
float3 DirectLightResult = diffColor + specColor;`


直接光部分得到的渲染效果如下：


![v2-67bac9b4ee8f136f078219c267c2f22e_720w.jpg](https://pic3.zhimg.com/80/v2-67bac9b4ee8f136f078219c267c2f22e_720w.jpg)


可以看到和使用Unity内置函数实现的直接光PBR效果十分接近（形状不一样是因为用的是透视摄像机）。


我看到的大部分教程写到这就结束了，但实际上此时离真正的PBR还差的很远（图片中第二排球和第三篇球的差距还很大）。BRDF的直接光部分和传统非物理渲染的效果其实区别不大，真正不同之处在于间接光部分。和直接光部分直接弄几个公式乘起来就行不同，这部分确实很难啃。在下文中，我会实现间接光的漫反射和高光反射部分，并尽量通俗易懂的把这两部分讲明白。


## 间接光


间接光的实现与ibl（基于图像的渲染）和SH（球谐光照）这两个名词分不开。基于图像的渲染已经是很大的一个体系了，在这里特指基于环境贴图cubemap对表面进行渲染。球谐光照实际上就是将周围的环境光采样成几个系数，然后渲染的时候用这几个系数来对光照进行还原，这种过程可以看做是对周围环境光的简化。这两者在后面的实验中都会被用到。


间接光部分使用的也是和直接光相同的BRDF方程，不同之处在于BRDF加一加就好，而这里真的要解积分。。。总的公式如下：


![v2-b29d34cbc0ff03ec67029cb6a3d02063_720w.png](https://pic4.zhimg.com/80/v2-b29d34cbc0ff03ec67029cb6a3d02063_720w.png)


## 间接光漫反射


拆分出的间接光漫反射公式如下：


![v2-ddc0c193c694649fb5a7062cc03f55d1_720w.jpg](https://pic2.zhimg.com/80/v2-ddc0c193c694649fb5a7062cc03f55d1_720w.jpg)


后面那个积分看起来很吓人，想看解法的话《 Real-time Rendering》上有，我这里只谈实现。在Shader里每帧做积分显然是不现实的，普遍的做法是把采样得到的cubemap预处理成一张贴图，就像下图这样：


![v2-6107a8902d10e23e015f65705b210d15_720w.jpg](https://pic2.zhimg.com/80/v2-6107a8902d10e23e015f65705b210d15_720w.jpg)


预处理过程如果想手写的话可以看OpenGL的实现，而作为一个成熟的引擎Unity已经帮我们把cubemap处理好存起来了。Unity里有这么一组变量：


`// SH lighting environment
    half4 unity_SHAr;
    half4 unity_SHAg;
    half4 unity_SHAb;
    half4 unity_SHBr;
    half4 unity_SHBg;
    half4 unity_SHBb;
    half4 unity_SHC;`


这里存的是积分后用球谐函数编码的全局光照。即Unity做的事情为：先将环境贴图cubemap积分成模糊的全局光照贴图，再将全局光照贴图投影到球谐光照的基函数上存储，这里的七个参数即为存储的基函数的系数。Unity用的基函数叫三阶的伴随勒让德多项式，式子的参数如下所示：


![v2-b5b5c516b6506d205e1a74d799464307_720w.jpg](https://pic4.zhimg.com/80/v2-b5b5c516b6506d205e1a74d799464307_720w.jpg)


unity_SHA的三个系数存储的是l=1时的参数，unity_SHB存储的是l=2时的第1，2，4个参数，unity_SHC单独存储（m=2，l=2）时的最后一个参数。（l=0，m=0）和（l=2，m=0）的系数代表的光照数据影响太小被Unity舍弃掉了。


公式挺吓人，但实际上每个参数表示的都是球面上某一部分的光照，如图：


![v2-a4828db81468be19a717dc62aec8613f_720w.jpg](https://pic4.zhimg.com/80/v2-a4828db81468be19a717dc62aec8613f_720w.jpg)


具体的计算代码见UnityCG.cginc，在这里直接调用其中的ShadeSH9函数。此函数传入归一化的法线，返回的即为重建的积过分的环境光照信息。


`half3 ambient_contrib = ShadeSH9(float4(i.normal, 1));

float3 ambient = 0.03 * Albedo;

float3 iblDiffuse = max(half3(0, 0, 0), ambient.rgb + ambient_contrib);

float kdLast = 1;

float3 iblDiffuseResult = iblDiffuse * kdLast * Albedo;`


第二行往后的代码都很容易理解。ambient是环境光影响不大，随便设个很暗的值就行。这样得到的iblDiffuse就是方程中积分部分的值，乘上kd乘上Albedo即为间接光漫反射的结果，此处的kd和上面的kd不一样需要重新计算，先设成1。注意这里和直接光部分一样没有对颜色除PI。


做完这一步得到的渲染结果如下：


![v2-8e78cd6f7b795cf6fa1b8b5c2c61e5a4_720w.jpg](https://pic1.zhimg.com/80/v2-8e78cd6f7b795cf6fa1b8b5c2c61e5a4_720w.jpg)


可以看到在材质金属度为0的时候效果和standard shader已经很接近了，我们离胜利只有一步之遥。


## 间接光镜面反射


间接光镜面反射方程如下：


![v2-a39626b95a32e4a0d683d6552ddc1efb_720w.png](https://pic4.zhimg.com/80/v2-a39626b95a32e4a0d683d6552ddc1efb_720w.png)


可以看到方程十分复杂，虚幻引擎的做法是使用近似算法split sum把它简化成下面这样：


![v2-019074b7d12ea2ef2bf02c3d7a21f46e_720w.png](https://pic3.zhimg.com/80/v2-019074b7d12ea2ef2bf02c3d7a21f46e_720w.png)


左边的括是一个和粗糙度有关的函数，由于它跟粗糙度相关我们不能和漫反射一样用一张贴图解决，这种时候我们就想起了我们的老朋友LOD。把环境cubemap渲染成一张叫Pre-Filtered Environment Map的带LOD的类似于下面这样的贴图：


![v2-cf680bf497ea9bc8b271e1532ff20098_720w.jpg](https://pic1.zhimg.com/80/v2-cf680bf497ea9bc8b271e1532ff20098_720w.jpg)


然后根据粗糙度对这张贴图进行三次线性采样，采样得到的颜色就是方程左边括号内的结果。


Unity自然也给了这张图，就存储在unity_SpecCube0这个变量里。这个变量大家都见过，存储的是场景和天空盒的反射探针数据（还有一个变量叫unity_SpecCube1，存储的离物体最近的反射探针的数据）。有了图我们就开始采样，采样代码如下：


`float mip_roughness = perceptualRoughness * (1.7 - 0.7 * perceptualRoughness);
float3 reflectVec = reflect(-viewDir, i.normal);

half mip = mip_roughness * UNITY_SPECCUBE_LOD_STEPS;
half4 rgbm = UNITY_SAMPLE_TEXCUBE_LOD(unity_SpecCube0, reflectVec, mip); 

float3 iblSpecular = DecodeHDR(rgbm, unity_SpecCube0_HDR);`


代码比较难懂我一行行讲。第一行是采样用的粗糙度的计算，Unity的粗糙度和采样的mipmap等级关系不是线性的，Unity内使用的转换公式为mip
 = r(1.7 - 0.7r)，这是Unity shader的实现，只是个很接近实际值的拟合曲线，真正的计算方式如下：


`float m = roughness*roughness;
const float fEps = 1.192092896e-07F;
float n =  (2.0 / max(fEps, m * m)) - 2.0;
n /= 4;
roughness = pow( 2 / (n + 2), 0.25);`


这个函数来源于这篇文章：


[Microfacet Based Bidirectional Reflectance Distribution Function](https://link.zhihu.com/?target=http%3A%2F%2Fjbit.net%2F~sparky%2Facademic%2Fmm_brdf.pdf)


[jbit.net/~sparky/academic/mm_brdf.pdf](https://link.zhihu.com/?target=http%3A%2F%2Fjbit.net%2F~sparky%2Facademic%2Fmm_brdf.pdf)


其中有这样一个公式（公式21）：


![v2-e1e2f3cedf44d158a7b20a7f0079ea76_720w.jpg](https://pic3.zhimg.com/80/v2-e1e2f3cedf44d158a7b20a7f0079ea76_720w.jpg)


关于这个除4来源于这篇文章的_Pre-convolved Cube Maps vs Path Tracers部分_：


[Power Drops Within Lys](https://link.zhihu.com/?target=https%3A%2F%2Fs3.amazonaws.com%2Fdocs.knaldtech.com%2Fknald%2F1.0.0%2Flys_power_drops.html)


[s3.amazonaws.com/docs.knaldtech.com/knald/1.0.0/lys_power_drops.html](https://link.zhihu.com/?target=https%3A%2F%2Fs3.amazonaws.com%2Fdocs.knaldtech.com%2Fknald%2F1.0.0%2Flys_power_drops.html)


![v2-b9aed0e3401d1c51231b49b76b5a900b_180x120.jpg](https://pic4.zhimg.com/v2-b9aed0e3401d1c51231b49b76b5a900b_180x120.jpg)


我是看不懂了。。。想看的或是看得懂的大佬求求你给我讲讲吧。。。


第二行好说，就是根据视线方向和法线求出个反射向量留着以后用。


第三行是用从0到1之间的mip_roughness函数换算出用于实际采样的mip层级，UNITY_SPECCUBE_LOD_STEPS是一个定义在UnityStandardConfig.cginc文件中的常量，没改的话就是6。


第四行的UNITY_SAMPLE_TEXCUBE_LOD是一个采样函数，粗糙度越高采样出的结果就越模糊。cubemap的采样使用三线性插值，即从两张最近的mipmap层级上各做一次二次线性插值再将结果插值。


最后一行使用DecodeHDR将颜色从HDR编码下解码。可以看到采样出的rgbm是一个4通道的值，最后一个m存的是一个参数，解码时将前三个通道表示的颜色乘上xM^y，x和y都是由环境贴图定义的系数，存储在unity_SpecCube0_HDR这个结构中。


于是我们得到了iblSpeclar，也就是上面间接高光的方程里左边括号的值。


右边括号是一个定值，业界的做法是将值放到一张查找图中，用的时候根据nv和粗糙度采样。这种LUT（Look up texture）如下：


![v2-11ec62b7fea7fa46fe9150cc651a33b0_720w.jpg](https://pic1.zhimg.com/80/v2-11ec62b7fea7fa46fe9150cc651a33b0_720w.jpg)


导入这张图的时候注意要改下图片的设置。之前把Unity的颜色空间设置为线性，这个设置的意思并不是说我们不需要做伽马校正了，而是在导入贴图的时候Unity会自动将贴图设置为sRGB格式从伽马空间转到线性空间，在输出颜色的时候再自动做伽马映射将计算的值从线性空间映射到伽马空间显示到屏幕上。之所以要设置sRGB格式是因为大部分用于显示颜色的贴图（Color
 
Texture）为了在伽马颜色空间中输出正确颜色在导入前就做过一次伽马校正了，而我们的LUT并不用于输出颜色，只是个用于查找数据的图并没有被校正过，所以设置中需要把sRGB取消掉。同时关闭贴图的mipmap生成，将Wrap
 mode设置为clamp，Filter 
mode设置为Bilinear（没有mipmap也没法设置成三次线性）。再将下面的压缩参数都设置为最大（能不压缩就不压缩）。


将导入的查找图拖到材质的LUT上，接着进行编码，代码如下：


`float3 iblSpecular = DecodeHDR(rgbm, unity_SpecCube0_HDR);

//添加的部分从这里开始
float2 envBDRF = tex2D(_LUT, float2(lerp(0, 0.99, nv), lerp(0, 0.99, roughness))).rg; // LUT采样
//添加的部分到这里结束

float3 iblDiffuseResult = iblDiffuse * kdLast * Albedo;`


注意这里把nv和roughness都clamp到0到0.99之间，这是因为当这两个值都为1的时候LUT的颜色会发生突变，导致被渲染的物体上产生亮斑。


注意，这个LUT是虚幻和OpenGL的实现，实际上Unity用的是另一套东西，Unity计算间接光漫反射的那行源码如下：


`surfaceReduction * gi.specular * FresnelLerp (specColor, grazingTerm, nv);`


注意到Unity用的是一个叫surfaceReduction的系数，以及一个在F0（specColor就是我们的F0）和grazingTerm之间进行插值的菲涅尔系数。纹理采样的开销远大于计算这几个参数的开销，也就是说Unity这个做法通常而言比采样LUT要来的快。但关于这几个值的理论意义我是实在找不到，所有教程也都不约而同的把这点跳了过去。我感觉Unity是用一个高效的拟合函数现算了LUT里的数据，但Unity给的公式我并没有推出来。。。这点先欠着，之后等我搞明白了再补上，当然要是有大佬能告诉我答案就更好了。


这几个值的计算方法如下：


`ifdef UNITY_COLORSPACE_GAMMA
        // 1-0.28*x^3 as approximation for (1/(x^4+1))^(1/2.2) on the domain [0;1]
        surfaceReduction = 1.0-0.28*roughness*perceptualRoughness;      
#   else
        // fade \in [0.5;1]
        surfaceReduction = 1.0 / (roughness*roughness + 1.0);           
#   endif

half grazingTerm = saturate(smoothness + (1-oneMinusReflectivity));

inline half3 FresnelLerp (half3 F0, half3 F90, half cosA)
{
    half t = Pow5 (1 - cosA);   // ala Schlick interpoliation
    return lerp (F0, F90, t);
}`


我们也可以模仿Unity的间接光镜面反射实现，代码如下：


`float surfaceReduction = 1.0 / (roughness*roughness + 1.0); //Liner空间
//float surfaceReduction = 1.0 - 0.28*roughness*perceptualRoughness;  //Gamma空间

float oneMinusReflectivity = 1 - max(max(SpecularResult.r, SpecularResult.g), SpecularResult.b);
float grazingTerm = saturate(_Smoothness + (1 - oneMinusReflectivity));
float4 IndirectResult = float4(iblDiffuse * kdLast * Albedo + iblSpecular * surfaceReduction * FresnelLerp(F0, grazingTerm, nv), 1);`


这样做得到的实际效果和使用LUT的情况差别不大。


接着计算间接光的菲涅尔系数和kd，把上面设为1的KLast删掉重新计算，代码如下：


`float2 envBDRF = tex2D(_LUT, float2(lerp(0, 0.99, nv), lerp(0, 0.99, roughness))).rg; // LUT采样

//添加到的分从这里开始
float3 Flast = fresnelSchlickRoughness(max(nv, 0.0), F0, roughness);
float kdLast = (1 - Flast) * (1 - _Metallic);
//添加的部分到这里结束

float3 iblDiffuseResult = iblDiffuse * kdLast * Albedo;`


在frag shader上面添加fresnelSchlickRoughness函数：


`float3 fresnelSchlickRoughness(float cosTheta, float3 F0, float roughness)
{
	return F0 + (max(float3(1.0 - roughness, 1.0 - roughness, 1.0 - roughness), F0) - F0) * pow(1.0 - cosTheta, 5.0);
}`


这里的菲涅尔系数计算和前面的有两点不同，第一点是这里没有用于计算微片元朝向的D函数，计算菲涅尔系数使用的是真正的nv而不是vh，第一点是这里的菲尼尔系数计算使用的是粗糙度而不是金属度。


使用nv是由于环境光来自半球内围绕法线N的所有方向，因此无法和直接光照中的法线分布函数D一样使用单个半角向量来确定微平面分布，所以在此我们只能使用法线和视线的夹角（即nv）来计算菲涅尔效果。


使用粗糙度而不是金属度其实是一种经验化的做法，方法来自Sébastien Lagarde：


[Adopting a physically based shading model](https://link.zhihu.com/?target=https%3A%2F%2Fseblagarde.wordpress.com%2F2011%2F08%2F17%2Fhello-world%2F)


[seblagarde.wordpress.com/2011/08/17/hello-world/](https://link.zhihu.com/?target=https%3A%2F%2Fseblagarde.wordpress.com%2F2011%2F08%2F17%2Fhello-world%2F)


![v2-081a261993c533c30618fb06d32c3f1d_180x120.jpg](https://pic2.zhimg.com/v2-081a261993c533c30618fb06d32c3f1d_180x120.jpg)


间接光和直射光的属性相同，因此我们期望较粗糙的表面在边缘上的反射较弱。但之前我们在直接光中计算的菲涅尔系数时完全没有把粗糙度考虑进去，所以表面边缘的反射率总会相对实际值偏高从而带来失真。这一点在粗糙的非金属表面边缘上十分明显，失真效果如下：


![v2-f5631cdeb823db73cc32b914bcd366a0_720w.png](https://pic1.zhimg.com/80/v2-f5631cdeb823db73cc32b914bcd366a0_720w.png)


在这里使用的由Sébastien Lagarde描述的以粗糙度为系数的菲涅尔方程可以有效缓解这个问题。


根据新的菲涅尔系数即可算出新的kd，有了这些值就可以进行环境光部分的加和工作，代码如下：


`float3 iblDiffuseResult = iblDiffuse * kdLast * Albedo;

//添加到的分从这里开始
float3 iblSpecularResult = iblSpecular * (Flast * envBDRF.r + envBDRF.g);
//添加的部分到这里结束

float3 IndirectResult = iblDiffuseResult + iblSpecularResult;`


高光部分乘上的就是根据LUT采样出的颜色和菲涅尔系数计算出的值。现在我们的BRDF方程四部分就全部计算完成了，得到的结果如下：


![v2-67d441b1ead9374627ce981c7190428f_720w.jpg](https://pic4.zhimg.com/80/v2-67d441b1ead9374627ce981c7190428f_720w.jpg)


可以看到第二行小球的渲染效果已经和第三行的standard shader看不出太大区别了，大功告成。


完整的shader如下：


`Shader "Arc/ArcHandWritePbrExp"
{
	Properties
	{
		_MainTex("Texture", 2D) = "white" {}
		_Tint("Tint", Color) = (1 ,1 ,1 ,1)
		[Gamma] _Metallic("Metallic", Range(0, 1)) = 0 //金属度要经过伽马校正
		_Smoothness("Smoothness", Range(0, 1)) = 0.5
		_LUT("LUT", 2D) = "white" {}
	}

		SubShader
	{
		Tags { "RenderType" = "Opaque" }
		LOD 100

		Pass
		{
			Tags {
				"LightMode" = "ForwardBase"
			}
			CGPROGRAM


			#pragma target 3.0

			#pragma vertex vert
			#pragma fragment frag

			#include "UnityStandardBRDF.cginc" 

			struct appdata
			{
				float4 vertex : POSITION;
				float3 normal : NORMAL;
				float2 uv : TEXCOORD0;
			};

			struct v2f
			{
				float4 vertex : SV_POSITION;
				float2 uv : TEXCOORD0;
				float3 normal : TEXCOORD1;
				float3 worldPos : TEXCOORD2;
			};

			float4 _Tint;
			float _Metallic;
			float _Smoothness;
			sampler2D _MainTex;
			float4 _MainTex_ST;
			sampler2D _LUT;

			v2f vert(appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.worldPos = mul(unity_ObjectToWorld, v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				o.normal = UnityObjectToWorldNormal(v.normal);
				o.normal = normalize(o.normal);
				return o;
			}

			float3 fresnelSchlickRoughness(float cosTheta, float3 F0, float roughness)
			{
				return F0 + (max(float3(1 ,1, 1) * (1 - roughness), F0) - F0) * pow(1.0 - cosTheta, 5.0);
			}

			fixed4 frag(v2f i) : SV_Target
			{
				i.normal = normalize(i.normal);
				float3 lightDir = normalize(_WorldSpaceLightPos0.xyz);
				float3 viewDir = normalize(_WorldSpaceCameraPos.xyz - i.worldPos.xyz);
				float3 lightColor = _LightColor0.rgb;
				float3 halfVector = normalize(lightDir + viewDir);  //半角向量

				float perceptualRoughness = 1 - _Smoothness;

				float roughness = perceptualRoughness * perceptualRoughness;
				float squareRoughness = roughness * roughness;

				float nl = max(saturate(dot(i.normal, lightDir)), 0.000001);//防止除0
				float nv = max(saturate(dot(i.normal, viewDir)), 0.000001);
				float vh = max(saturate(dot(viewDir, halfVector)), 0.000001);
				float lh = max(saturate(dot(lightDir, halfVector)), 0.000001);
				float nh = max(saturate(dot(i.normal, halfVector)), 0.000001);

				float3 Albedo = _Tint * tex2D(_MainTex, i.uv);

				float lerpSquareRoughness = pow(lerp(0.002, 1, roughness), 2);//Unity把roughness lerp到了0.002
				float D = lerpSquareRoughness / (pow((pow(nh, 2) * (lerpSquareRoughness - 1) + 1), 2) * UNITY_PI);

				float kInDirectLight = pow(squareRoughness + 1, 2) / 8;
				float kInIBL = pow(squareRoughness, 2) / 8;
				float GLeft = nl / lerp(nl, 1, kInDirectLight);
				float GRight = nv / lerp(nv, 1, kInDirectLight);
				float G = GLeft * GRight;

				float3 F0 = lerp(unity_ColorSpaceDielectricSpec.rgb, Albedo, _Metallic);
				float3 F = F0 + (1 - F0) * exp2((-5.55473 * vh - 6.98316) * vh);

				float3 SpecularResult = (D * G * F * 0.25) / (nv * nl);

				//漫反射系数
				float3 kd = (1 - F)*(1 - _Metallic);

				//直接光照部分结果
				float3 specColor = SpecularResult * lightColor * nl * UNITY_PI;
				float3 diffColor = kd * Albedo * lightColor * nl;
				float3 DirectLightResult = diffColor + specColor;

				half3 ambient_contrib = ShadeSH9(float4(i.normal, 1));

				float3 ambient = 0.03 * Albedo;

				float3 iblDiffuse = max(half3(0, 0, 0), ambient.rgb + ambient_contrib);

				float mip_roughness = perceptualRoughness * (1.7 - 0.7 * perceptualRoughness);
				float3 reflectVec = reflect(-viewDir, i.normal);

				half mip = mip_roughness * UNITY_SPECCUBE_LOD_STEPS;
				half4 rgbm = UNITY_SAMPLE_TEXCUBE_LOD(unity_SpecCube0, reflectVec, mip);

				float3 iblSpecular = DecodeHDR(rgbm, unity_SpecCube0_HDR);

				float2 envBDRF = tex2D(_LUT, float2(lerp(0, 0.99, nv), lerp(0, 0.99, roughness))).rg; // LUT采样

				float3 Flast = fresnelSchlickRoughness(max(nv, 0.0), F0, roughness);
				float kdLast = (1 - Flast) * (1 - _Metallic);

				float3 iblDiffuseResult = iblDiffuse * kdLast * Albedo;
				float3 iblSpecularResult = iblSpecular * (Flast * envBDRF.r + envBDRF.g);
				float3 IndirectResult = iblDiffuseResult + iblSpecularResult;

				float4 result = float4(DirectLightResult + IndirectResult, 1);

				return result;
			}

			ENDCG
		}
	}
}`


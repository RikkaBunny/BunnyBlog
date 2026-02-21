---
title: "tex2D和Sample"
categories: ["Unity"]
date: "2023-07-07"
created: "2023-07-07T13:24:00.000Z"
updated: "2023-07-07T13:27:00.000Z"
notion_url: "https://www.notion.so/tex2D-Sample-0322103d7e204dec9dbcb2cca095d9e7"
database: "Unity Technical"
source: "notion-sync"
---
和Unreal的 贴图 与 贴图采样器概念一样。


# **使用采样器状态**


## **耦合的纹理和采样器**


大多数情况下，在着色器中采样纹理时，纹理采样状态应来自[纹理设置](https://docs.unity3d.com/cn/current/Manual/class-TextureImporter.html)；本质上，纹理和采样器会耦合在一起。使用 DX9 风格的着色器语法时，这是默认行为：


```plain text
sampler2D _MainTex;
// ...
half4 color = tex2D(_MainTex, uv);
```


使用 HLSL 关键字 sampler2D、sampler3D 和 samplerCUBE 可声明纹理和采样器。


大部分情况下，这是您想要的结果，而且在较旧的图形 API (OpenGL ES) 中，这是唯一受支持的选项。


## **单独的纹理和采样器**


很多图形 API 和 GPU 都允许使用的采样器数量少于纹理，而耦合的纹理+采样器语法可能不允许编写更复杂的着色器。例如，Direct3D 11 允许在单个着色器中最多使用 128 个纹理，但最多仅允许使用 16 个采样器。


Unity 允许使用 DX11 风格的 HLSL 语法来声明纹理和采样器，但需要通过一个特殊的命名约定来让它们匹配：名称为“sampler”+TextureName 格式的采样器将从该纹理中获取采样状态。


以上部分中的着色器代码片段可以用 DX11 风格的 HLSL 语法重写，并且也会执行相同的操作：


```plain text
Texture2D _MainTex;
SamplerState sampler_MainTex; //"sampler"+"_MainTex"
// ...
half4 color = _MainTex.Sample(sampler_MainTex, uv);
```


但这样一来，就可以编写着色器来重复使用其他纹理中的采样器，同时采样多个纹理。在以下示例中，采样了三个纹理，但仅一个采样器用于所有这些纹理：


```plain text
Texture2D _MainTex;
Texture2D _SecondTex;
Texture2D _ThirdTex;
SamplerState sampler_MainTex; //"sampler"+"_MainTex"
// ...
half4 color = _MainTex.Sample(sampler_MainTex, uv);
color += _SecondTex.Sample(sampler_MainTex, uv);
color += _ThirdTex.Sample(sampler_MainTex, uv);
```


但是请注意，DX11 风格的 HLSL 语法在某些较旧的平台（例如，OpenGL ES 2.0）上无效，请参阅[在 Unity 中使用 HLSL](https://docs.unity3d.com/cn/current/Manual/SL-ShaderPrograms.html) 以了解详细信息。您可能需要指定 `#pragma target 3.5`（请参阅[着色器编译目标](https://docs.unity3d.com/cn/current/Manual/SL-ShaderCompileTargets.html)）以避免较旧的平台使用着色器

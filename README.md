
<p align="center"><b>一些炫酷的点击特效</b></p>

# 目录

- [目录](#目录)
  - [快速入门](#快速入门)
    - [安装](#安装)
    - [用法](#用法)
      - [main.js 文件：](#mainjs-文件)
      - [使用：](#使用)
  - [维护者](#维护者)

## 快速入门

### 安装

```bash
$ npm i duo-touch --save             # install duo-touch
```

### 用法

#### main.js 文件：

```js

import 'duo-touch'
```
#### 使用 ripple：

```vue
<template>
  <div class="wrap">
    <!--  elementUI 按钮对象 -->
    <div class="element-button">
      <el-button v-ripple icon="el-icon-search" circle></el-button>
      <el-button v-ripple="ripple" icon="el-icon-search" circle></el-button>
      <el-button v-ripple plain class="ripple">朴素按钮</el-button>
      <el-button v-ripple round plain class="ripple">朴素按钮</el-button>
      <el-button v-ripple="ripple" type="primary" round>主要按钮</el-button>
    </div>
    <!--  自定义对象 -->
    <div class="custom-wrap">
      <span v-ripple class="ripple ripple-style">click</span>
      <span v-ripple="ripple" class="ripple ripple-style">click</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ripple: {
        plain: true,
        transition: 0.5,
        color: "rgba(113, 71, 117, 1)",
        // color: "rgb(113,71,117)",
        // color: "#000",
        // color: "#000000",
      },
    };
  },
};
</script>
```
#### 使用 particle：

```vue
<template>
  <div class="wrap">
    <div class="element-button">
      <el-button v-particle icon="el-icon-search" circle></el-button>
      <el-button v-particle="particle" icon="el-icon-search" circle></el-button>
      <el-button v-particle plain class="particle">朴素按钮</el-button>
      <el-button v-particle round plain class="particle">朴素按钮</el-button>
      <el-button v-particle="particle" type="primary" round>主要按钮</el-button>
    </div>
    <div class="custom-wrap">
      <span v-particle class="particle particle-style">click</span>
      <span v-particle="particle" class="particle particle-style">click</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      particle: {
        once: false,          // 是否执行一个周期(默认为true)
        hidden: false,        // 执行后是否隐藏对象(默认为true)
        type: "rectangle",    // 微粒类型([circle||rectangle||triangle]默认为circle)
        style: "stroke",      // 微粒形状绘制([stroke||fill]默认为stroke)
        size: 15,             // 微粒尺寸大小(默认为true)
        color: "#e87084",     // 微粒颜色(默认为#007CCC)
        duration: 600,        // 微粒过渡时间([单位秒]默认为1000)
        easing: "easeOutQuad" // 微粒动画类型(默认为easeInOutCubic)
        direction: "right",   // 动画执行方向(默认为left)
        speed: 0.1,           // 微粒运动速度([单位秒]默认为(Math.random() * 4) - 4 / 2)
      },
    };
  },
};
</script>
```

[→ simple demo](https://duofuni.github.io/duo-touch/)

## 维护者

- [duofuni](https://github.com/duofuni)
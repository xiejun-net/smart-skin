# 渐进式的主题皮肤切换解决方案

背景：做了一年的App突然需要加主题切换的功能，App中有大量的h5页面，如果一次性全量替换其开发周期会很长，且全量发布出问题的概率会比较大；另有一些跳转比较深的页面不需要做主题切换功能，但是这些页面可能和需要做主题色的页面是同一个单页面，所以主题切换需要做到路由级别。

## 基础实现方案

> 需要和设计师沟通好，对设计师的设计规范有较高要求，主题切换仅仅是改变样色，icon等

### css定义主题类型

1.  在body上定义全局主题色类选择器分别对应各个主题色

```
// class=simple-white/starry-night/soothing-blue
<body class="simple-white">
```

2.  根据主题色定义全局的主题变量

```
.simple-white {
    --primariy-color: #414FFF;
    --text-color-1: #2A2A34;
    ...
}
.starry-night {
    --primariy-color: #414FFF;
    --text-color-1: #2A2A34;
    ...
}
.soothing-blue {
    --primariy-color: #414FFF;
    --text-color-1: #2A2A34;
    ...
}
```

3.  项目开发中颜色都用变量代替

```
.app-container {
    background: var(--primariy-color);
}
```

### 通过js改变body上的class的方式来切换主题

我这里写了一个插件实现主题初始化和开发环境下模拟切换主题色

源码参见： <https://github.com/xiejun-net/smart-skin>

```
import { SmartSkin } from 'smart-skin'


// export interface IOptions {
//     skinTypeList: Array<string> // 多种颜色情况下所有的主题class
//     currentSkin: string // 传入默认皮肤主题
//     followUpSystem?: boolean // 是否跟随系统
//     darkSkinType?: string // 跟随系统深色模式
//     lightSkinStype?: string // 跟随系统浅色模式
//     debugger?: boolean // 是否开启调试
// }

// 创建实例
const smartSkin = new SmartSkin({
    skinTypeList: ['simple-white', 'starry-night', 'soothing-blue'],
    currentSkin: 'simple-white',
    darkSkinType: 'starry-night',
    lightSkinStype: 'simple-white',
    followUpSystem: false,
    debugger: !!IS_DEV, 
})

// 皮肤初始化
smartSkin.init()
```

跟随系统的处理，只支持macOS/iOS/iPad

```
if (this.options.followUpSystem) {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)')
    this._followUpSystem(matchMedia)
    matchMedia.addEventListener('change', this._followUpSystem)
}
```

**支持本地调试切换主题**


![Xnip2022-10-24_21-55-10.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b6f3c6f998d4760bc47f1739b2c1aa8~tplv-k3u1fbpfcp-watermark.image?)
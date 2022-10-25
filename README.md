## 主题皮肤切换解决方案

背景：做了一年的App突然需要加主题切换的功能，App中有大量的h5页面，如果一次性全量替换其开发周期会很长，且全量发布出问题的概率会比较大；另有一些跳转比较深的页面不需要做主题切换功能，但是这些页面可能和需要做主题色的页面是同一个单页面，所以主题切换需要做到路由级别。

## 基础实现方案

> 需要和设计师沟通好，对设计师的设计规范有较高要求，主题切换仅仅是改变样色，icon等

### css定义主题类型

1.  定义全局主题色分别对应各个主题色

```
// theme=white/night/blue
html[data-theme="white"]
```

2.  根据主题色定义全局的主题变量

```
html[data-theme="white"]:root {
    --background-color: #fff;
    --text-color: black;
}
html[data-theme="night"]:root {
    --background-color: black;
    --text-color: #fff;
}
html[data-theme="blue"]:root {
    --background-color: blue;
    --text-color: #fff;
}
```

3.  项目开发中颜色都用变量代替

```
.app-container {
    background: var(--primariy-color);
}
```

### 通过js改变全局的data-theme属性的方式来切换主题

我这里写了一个插件实现主题初始化和开发环境下模拟切换主题色

源码参见： <https://github.com/xiejun-net/smart-skin>

```
import SmartSkin from 'smart-skin'

const smartSkin = new SmartSkin({
    skinTypeList: ['white', 'night', 'blue'],
    currentSkin: 'white',
    darkSkinType: 'night',
    lightSkinStype: 'white',
    followUpSystem: false,
    debugger: true, 
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

private _followUpSystem(ev: MediaQueryListEvent | MediaQueryList) {
        // 跟随系统
    this.changeSkinType(
        ev.matches ? this.options.darkSkinType : this.options.lightSkinStype
    )
}
```

**支持本地调试切换主题**

debugger设置为true即可

![xxx.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4429a2347c5640cdbdd97152c2478f98~tplv-k3u1fbpfcp-watermark.image?)

## 适配终端

### App内适配
app定制webview的userAgent,增加skinType/white,H5通过读取webview中的skinType给currentSkin赋默认值

```
const getUaValue = key => {
    const reg = new RegExp(`(^|\\s)${key}\\/[^\\s]+`)
    const match = navigator.userAgent.match(reg)
    return match ? match[0].split('/')[1] : ''
}
currentSkin = getUaValue('skinType')

```
App内部部分路由需要开启主题，在路由meta中添加needTheme的属性，当为true的时候初始化，否则移除data-theme
```
if (to.meta.needTheme) {
    smartSkin.init()
} else {
    smartSkin.removeAllSkinType()
}
```

### App外部

```
function getUrlParam(name) {
    let RegExpObject = new RegExp(
        '[?&]' + encodeURIComponent(name) + '=([^&|#]*)'
    )
    if ((name = RegExpObject.exec(window.location.href)))
        return decodeURIComponent(name[1])
}
currentSkin = getUrlParam('skinType')
```

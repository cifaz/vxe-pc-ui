# vxe-ui

A [vue](https://www.npmjs.com/package/vue) component library.  

简体中文 | [繁體中文](README.zh-TW.md) | [English](README.en.md)  

[![star](https://gitee.com/xuliangzhan_admin/vxe-ui/badge/star.svg?theme=gvp)](https://gitee.com/xuliangzhan_admin/vxe-ui/stargazers)
[![npm version](https://img.shields.io/npm/v/vxe-ui.svg?style=flat-square)](https://www.npmjs.com/package/vxe-ui)
[![npm build](https://travis-ci.com/x-extends/vxe-ui.svg?branch=master)](https://travis-ci.com/x-extends/vxe-ui)
[![npm downloads](https://img.shields.io/npm/dt/@vxe-ui/components.svg?style=flat-square)](https://npm-stat.com/charts.html?package=@vxe-ui/components)
[![issues](https://img.shields.io/github/issues/x-extends/vxe-ui.svg)](https://github.com/x-extends/vxe-ui/issues)
[![issues closed](https://img.shields.io/github/issues-closed/x-extends/vxe-ui.svg)](https://github.com/x-extends/vxe-ui/issues?q=is%3Aissue+is%3Aclosed)
[![pull requests](https://img.shields.io/github/issues-pr/x-extends/vxe-ui.svg)](https://github.com/x-extends/vxe-ui/pulls)
[![pull requests closed](https://img.shields.io/github/issues-pr-closed/x-extends/vxe-ui.svg)](https://github.com/x-extends/vxe-ui/pulls?q=is%3Apr+is%3Aclosed)
[![npm license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)

## 浏览器支持

![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
80+ ✔ | 80+ ✔ | 90+ ✔ | 75+ ✔ | 10+ ✔ |

## 导入全部

```shell
npm install @vxe-ui/components
```

```javascript
// ...
import { createApp } from 'vue'
import VxeUI from '@vxe-ui/components'
// ...

VxeUI.config({
  size: null
})

// ...
const app = createApp(App)
app.use(VxeUI)
app.mount('#app')
// ...
```

## 按需导入

```shell
npm install @vxe-ui/components
```

```javascript
// ...
import { createApp } from 'vue'
import VxeUI from '@vxe-ui/core'
import VxeRow from '@vxe-ui/components/row'
import VxeCol from '@vxe-ui/components/col'
import VxeDesign from '@vxe-ui/components/design'

import '@vxe-ui/styles/row.css'
import '@vxe-ui/styles/col.css'
import '@vxe-ui/styles/design.css'
// ...

VxeUI.config({
  size: null
})

// ...
const app = createApp(App)
app.use(VxeRow)
app.use(VxeCol)
app.use(VxeDesign)
app.mount('#app')
// ...
```

## License

[MIT](LICENSE) © 2019-present, Xu Liangzhan

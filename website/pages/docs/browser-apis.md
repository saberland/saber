---
title: Browser APIs
layout: docs
---

## Usage

Exporting a function in `saber-browser.js` in the root of your project to extend Saber's browser APIs.

```js
export default context => {
  // Do something
}
```

The `default` export is optional, you can use this file to import JavaScript or CSS files if you want.

## API

### context

The `context` varies in different renderers, Saber currently only supports Vue.

### context.router

The Vue Router instance.

### context.rootOptions

The [options](https://vuejs.org/v2/api/#Options-Data) for root Vue instance. This is the default value:

```js
const rootOptions = {
  head: {},
  router,
  render: h => h('div', { attrs: { id: '_saber' } }, [h('router-view')])
}
```

If you intend to modify the `render` function, make sure the root element has an ID `_saber`.

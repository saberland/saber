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

### context.setHead

- Params:
  - `head`: `object` `function`, like the component option `head`

Set the `head` option for root Vue instance.

### context.setRootComponent

- Params:
  - `component`: `VueComponentOptions`, a Vue component

Wrap your whole app in a Vue component, for example:

`saber-browser.js`:

```js
import RootComponent from './RootComponent.vue'

context.setRootComponent(RootComponent)
```

`RootComponent.vue`:

```vue
<template>
  <div>
    <h1>The title will appear on every page</h1>
    <!-- The page is available as default slot -->
    <slot />
  </div>
</template>
```

### context.rootOptions

The [options](https://vuejs.org/v2/api/#Options-Data) for root Vue instance.

It's **not** recommended to mutate existing properties in `rootOptions`.

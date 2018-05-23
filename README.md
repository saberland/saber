# Saber.js

[![NPM version](https://img.shields.io/npm/v/saber.svg?style=flat)](https://npmjs.com/package/saber) [![NPM downloads](https://img.shields.io/npm/dm/saber.svg?style=flat)](https://npmjs.com/package/saber) [![CircleCI](https://circleci.com/gh/egoist/saber/tree/master.svg?style=shield)](https://circleci.com/gh/egoist/saber/tree/master)  [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate) [![chat](https://img.shields.io/badge/chat-on%20discord-7289DA.svg?style=flat)](https://chat.egoist.moe)

__Saber.js is a minimalistic framework for building static website using Vue.js.__

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [How to use](#how-to-use)
  - [Setup](#setup)
  - [Transforms](#transforms)
  - [Fetching data](#fetching-data)
  - [Dynamic route](#dynamic-route)
  - [Manipulating `<head>`](#manipulating-head)
  - [App-level enhancement](#app-level-enhancement)
  - [Progressive web app](#progressive-web-app)
  - [Google analytics](#google-analytics)
  - [Plugins](#plugins)
    - [Use a plugin](#use-a-plugin)
    - [Write a plugin](#write-a-plugin)
- [Contributing](#contributing)
- [Author](#author)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How to use

### Setup

Install it in your project:

```bash
# cd into your project
yarn add saber --dev
```

Configure npm scripts:

```json
{
  "scripts": {
    "dev": "saber dev",
    "build": "saber build"
  }
}
```

After that, the file-system is the main API. Every `.vue` file becomes a route that gets automatically processed and rendered.

Populate `./pages/index.vue` inside your project:

```vue
<template>
  <div>Welcome to saber.js</div>
</template>
```

And then just run `npm run dev` or `yarn dev` and go to `http://localhost:4000`.

To generate a static website for production, run `npm run build` or `yarn build` and you're all set. The generated website will be available at `.saber/website` directory which can be directly deployed to GitHub pages or Netlify et al.

So far you got:

- Automatic assets transforms
- Hot reloading for Vue components
- Static files inside `./public` are mapped to `/`

### Transforms

Most common transforms and transpilers are supported out-of-the-box.

- `postcss`: Enabled when you have a postcss config file like `postcss.config.js`
- `babel`: Enabled by default with a sensible [default preset](./lib/babel/preset.js), you can override it by populating a babel config file at project root.
- `sass` `scss` `less` `stylus`: Supported by default but you need to install relevant dependencies, e.g. for `sass` you need to install `node-sass` and `sass-loader` in your project.
- Images and fonts.

### Fetching data

You can pre-fetch data at compile time and use it in __route components__, this is achieved by using custom block `<saber>` in Vue single-file component.

📝 __pages/index.vue__:

```vue
<template>
  <div>{{ post.title }}</div>
</template>

<saber>
import axios from 'axios'

export default {
  async data() {
    const { data: post } = await axios
      .get('https://jsonplaceholder.typicode.com/posts/1')

    return {
      post
    }
  }
}
</saber>
```

The `data` method exported from `<saber>` block should return an object or a Promise which resolves to an object. Then the resolved value will be merged with your component's own `data`.

For syntax higlighting of the custom block, [`vetur`](https://vuejs.github.io/vetur/highlighting.html) comes to the rescue if you're using VSCode. 

### Dynamic route

It's common to use route like `/user/:id` to map routes with the given pattern to the same component, URLs like `/user/foo` and `/user/bar` will both map to the same route.

When it comes to statically generated website, we need to know the actual URLs instead of path patterns like `/user/:id`. 

In Saber.js, a file path like `user/[id].vue` will be mapped to path pattern `/user/:id`, then you can again use `<saber>` block to provide the value you want for `:id`:

📝 __pages/user/[id].vue__:

```vue
<template>
  <div>Hi {{ $route.params.id }}</div>
</template>

<saber>
export default {
  params() {
    return [
      { id: 'egoist' },
      { id: 'chelly' }
    ]

    // Or just a single page
    // return { id: 'egoist' }
  }
}
</saber>
```

### Manipulating `<head>`

You can use `head` option in all Vue components to control tags inside `<head>` and attributes for `<html>` `<body>` tags:

📝 __any-component.vue__:

```js
<script>
export default {
  head: {
    title: 'My Website'
  }
}
</script>
```

It's actually using [`vue-meta`](https://github.com/declandewet/vue-meta) under the hood.

### App-level enhancement

You may want to inject some global stylesheets or modify options for root Vue instance, create a `saber.app.js` in root directory and it will automatically be picked up:

```js
import Vue from 'vue'
import './styles/global.css'

// Maybe add some Vue plugin?
// Vue.use(YourPlugin)

// Optionally export a function
// To handle stuffs like rootOptions, router
export default ({ rootOptions, router }) => {
  // Do something...
}
```

### Progressive web app

Currently all generated files are cached by service worker by default, you can use set `pwa` in `saber.config.js` to disable it:

```js
module.exports = {
  pwa: false
}
```

More improvements for better PWA support are coming soon, PR welcome too :)

### Google analytics

Set `googleAnalytics` to your track id in `saber.config.js` to enable it:

```js
module.exports = {
  googleAnalytics: 'UA-XXX-XX'
}
```

### Plugins

#### Use a plugin

Inside the `saber.config.js`:

```js
module.exports = {
  plugins: {
    // Use saber-plugin-foo with options: {}
    'foo': {},
    // Or full package name
    'saber-plugin-bar': {}
    // Or a local plugin
    './my-plugin': {}
  }
}
```

#### Write a plugin

```js
module.exports = opts => {
  return {
    name: 'plugin-name',
    apply(api) {
      // Handle Plugin API
    }
  }
}
```

Check out [existing plugins](./lib/plugins) for references.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**saber** © [EGOIST](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/saber/contributors)).

> [egoist.moe](https://egoist.moe) · GitHub [@EGOIST](https://github.com/egoist) · Twitter [@_egoistlily](https://twitter.com/_egoistlily)

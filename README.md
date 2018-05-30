# Saber.js

[![NPM version](https://img.shields.io/npm/v/saber.svg?style=flat)](https://npmjs.com/package/saber) [![NPM downloads](https://img.shields.io/npm/dm/saber.svg?style=flat)](https://npmjs.com/package/saber) [![CircleCI](https://circleci.com/gh/egoist/saber.js/tree/master.svg?style=shield&circle-token=e074bbeaf4b60d0519ece6a175cb91e45b68b51b)](https://circleci.com/gh/egoist/saber/tree/master) [![spectrum chat](https://img.shields.io/badge/chat%20on-spectrum-7b16ff.svg?style=flat)](https://spectrum.chat/saber-js)

__Saber.js is a minimalistic framework for building static websites using Vue.js.__

__🔥You may also like [Ream](https://ream.js.org/) which is a Nuxt.js alternative.__

<a href="https://patreon.com/egoist">
<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" height="50">
</a>

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [How to use](#how-to-use)
  - [Setup](#setup)
  - [Transforms](#transforms)
    - [Customize babel config](#customize-babel-config)
    - [Customize webpack config](#customize-webpack-config)
  - [Serve static files](#serve-static-files)
  - [Fetching data](#fetching-data)
  - [Routing](#routing)
    - [Dynamic route](#dynamic-route)
    - [Nested routes](#nested-routes)
    - [Adding routes programmatically](#adding-routes-programmatically)
  - [Manipulating `<head>`](#manipulating-head)
  - [App-level enhancement](#app-level-enhancement)
  - [Development server](#development-server)
    - [Use proxy](#use-proxy)
    - [Customize dev server](#customize-dev-server)
  - [Plugins](#plugins)
    - [Use a plugin](#use-a-plugin)
    - [Write a plugin](#write-a-plugin)
- [Recipes](#recipes)
  - [Writing client-only code](#writing-client-only-code)
    - [Client-only components](#client-only-components)
    - [Client-only logic](#client-only-logic)
  - [Adding a progress bar](#adding-a-progress-bar)
  - [Progressive web app](#progressive-web-app)
  - [Google analytics](#google-analytics)
- [FAQ](#faq)
  - [How does it compare to Nuxt.js/VuePress/Peco?](#how-does-it-compare-to-nuxtjsvuepresspeco)
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

_By default it uses `.` as base directory, to use another directory you can change it to `saber dev path/to/directory` and `saber build path/to/directory`._

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
- Static files inside `./static` are mapped to `/`

### Transforms

Most common transforms and transpilers are supported out-of-the-box.

- `postcss`: Enabled when you have a postcss config file like `postcss.config.js`
- `babel`: Enabled by default with a sensible [default preset](./lib/babel/preset.js), you can override it by populating a babel config file at project root.
- `sass` `scss` `less` `stylus`: Supported by default but you need to install relevant dependencies, e.g. for `sass` you need to install `node-sass` and `sass-loader` in your project.
- `pug`: Support `pug` lang in Vue SFC, you need to install `pug` and `pug-plain-loader` in your project.
- Images and fonts.

#### Customize babel config

You can populate a babel config file at your project root, like `.babelrc.js`:

```js
module.exports = {
  presets: [
    // It's highly recommended to add our default preset
    require.resolve('saber/babel')
  ]
}
```

Check out our [default babel preset](./lib/babel/preset.js).

#### Customize webpack config

You can always customize webpack config if you want. Inside the `saber.config.js`, use the `chainWebpack` option:

```js
module.exports = {
  chainWebpack(config, { type }) {
    // config: webpack-chain instance
    // type: either `client` or `server`
  }
}
```

Check out the docs for [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain).

### Serve static files

Files inside `./static` folder will be mapped to root path `/`, e.g. `./static/favicon.ico` is served at `/favicon.ico`.

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

### Routing

`.vue` components inside `./pages` directory will be automatically loaded as route components, e.g. `./pages/index.vue` is used for `/`, `./pages/user/[user].vue` is used for `/user/:user`.

Note that all files and directories starting with an underscore `_` will be ignored.

#### Dynamic route

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

#### Nested routes

To generate [nested routes](https://router.vuejs.org/en/essentials/nested-routes.html), try following structure:

```bash
└── pages
    ├── index.vue
    ├── users
    │   ├── [name].vue
    │   └── index.vue # required
    └── users.vue     # required
```

It generates routes as follows:

```js
[
  {
    path: '/',
    component: () => import('#pages/index.vue')
  },
  {
    path: '/users',
    children: [
      {
        path: ':name',
        component: () => import('#pages/users/[name].vue')
      },
      {
        path: '',
        component: () => import('#pages/users/index.vue')
      }
    ],

    component: () => import('#pages/users.vue')
  }
]
```

Components inside `./users` directory will only be used as child routes when there're both `./users/index.vue` and `./users.vue`.

#### Adding routes programmatically

You can use `router.addRoutes` to add routes programmatically, the `router` is a vue-router instance:

📝 __saber.app.js__:

```js
export default ({ router }) => {
  router.addRoutes([
    {
      path: '/user',
      // Don't put components inside ./pages folder
      // Since they will be automatically loaded as routes
      component: () => import('./views/user.vue')
    }
  ])
}
```

Read more about [saber.app.js](#app-level-enhancement).

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

### Development server

#### Use proxy

Inside the saber.config.js, use the `proxy` option:

```js
module.exports = {
  proxy: {
    "/api": {
      target: "http://localhost:3000",
      pathRewrite: {'^/api' : ''}
    }
  }
}
```

#### Customize dev server

Inside the `saber.config.js`, use the `configureServer` option:

```js
module.exports = {
  configureServer(app) {
    // app: Express instance
  }
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

## Recipes

### Writing client-only code

#### Client-only components

Wrap non SSR friendly components inside `<client-only>` component:

```vue
<template>
  <div>
    <client-only>
      <some-client-only-component />
    </client-only>
  </div>
</template>
```

#### Client-only logic

Using `process.browser` for client-only logic:

```js
if (process.browser) {
  console.log('you see me on the client-side only')
}
```

### Adding a progress bar

Populate a `saber.app.js` in project root:

```js
// Don't forget to install `nprogress`
import progress from 'nprogress'
import 'nprogress/nprogress.css'

export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    progress.start()
    next()
  })

  router.afterEach(() => {
    progress.done()
  })
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

## FAQ

### How does it compare to Nuxt.js/VuePress/Peco?

See [#1](https://github.com/egoist/saber.js/issues/1).

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

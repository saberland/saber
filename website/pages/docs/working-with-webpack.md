---
title: Working with Webpack
layout: docs
---

## Simple Configuration

The easiest way to tweak the webpack configuration is using the [`getWebpackConfig`](saber-instance.md#getwebpackconfig) hook in your [`saber-node.js`](node-apis.md) like this:

```js
exports.getWebpackConfig = function(config, { type }) {
  // e.g. Adding a webpack plugin
  config.plugins.push(new SomeWebpackPlugin())

  // `type` is either `client` or `server`
  if (type === 'client') {
    config.plugins.push(new SomeWebpackPluginForClientBuild())
  }

  // You must return the `config`!
  return config
}
```

## Advanced Configuration

You can use [webpack-chain](https://github.com/neutrinojs/webpack-chain) to tweak webpack configuration in a more predictable way.

> webpack's core configuration is based on creating and modifying a potentially unwieldy JavaScript object. While this is OK for configurations on individual projects, trying to share these objects across projects and make subsequent modifications gets messy, as you need to have a deep understanding of the underlying object structure to make those changes.
>
> webpack-chain attempts to improve this process by providing a chainable or fluent API for creating and modifying webpack configurations. Key portions of the API can be referenced by user-specified names, which helps to standardize how to modify a configuration across projects.

Using the [chainWebpack](saber-instance.md#chainwebpack) hook in [`saber-node.js`](node-apis.md) to access the webpack-chain instance:

```js
exports.chainWebpack = function(chain) {
  // e.g. Resolve .css files
  chain.resolve.extensions.add('.css')
}
```

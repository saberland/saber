---
title: Plugin API
layout: docs
---

Export `name` and `apply` in a file to use it as a plugin:

```js
// my-plugin.js
exports.name = 'my-plugin'

exports.apply = (api, pluginOptions) => {
  // Do something with `api`
}
```

The `api` is basically a [Saber Instance](./saber-instance.md).

---
title: Saber Instance
layout: docs
---

## pages

An instance of the `Pages` class, it's used to store `page` ([PageInterface](./page-interface.md)).

```ts
interface Pages extends Map<id, PageInterface> {
  // ...
}
```

### `pages.createPage(page)`

- Params:
  - `page`: `PageInterface`
- Returns: `void`

Create a new page or overwrite the existing page.

### `pages.getPagePublicFields(id)`

- Params:
  - `id`: `string` `PageInterface` A page ID or the page object.
- Returns: `Omit<PageInterface, 'internal' | 'content'> | undefined`

Get a page with its public fields only.

Currently we only exclude `internal` and `content` properties.

### `pages.removeWhere(condition)`

- Params: 
  - `condition`: `(page: PageInterface) => boolean)`
- Returns: `void`

Remove pages that match the given `condition`.

### `pages.extendPageProp(id, obj)`

- Params:
  - `id`: `string` Page ID.
  - `obj`: `any` An object to be merged by the `page` prop.
- Returns: `void`

Extend the `page` prop on your layout/page component.

By default `page` prop is just the PageInterface.

It's not recommended to mutate `page` directly to add new properties.

### `pages.createRedirect(config)`

- Params:
  - `config`: `RedirectConfig`
- Returns: `void`

`RedirectConfig` properties:

|Property|Type|Default|Description|
|---|---|---|---|
|`fromPath`|`string`|N/A|Any valid URL. Must start with a forward slash|
|`toPath`|`string`|N/A|Any valid URL. Must start with a forward slash|
|`isPermanent`|`boolean`|`false`|This is a permanent redirect; defaults to temporary|
|`redirectInBrowser`|`boolean`|`false`|Redirects are generally for redirecting legacy URLs to their new configuration. If you can’t update your UI for some reason, set `redirectInBrowser` to `true` and Saber will handle redirecting in the client as well.`

## hooks

Hooks are also known as the [Saber Nodes APIs](./node-apis.md), you can use hooks in a plugin like this:

```js
api.hooks.chainWebpack.tap('disable-sourcemap', config => {
  config.devtool(false)
})
```

This is equivalent to following code in `saber-node.js`:

```js
exports.chainWebpack = config => {
  config.devtool(false)
}
```

Hooks are [Tapable](https://github.com/webpack/tapable) instances.

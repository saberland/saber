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

### `pages.getMatchedLocalePath(permalink)`

- Params:
  - `permalink`: `string`
- Returns: `string`

Get matched locale path, for example if you have following Saber config:

```yaml
locales:
  /cn:
    lang: zh
    title: 我的网站
```

```js
pages.getMatchedLocalePath('/about')
//=> '/'

pages.getMatchedLocalePath('/cn/about')
//=> '/cn'
```

## hooks

Hooks are called during Saber's build process. When developing a plugin for Saber, you might want to know where each hook is called. To learn this, search for `hooks.<hook name>.call` across the Saber source.

The following lifecycle hooks are exposed by the `api` and can be accessed as such:

```js
api.hooks.someHook.tap('MyPlugin', (...params) => {
  // Do something
})
```

Depending on the hook type, `tapAsync` and `tapPromise` may also be available. Hooks are [Tapable](https://github.com/webpack/tapable) instances.

### `filterPlugins`

- Hook Type: `SyncWaterfallHook`
- Params:
  - `plugins`: `Plugin[]`

Called to filter plugins.

```ts
interface Plugin {
  name: string
  apply: (api: SaberInstance, options?: any) => void
  options?: any
}
```

### `afterPlugins`

- Hook Type: `SyncHook`

Called after the `apply` methods of all plugins are executed.

### `initPages`

- Hook Type: `AsyncSeriesHook`

Called before starting creating pages for the first time.

### `onCreatePage`

- Hook Type: `AsyncSeriesHook`
- Params:
  - `page`: `PageInterface`

Called after creating a page.

### `chainMarkdown`

- Hook Type: `SyncHook`
- Params:
  - `config`: `MarkdownItChain`

Called when creating a page to get the plugins and options for `markdown-it`.

### `onCreatePages`

- Hook Type: `AsyncSeriesHook`

Called after creating all pages.

### `beforeRun`

- Hook Type: `AsyncSeriesHook`

Called before emitting the routes file for the first time.

### `emitRoutes`

- Hook Type: `AsyncSeriesHook`

Called after emitting the routes file.

### `chainWebpack`

- Hook Type: `SyncHook`
- Params:
  - `config`: `WebpackChain`
  - `opts`: `{ type: 'client' | 'server' }`

Called to get the webpack config before creating webpack compiler.

### `onCreateServer`

- Hook Type: `SyncHook`
- Params:
  - `server`: `PolkaInstance`

Called after creating the server.

### `getDocumentData`

- Hook Type: `SyncWaterfallHook`
- Params:
  - `documentData`: `DocumentData`
  - `context`: SSR context.

Called to get the document data.

### `getDocument`

- Hook Type: `SyncWaterfallHook`
- Params:
  - `document`: `string`
  - `context`: SSR context.

Called to get the document html.

### `afterBuild`

- Hook Type: `AsyncSeriesHook`

Called after running webpack (in production mode).

### `beforeExportPage`

- Hook Type: `AsyncSeriesHook`
- Params:
  - `context`: SSR context.
  - `exportedPage`: `ExportedPage`

Called before exporting a page to static HTML file.

```ts
interface ExportedPage {
  // Output file content
  content: string
  // Output file path
  path: string
}
```

### `afterExportPage`

- Hook Type: `AsyncSeriesHook`
- Params:
  - `context`: SSR context.
  - `exportedPage`: `ExportedPage`

Called after exporting a page to static HTML file.

### `afterGenerate`

- Hook Type: `AsyncSeriesHook`

Called after generating static HTML files (in production mode).


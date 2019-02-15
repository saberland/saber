---
title: Saber Config
layout: docs
---

You can use `saber-config.yml`, `saber-config.toml`, `saber-config.js` or `saber-config.json` for general configurations. All the possible config keys will be listed below.

Note that during development, some of the changes made in the config file will NOT trigger rebuild, you need to manually restart the dev server.

## theme

- Type: `string`
- Need Restarting: YES

The path to your theme or a npm package name (`saber-theme-` prefix is optional).

## siteConfig

- Type: `object`
- Need Restarting: NO

This option is used for configuring the basic information of your website, e.g. `siteConfig.title` and `siteConfig.description`, these can be used in your pages and theme like this:

```js
import { siteConfig } from 'saber-config'
```

Note: `saber-config` is not a real npm package, it's just an alias to a temporary file that exposes `siteConfig` from your config file.

## themeConfig

- Type: `object`
- Need Restarting: NO

This option will also be exposed in `saber-config`:

```js
import { themeConfig } from 'saber-config'
```

For reusuablity, a theme should use this option for customization instead of hard-coding everything in the theme itself.

## plugins

- Type: `Array<Plugin>`
- Need Restarting: YES

Use a set of Saber plugins:

```typescript
type Plugin =
  | string
  | {
      /** The path to your plugin or an npm package name */
      resolve: string
      /** Plugin options */
      options?: object
    }
```

## markdown

- Need Restarting: YES

Customizing the internal markdown parser.

### markdown.slugify

- Type: `string`
- Examples: `limax` `./my-slugify-utility`

The path to a module or npm package name that slugifies the markdown headers. The module should have following signature:

```typescript
type Slugify = (header: string) => string
```

You can use the [limax](https://github.com/lovell/limax) which provides CJK support.

### markdown.highlighter

- Type: `string`
- Example: `saber-highlighter-prism`

The path to a module or npm package name that highlights code blocks in markdown. `saber-highlighter-` prefix is optional.

Note that a highlighter will only tokenize the code, you need to add corresponding CSS yourself.

### markdown.options

- Type: `object`

Options for [markdown-it](https://github.com/markdown-it/markdown-it).

### markdown.plugins

- Type: `Array<MarkdownPlugin>`

Plugins for [markdown-it](https://github.com/markdown-it/markdown-it):

```typescript
interface MarkdownPlugin {
  // A package name or relative path
  // e.g. markdown-it-footnote
  resolve: string
  options?: object
}
```

## permalinks

- Type: `Permalinks` `(page: Page) => Permalinks`
- Default: `/:posts/:slug.html` for posts, `/:slug.html` for other pages
- Need Restarting: YES

The template that is used to generate permalink for each page.

```typescript
interface Permalinks {
  [pageType: string]: string
}
```

Note that the permalink for the homepage is always `/`.

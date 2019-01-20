---
title: Config
---

You can use `saber-config.yml` `saber-config.toml` `saber-config.js` `saber-config.json` for general configurations. All the possible config keys will be listed below.

## theme

- Type: `string`

The path to your theme or a npm package name (`saber-theme-` prefix is optional).

## siteConfig

- Type: `object`

This option is used for configuring basic information of your website, e.g. `siteConfig.title` and `siteConfig.description`, you can use them later in your pages and theme like this:

```js
import { siteConfig } from 'saber-config'
```

`saber-config` is not a real npm package, it's just an alias to a temporary file that exposes `siteConfig` from your config file.

## themeConfig

- Type: `object`

This option will also be exposed in `saber-config`:

```js
import { themeConfig } from 'saber-config'
```

For reusuablity, a theme should use this option for customization instead of hard-coding everything in the theme itself.

## plugins

- Type: `Array<Plugin>`

Use a set of Saber plugins:

```typescript
type Plugin =
  | string
  | {
      /** The path to your plugin or a npm package name */
      resolve: string
      /** Plugin options */
      options?: object
    }
```

## markdown

Customizing the internal markdown parse.

### markdown.slugify

- Type: `string`
- Examples: `limax` `./my-slugify-utility`

The path to a module or npm package name that slugifies the markdown headers. The module should have following signature:

```typescriot
type Slugify = (header: string) => string
```

You can use the [limax](https://github.com/lovell/limax) which provides CJK support.

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

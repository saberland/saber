---
title: Plugin API
layout: docs
---

A plugin is an object which has following properties.

## Plugin Interface

### name

- Type: `string`
- Required: `true`

Required property, the plugin name.

### apply

- Type: `(api: SaberInstance, options: any) => void`
- Required: `true`

A function to invoke.

### filterPlugins

- Type: `FilterPlugins`
- Required: `false`

Filter the plugins, you can use it to add or remove plugins.

```ts
type FilterPlugins = (plugins: Plugin[], options: any) => Plugins[]

interface Plugin {
  /* Plugin name */
  name: string
  apply: (api: SaberInstance, options?: any) => void
  filterPlugins: FilterPlugins
  /* Plugin options */
  options?: any
  /* The path to the plugin, only used in logs */
  location?: string
}
```

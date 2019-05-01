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

- Type: `(plugins: Plugins[], options: any) => Plugins[]`
- Required: `false`

Filter the plugins, you can use it to add or remove plugins.

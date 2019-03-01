---
title: Theming
layout: docs
---

Themes are used to share [layouts](./layouts.md) and [saber-browser.js](./browser-apis.md) with others.

If you want to use a custom theme you can simply set it in config file like this `saber-config.yml`:

```yaml
theme: ./src
# or from a npm package
# call `saber-theme-simple`:
theme: simple
```

Theme layouts are populated under `$theme/layouts` directory, layouts in `$projectRoot/layouts` will still work and take higher priority.

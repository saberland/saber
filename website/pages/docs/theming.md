---
title: Theming
layout: docs
---

Themes are used to manage layouts and Saber's browser APIs and Node.js APIs.

By default Saber uses a built-in theme, if you want to use a custom theme you can simply set it in config file like this `saber-config.yml`:

```yaml
theme: ./src
# or from a npm package
# call `saber-theme-simple`:
theme: simple
```

Theme layouts are populated under `$theme/layouts` directory, layouts in `$projectRoot/layouts` takes higher priority.

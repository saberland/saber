---
title: Themes
layout: docs
---

It's easy to create a theme, you just have to create a new folder. To start using your theme,modify the `theme` setting in your site's `saber-config.yml`:

```yaml
theme: ./src
# or from a npm package
# call `saber-theme-simple`:
theme: simple
```

A theme should have following folder structure:

```bash
.
├── saber-browser.js # optional
├── saber-node.js    # optional
└── layouts          # required
```

Theme layouts are populated under `$theme/layouts` directory and this directory is required, layouts in `$projectRoot/layouts` will still work and take higher priority.

There are already a number of themes available for you to play with. If you decide to make your own theme, feel free to create a pull request adding it [here](https://github.com/egoist/saber/edit/master/website/pages/docs/themes.md)!

- [Minima](https://github.com/egoist/saber-theme-minima) - port of the default Jekyll theme by [egoist](https://github.com/egoist)
- [Tailsaw](https://github.com/krmax44/saber-theme-tailsaw) - port of the Jigsaw starter theme by [krmax44](https://github.com/krmax44)

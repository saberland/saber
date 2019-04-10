---
title: CSS Preprocessors
layout: docs
---

CSS pre-processors like Sass, SCSS, Less and Stylus are still popular today, so it's natual that Saber supports them out of the box. However relevant dependencies for transpilation are required, be sure to follow the installation instructions below.

## Sass / SCSS

```bash
yarn add sass-loader sass --dev
```

Then you can import `.scss` and `.sass` files. If you want to import files from `node_modules`, make sure to add `~` prefix as follows:

```scss
// importing a css file from the nprogress node module
@import '~nprogress/nprogress'; 
```

## Less

```bash
yarn add less-loader less --dev
```

## Stylus

```bash
yarn add stylus-loader stylus --dev
```

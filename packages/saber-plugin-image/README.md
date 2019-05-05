# saber-plugin-images

Allows the generation of responsive images, lazy-loading and all that good stuff.

## Install

```bash
yarn add saber-plugin-images
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-images
    options:
      sizes:
        - 1000
        - 800
        - 500
      placeholder: true
      blendIn: true
```

Use it!

```html
<saber-image
  src="./waifu.jpg"
  :lazy="{
    placeholder: true,
    lazyLoad: true,
    blendIn: true
  }"
/>
```

## Options

These options can be passed either in the Saber configuration or to each `<saber-image>` individually by using the `lazy` prop. The Saber configuration additionally accepts the [Vue Lazyload constructor](https://github.com/hilongjw/vue-lazyload#constructor-options) and [Responsive loader](https://github.com/herrstucki/responsive-loader) options.

| key           | description                                                                            | default | options   |
| ------------- | -------------------------------------------------------------------------------------- | ------- | --------- |
| `lazyLoad`    | Turn lazy loading off or on.                                                           | `true`  | `Boolean` |
| `placeholder` | Display a generated placeholder while the image is loading.                            | `true`  | `Boolean` |
| `blendIn`     | Requires `placeholder` to be enabled. Smoothly blends in the loaded image once loaded. | `true`  | `Boolean` |

## License

MIT.

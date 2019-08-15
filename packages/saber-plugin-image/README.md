# saber-plugin-image

Allows the generation of responsive images (`srcset` included), lazy-loading and all that good stuff.

## Install

```bash
yarn add saber-plugin-image
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-image
    options:
      sizes:
        - 1000
        - 800
        - 500
      placeholder: true
      blendIn: true
```

Use it, either in Vue or Markdown!

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

Please note that responsive image generation only works with local images. You can use `<saber-image>` with non-local images to get lazy-loading though.

## Options

These options can be passed either in the plugin options or to each `<saber-image>` individually by using the `lazy` prop. The plugin options additionally accepts all [Responsive loader](https://github.com/herrstucki/responsive-loader) options.

| Key              | Description                                                                                                                                                    | Default                | Type             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------- |
| `lazyLoad`       | Turn lazy loading off or on.                                                                                                                                   | `true`                 | `Boolean`        |
| `placeholder`    | Requires `lazyLoad` to be enabled. Display a generated placeholder while the image is loading.                                                                 | `true`                 | `Boolean`        |
| `blendIn`        | Requires `placeholder` to be enabled. Smoothly blends in the loaded image once loaded.                                                                         | `true`                 | `Boolean`        |
| `markdownImages` | Transforms `![Markdown](./images.png)` into `<saber-image>`. You can pass options via the query-string, e. g. `image.png?blendIn=true&sizes[]=100,sizes[]=200` | `true`                 | `Boolean`        |
| `quality`        | JPEG compression quality.                                                                                                                                      | `85`                   | `Integer`        |
| `sizes`          | Images will be downscaled to the specified widths.                                                                                                             | _original image width_ | `Array<Integer>` |

If you don't like the `blendIn` loading transition, you can create your own ones, like this fade-in transition:

```css
img {
  transition: opacity 0.5s;
}

img[data-src],
img[data-srcset] {
  opacity: 0;
}

img[data-lazy-loaded] {
  opacity: 1;
}
```

## License

MIT.

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
```

All loader options can be found [here](https://github.com/herrstucki/responsive-loader#options).

As Saber currently does not allow plugins to add Vue components, you'll need to add the following to your `saber-browser.js`:

```js
import SaberImage from 'saber-plugin-images/SaberImage'

export default ({ Vue }) => {
  Vue.use(SaberImage, {
    error: require('./images/error.png')
  })
}
```

Use it!

```html
<s-image
  src="./waifu.jpg"
  :lazy="{
    placeholder: true,
    lazyLoad: true
  }"
/>
```

## SaberImage options

These options can be passed to either `Vue.use(SaberImage, options)` or to each `<s-image>` individually by using the `lazy` prop. With `Vue.use()`, you can also pass the [Vue Lazyload constructor options](https://github.com/hilongjw/vue-lazyload#constructor-options).

| key           | description                                                                                                                                                                                                                                                                     | default | options   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------- |
| `lazyLoad`    | Turn lazy loading off or on.                                                                                                                                                                                                                                                    | `true`  | `Boolean` |
| `placeholder` | Display a generated placeholder while the imagae is loading. Either in the loader options, `placeholder` needs to be enabled as well or a custom placeholder image needs to be provided via the `lazy` attribute with the `<s-image>` component or in the Vue Lazyload options. | `true`  | `Boolean` |

## License

MIT.

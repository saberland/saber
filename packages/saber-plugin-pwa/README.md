# saber-plugin-pwa

Add PWA (progressive web app) support to your Saber app.

## Install

```bash
yarn add saber-plugin-pwa
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-pwa
```

## Options

### notifyUpdates

- Type: `boolean`
- Default: `true`

Pop up an update notifier when a new update for your app if available.

You can disable this with `notifyUpdates: false` and use your custom update notifier in `saber-browser.js`:

```js
// `workbox` is injected by this plugin
export default ({ workbox }) => {
  if (process.browser && workbox) {
    workbox.addEventListener('installed', event => {
      if (!event.isUpdate) {
        showUpdateNotifier({
          message: 'Ready for offline use'
        })
      }
    })

    workbox.addEventListener('waiting', () => {
      showUpdateNotifier({
        message: 'An update is ready, click to apply',
        clicked() {
          workbox.addEventListener('controlling', event => {
            window.location.reload()
          })

          workbox.messageSW({ type: 'SKIP_WAITING' })
        }
      })
    })
  }
}
```

Then just implement your own `showUpdateNotifier` function. Check out [workbox-window](https://developers.google.com/web/tools/workbox/modules/workbox-window) for the details of the `workbox` object.

### generateSWOptions

- Type: `object`

Options for the [generateSW](https://developers.google.com/web/tools/workbox/modules/workbox-build#generatesw_mode) API from workbox-build.

## License

MIT.

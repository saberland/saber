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

Then you need to create a set of icons in `static` folder to make your app installable, for example:

- `img/icons/icon_128x128.png`
- `img/icons/icon_256x256.png`
- `img/icons/icon_512x512.png`

And create `static/manifest.json` to include these icons:

```json
{
  "icons": [
    {
      "src": "img/icons/icon_128x128.png",
      "type": "image/png",
      "sizes": "128x128"
    },
    {
      "src": "img/icons/icon_256x256.png",
      "type": "image/png",
      "sizes": "256x256"
    },
    {
      "src": "img/icons/icon_512x512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ]
}
```

You don't need to worry about other options in `manifest.json`, this plugin will set default values for them.

Now run `saber build` and you will get a PWA-ready web app in `public` folder.

### Configure the Text for the Update Notifier

Use `siteConfig` in your Saber config file to configure the text:

```yaml
siteConfig:
  # Default values:
  pwaFirstTimeInstallMessage: Ready for offline use
  pwaUpdateFoundMessage: Downloading app updates in the background..
  pwaUpdateReadyMessage: A new version of this app is available
  pwaUpdateButtonMessage: UPDATE
  pwaDismissMessage: DISMISS
```

### Remove Service Worker

If you no longer need this plugin in your website, you should first uninstall this plugin and remove it from your `saber-config.yml`:

```diff
plugins:
-  - resolve: saber-plugin-pwa
```

Then populate a `static/service-worker.js` file as follows:

```js
self.addEventListener('install', function(e) {
  self.skipWaiting()
})

self.addEventListener('activate', function(e) {
  self.registration
    .unregister()
    .then(function() {
      return self.clients.matchAll()
    })
    .then(function(clients) {
      clients.forEach(client => client.navigate(client.url))
    })
})
```

The snippet tells your browser to remove previsously installed service worker and refresh.

## Options

### name

- Type: `string`
- Default: `siteConfig.title | 'Saber PWA App'`

The name for your PWA. You can also directly configure the `name` in your `manifest.json` to override this.

### themeColor

- Type: `string`
- Default: `#ffffff`

The theme color for your PWA. You can also directly configure the `theme_color` in your `manifest.json` to override this.

### assetsVersion

- Type: `string`
- Default: `''`

This option is used if you need to add a version to your `manifest.json`, against browser’s cache. This will append `?v=assetsVersion` to the URL of the manifest.

### appleTouchIcon

- Type: `string`

The URL to the apple touch icon, for example `img/icons/apple-touch-icon-152x152.png`, used by iOS devices. When this is not set we automatically use `icons` from your `manifest.json`.

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

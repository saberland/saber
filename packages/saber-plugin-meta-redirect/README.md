# saber-plugin-meta-redirect

Generates `<meta>` redirect html files for redirecting on any static file host.

## Install

```bash
yarn add saber-plugin-meta-redirect
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-meta-redirect
```

In your `saber-node.js`:

```js
exports.onCreatePages = function ()
  this.pages.createRedirect({
    fromPath: '/about',
    to: '/about-us'
  })
}
```

## License

MIT.

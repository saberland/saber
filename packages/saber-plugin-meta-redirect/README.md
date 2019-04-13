# saber-plugin-meta-redirect

Redirect routes

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

In your `saber-browser.js`:

```js
export default ({ createRedirect }) => {
  createRedirect({
    fromPath: '/about',
    to: '/about-us'
  })
}
```

## License

MIT.
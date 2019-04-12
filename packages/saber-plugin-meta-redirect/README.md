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

```
export default ({ addRedirect }) => {
  addRedirect({
      from: '/about',
      to: '/about-us'
    })
}
```

To pass more routes use an array

```
export default ({ addRedirect }) => {
  addRedirect([
    {
      from: '/originalRouteA',
      to: '/newRouteA'
    },
    {
      from: '/originalRouteB',
      to: '/newRouteB'
    }
  ])
}
```

## License

MIT.

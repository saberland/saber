# saber-plugin-netlify-redirect

Generates `_redirects` file for redirecting '/:page' to '/:page.html' and redirecting routes set with `pages.createRedirect` in `saber-node.js` on Netlify.

## Install

```bash
yarn add saber-plugin-netlify-redirect
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-netlify-redirect
```

## License

MIT.

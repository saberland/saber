# saber-plugin-prismjs

## How to use

Install this package:

```bash
yarn add prismjs saber-plugin-prismjs saber-highlight-css
```

<small><i>Note that saber-highlight-css is required for line highlighting to display properly.</i></small>

Use it in your `saber-config.yml`:

```yaml
plugins:
  - resolve: saber-plugin-prismjs
```

### Include CSS

In your `saber-browser.js`:

```js
import 'prismjs/themes/prism.css'
```

Optional: Include `saber-highlight-css` for line highlighting styles:

```bash
yarn add saber-highlight-css
```

```js
// saber-browser.js
import 'prismjs/themes/prism.css'
import 'saber-highlight-css/default.css'
```

## License

MIT &copy; EGOIST

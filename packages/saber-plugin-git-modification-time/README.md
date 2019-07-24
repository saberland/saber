# saber-plugin-git-modification-time

> Use the author time of the last commit as `page.updatedAt`

Why? See [#9785](https://github.com/gatsbyjs/gatsby/issues/9785).

**tl;dr** `page.updatedAt` defaults to `file.mtime` which will change on platforms like Netlify. We restore the value to author time of the last commit instead.

## Install

```bash
yarn add saber-plugin-git-modification-time
```

## Usage

In your `saber-config.js`:

```js
module.exports = {
  plugins: ['saber-plugin-git-modification-time']
}
```

## License

MIT.

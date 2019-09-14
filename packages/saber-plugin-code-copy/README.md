# saber-plugin-code-copy

Copy code to clipboard.

## Install

```bash
yarn add saber-plugin-code-copy
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-code-copy
```

## Options

### statusAttribute

- Type: `string`
- Default: `title`

By default the `title` attribute of the button is set to `Copy`, when code is copied we update it to `Copied`, you can specify another attribute name if you want, e.g. `aria-label`.

### buttonStyle

- Type: `object`
- Default: `undefined`

Assign custom style to the _Copy_ button, e.g.:

```js
{
  backgroundColor: 'red'
}
```

## License

MIT.

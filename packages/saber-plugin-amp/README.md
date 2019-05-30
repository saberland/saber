# saber-plugin-amp

Generate AMP-only pages and Hybrid pages.

## Install

```bash
yarn add saber-plugin-amp
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-amp
```

In page attributes set `amp: true` to generate an optimized AMP page or `amp: 'hybrid'` to generate an invalid optimized AMP page with client-side Saber runtime and a valid optimized AMP page

## License

MIT.

# saber-plugin-google-analytics

Add Google Analytics to your Saber sites.

## Install

```bash
yarn add saber-plugin-google-analytics
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-google-analytics
    options:
      trackID: UA-XXX-XX # Google Analytics Track ID
```

## Plugin Options

### trackID

- Type: `string`
- Required: `true`

Google Analytics Track ID.

### anonymizeIp

- Type: `boolean`
- Default: `false`

To anonymize the IP address for all hits sent from a single tracker, set the `anonymizeIp` option to `true`.

## License

MIT.

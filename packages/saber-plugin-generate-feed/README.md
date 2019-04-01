# saber-plugin-generate-feed

Generate feed in Atom 1.0 or RSS 2.0 or JSON format.

## Install

```bash
yarn add saber-plugin-generate-feed
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-generate-feed
    options:
      # Generate atom.xml
      atomFeed: true
      # Generate rss2.xml
      rss2Feed: true
      # Generate feed.json
      jsonFeed: true
```

### Saber Variables

This plugin will also inject some useful Saber variables you can use at runtime:

```js
import variables from 'saber/variables'

variables.feedLinks
// { rss2?: string, json?: string, atom?: string }

variables.feedLink
// The link to preferred feed
// Atom > RSS2 > JSON

variables.feedLinkType
// The type of `variables.feedLink`
// `atom | rss2 | json`
```

### Configure Feed Author

In your `saber-config.yml`:

```yml
siteConfig:
  author: Your Name # Optional
  url: https://example.com # Required
  email: you@email.com # Optional
```

## Options

### atomFeed

- Type: `string` `boolean`
- Default: `undefined`

The output path of the Atom feed, when `true` it outputs to `atom.xml`.

### rss2Feed

- Type: `string` `boolean`
- Default: `undefined`

The output path of the RSS2 feed, when `true` it outputs to `rss2.xml`.

### jsonFeed

- Type: `string` `boolean`
- Default: `undefined`

The output path of the JSON feed, when `true` it outputs to `feed.json`.

### limit

- Type: `number`
- Default: `30`

The maximum amount of posts to include in the feed.

## License

MIT.

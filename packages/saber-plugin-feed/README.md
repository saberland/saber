# saber-plugin-feed

Generate feed in Atom 1.0 or RSS 2.0 or JSON format.

## Install

```bash
yarn add saber-plugin-feed
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-feed
    options:
      # Generate atom.xml
      atomFeed: true
      # Generate rss2.xml
      rss2Feed: true
      # Generate feed.json
      jsonFeed: true
```

### Get Feed Links in Component

This plugin will also inject feed links as Vue computed property:

```js
// Recommended feed, atom > rss2 > json
this.$feed
// { permalink: string, type: 'atom' | 'rss2' | 'json' }

this.$allFeeds
// { rss2?: string, json?: string, atom?: string }
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

### copyright

- Type: `string`
- Default: `All rights reserved`

The copyright info in the feed.

## License

MIT.

---
title: Troubleshooting
layout: docs
---

## Duplicated `<meta>` tags

By default Saber sets some `head` tags for you if certain configurations are found in your config file, for example we set `<meta name="description" content="...">` when `siteConfig.description` is set in your config file.

To override the default tag, use the `hid` option:

```js
export default {
  head: {
    meta: [
      {
        name: 'description',
        content: '...my description'.
        // ⬇️ Here 
        hid: 'description'
      }
    ]
  }
}
```

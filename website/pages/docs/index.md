---
title: Introduction
---

Saber is still __in development__. Do __not__ use it for production. It is missing major features and the interface should be considered extremely unstable.

If you're feeling adventurous, though, read ahead...

---

Saber (or Saber.js) is a static website generator, it is like Hexo but you can use Vue, React or other view layers* to write layouts, Saber will also generate a universal website* out-of-the-box.

<sup>*Vue, React or other view layers: Currently only Vue is officially supported</sup><br>
<sup>*universal website: it means the same code is used for both generating static HTML at compile time and client interactions in browser.</sup>

## Compare to Hexo

Hexo's layout system uses string-based template engines like ejs, pug et al. If you want client-side interactions, you need to create addtional JavaScript files and references them in your layouts, which is pretty much the old way of building websites, which is good if that's all you need.

Saber's layout system uses Vue.js by default, layouts will be used to generate two bundles (server bundle and client bundle), the server bundle will be used to generate static HTML at build time, and the client bundle will be used for client-side interactions, once the page is loaded on client-side, the client bundle will take over it to "hydrate" the static markup and make it interactive. (hence universal)

## Quick Start

Create a blog with a single command:

```bash
npm init blog my-blog
```

## Config File

You can use `saber-config.yml` `saber-config.toml` `saber-config.json` `saber-config.js` as config file.

---
title: Introduction
layout: docs
---

Saber is still **in development**. Do **not** use it for production. It is missing major features and the interface should be considered extremely unstable.

If you're feeling adventurous, though, read ahead...

---

Saber (or Saber.js) is a static website generator, it is like Hexo but, you can use Vue, React or other view layers* to write layouts, Saber will also generate a universal website* out-of-the-box.

<sup>*Vue, React or other view layers: Currently only Vue is officially supported</sup><br>
<sup>*universal website: this means the same code is used for both generating static HTML at compile time and for client interactions in browser.</sup>

## Compared to Hexo

Hexo's layout system uses string-based template engines like ejs, pug et al. If you want client-side interactions, you need to create addtional JavaScript files and reference them in your layouts. This is pretty much the old way of building websites, which is good if that's all you need, but Saber lets you make use of more modern web frameworks.

Saber's layout system uses Vue.js by default. Layouts will be used to generate two bundles, a server bundle and a client bundle. The server bundle will be used to generate static HTML at build time, and the client bundle will be used for client-side interactions. Once the page is loaded on client-side, the client bundle will take over it to "hydrate" the static markup and make it interactive. (hence universal)

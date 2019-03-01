---
title: Public Folder
layout: docs
---

You can create `./public` folder in your project root or theme directory to serve public files. e.g. `./public/logo.png` will be served at `http://localhost:3000/logo.png`.

Then you can use it in your Markdown page:

```markdown
![my logo](/logo.png)
```

Or Vue components:

```vue
<template>
  <img src="/logo.png">
</template>
```

Notably:

- Public files are __NOT__ processed by webpack. You don't need `./public` folder if you want to use webpack to process the file, simply reference it via relative URL, e.g. `<img src="./some-image.png">`.
- If both `$projectRoot/public/logo.png` and `$theme/public/logo.png` exist, the one in theme directory will be ignored. 

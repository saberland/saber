---
title: Installation
---

## Prerequisites

Saber requires [Nodes.js 8](https://nodejs.org/en/) or above.

## Using the Starter template

If you want to kick-start a blog, you can achieve it by running a single command:

```bash
npm init blog my-blog
```

Then follow the intructions in your terminal.

## Start From Scratch

Create a new directory and install `saber`:

```bash
mkdir my-website
cd my-website
npm init -y
npm install saber
```

Configure npm scripts in `my-website/package.json` to run `saber` commands:

```json
{
  "scripts": {
    "dev": "saber",
    "build": "saber build"
  },
  "dependencies": {
    "saber": "latest"
  }
}
```

Populate your first page at `pages/index.md`:

```markdown
Hello, welcome to **my website**!
```

Now you can run `npm run dev` to develop your website locally.

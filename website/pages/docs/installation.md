---
title: Installation
layout: docs
---

## Prerequisites

Saber requires [Node.js 8](https://nodejs.org/en/) or above.

When you have Node.js installed on your machine, the `node` and `npm` commands will be available in your terminal.

Run following command to check your Node.js version:

```bash
node -v
```

## Creating a New Project from Scratch

Creating a new directory `my-site` and populate a `package.json`:

```bash
mkdir my-site
cd my-site
npm init -y
```

Install Saber with npm:

```bash
npm install saber
```

Alternatively, you can also install Saber with [Yarn](https://yarnpkg.com) which is an alternative package manager developed by Facebook:

```bash
yarn add saber
```

Make sure you have Yarn installed first.

Configure `scripts` in `package.json`:

```json
{
  "scripts": {
    "dev": "saber",
    "build": "saber build"
  }
}
```

Then you can run `npm run dev` to start the dev server, or run `npm run build` to create a production build of your app.

## Using the Generator

You can also generate a new site with just a single command:

```bash
npm init site my-site
```

Or using Yarn:

```bash
yarn create site my-site
```

Then start the dev server:

```bash
cd my-site
npm install
npm run dev
```

For more details, check out the `README.md` in `my-site/`.

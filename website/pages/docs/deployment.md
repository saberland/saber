---
title: Deployment
layout: docs
---

The command `saber build` creates a `.saber/public` directory with a production build of your app. Set up your favorite HTTP server to properly serve static `.html` files and other static assets.

## Built-in Static Server

You can use the built-in static server via the `saber serve` command, it automatically serves `.saber/public` directory:

```bash
cd my-site
yarn saber build
yarn saber serve
```

This is great for previewing the production build locally.

## Other Solutions

You don't need the built-in static server in order to server a Saber application, it works just fine with most static servers, for example you can use [`sirv-cli`](https://github.com/lukeed/sirv/tree/master/packages/sirv-cli):

```bash
npm i -g sirv-cli
sirv .saber/public
```

Or [`serve`](https://github.com/zeit/serve):

```bash
npm i -g serve
serve .saber/public
```

## Building for Relative Paths

By default, Saber produces a build assuming your app is hosted at the server root.
To override this, specify the [`build.publicUrl`](./saber-config.md#publicurl) in your Saber config file, for example:

```js
// saber.config.js
module.exports = {
  build: {
    publicUrl: '/blog/'
  }
}
```

## [Netlify](https://www.netlify.com/)

**To setup continuous delivery:**

With this setup Netlify will build and deploy when you push to git or open a pull request:

1. [Start a new netlify project](https://app.netlify.com/signup)
2. Pick your Git hosting service and select your repository
3. Click `Build your site`

Since Netlify automatically rewrites routes like `/foo` to `/foo.html` when `/foo` doesn't exist, you may need [saber-plugin-netlify-redirect](https://github.com/egoist/saber/tree/master/packages/saber-plugin-netlify-redirect) to fix this.

## [GitHub Pages](https://pages.github.com/)

### Step 1: Install `gh-pages` and add `deploy` to `scripts` in `package.json`

```bash
npm i -D gh-pages
```

Alternatively you may use `yarn`:

```bash
yarn add gh-pages --dev
```

Add the following `scripts` in your `package.json`:

```diff
  "scripts": {
+   "predeploy": "npm run build",
+   "deploy": "gh-pages -d .saber/public",
    "dev": "saber",
    "build": "saber build",
```

### Step 2: Deploy the site by running `npm run deploy`

Then run:

```bash
npm run deploy
```

### Step 3: For a project page, ensure your project’s settings use `gh-pages`

Finally, make sure GitHub Pages option in your GitHub project settings is set to use the `gh-pages` branch:

![gh-pages-setting](@/images/gh-pages-setting.png)


### Step 4: Optionally, configure the domain

You can configure a custom domain with GitHub Pages by adding a `CNAME` file to the `public/` folder.

Your `CNAME` file should look like this:

```
mywebsite.com
```

### Docker

[TODO]

PR welcome for using a docker image to build and serve your Saber application.


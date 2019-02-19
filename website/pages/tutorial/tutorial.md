---
title: 'Tutorial: Intro to Saber'
layout: tutorial
---

## Before We Start the Tutorial

We will build a simple blog in this tutorial. The techniques you’ll learn in the tutorial are fundamental to building any websites using Saber, and mastering it will give you a deep understanding on how Saber works.

### What Are We Building?

In this tutorial, we’ll show how to build a simple blog with Saber, you will also use [Vue](https://vuejs.org) to write a simple theme for it.

### Prerequisites

You should have basic knowledge about JavaScript, Vue, Vue single-file components. Vue knowledge is not enforced but it's a requirement for writing your own themes.

### Setup for the Tutorial

You need [Node.js](https://nodejs.org/en/) installed on your machine, [Yarn](https://yarnpkg.com/zh-Hans/) is our recommended package manager, you can also use Node.js's default package manager [npm](https://www.npmjs.com/) if you want.

0. Open your terminal, on Windows you can use Git Bash or Linux Sub-system.
1. Creating a new project: `mkdir my-blog`
1. Creating a `package.json`: `cd my-blog && yarn init`
1. Install Saber: `yarn add saber`

## Creating Your First Page

Try running `yarn saber` (which is a shorthand to running `./node_module/.bin/saber`) in your project, you will get a 404 page since you haven't added any pages:

<img src="./images/not-found.png" class="browser-image" alt="not found page">

Now let's create your first page `./pages/index.vue`:

```vue
<template>
  <div>
    <h1>My Blog</h1>
    <p>
      This is my lovely (not yet) homepage!
    </p>
  </div>
</template>
```

And did you notice that? You browser gets automatically reloaded to reflect the changes:

<img src="./images/first-page.png" class="browser-image" alt="first page">

It's easy right? So why not adding another page? This time we will use Markdown to create an About page, let's populate `./pages/about.md`:

```markdown
## About me

I'm a cool guy from the Mars, nice to meet you folks.
```

And it just works:

<img src="./images/about.png" class="browser-image" alt="about page">

## Adding a Navbar

Next I'd like to add a navbar to the top of our pages.

Let's create a simple `./src/components/Navbar.vue` component first:

```vue
<template>
  <nav>
    <h1>My Blog</h1>
    <ul>
      <li><saber-link to="/">Home</saber-link></li>
      <li><saber-link to="/about.html">About me</saber-link></li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  height: 30px;
  align-items: center;
  border-bottom: 3px solid #f0f0f0;
}

<!-- ... omitted some css -->
</style>
```

### Option 1: Manually Adding It to Every Page (dumb)

Let's try the dumb way first, later we'll introduce a smarter way.

In `./pages/index.vue`:

```vue {highlightLines:[3,10,14]}
<template>
  <div>
    <Navbar />
    <h1>My Blog</h1>
    <p>This is my lovely (not yet) homepage!</p>
  </div>
</template>

<script>
import Navbar from '../src/components/Navbar.vue'

export default {
  components: {
    Navbar
  }
}
</script>
```

Guess what, you can use components in Markdown files as well, in your `./pages/about.md`:

```markdown {highlightLines:[1,'7-15']}
<Navbar />

## About me

I'm a cool guy from the Mars, nice to meet you folks.

<script>
import Navbar from '../src/components/Navbar.vue'

export default {
  components: {
    Navbar
  }
}
</script>
```

Let's see it in action:

<img src="./images/navbar-dumb.gif" class="browser-image" alt="navbar" width="100%">

### Option 2: Using Layout Components (smart)

Imagine you have tens of pages and you need to repeat the above steps 10x times, it will be a disaster!

Luckily you can get over this by using layout components, a layout component will receive the page component as default slot, to use layouts you need to set the `theme` directory in Saber config file, for example we'll use `saber-config.yml` here:

```yaml
theme: ./src
```

Then you can populate layout components in the `./src/layouts` directory, here we want to create a layout named `page` to show `Navbar` component, so we populate a `./src/layouts/page.vue`:

```vue
<template>
  <div>
    <Navbar />
    <slot name="default" />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'

export default {
  components: {
    Navbar
  }
}
</script>
```

Then you need to make your pages use this layout.

In your `./pages/index.vue`:

```vue {highlightLines:['9-11']}
<template>
  <div>
    <h1>My Blog</h1>
    <p>This is my lovely (not yet) homepage!</p>
  </div>
</template>

<script>
export const attributes = {
  layout: 'page'
}

export default {}
</script>
```

In your `./pages/about.md`:

```markdown {highlightLines:[2]}
---
layout: page
---

## About me

I'm a cool guy from the Mars, nice to meet you folks.
```

The front matter in Markdown page and the `export const attributes` part are so called page attributes, it is a mechanism for the page component to communicate with its layout component and the layout system.

Nice, now you achieved the same thing without repeating yourself!

## Creating Your First Post

You can't create a blog without writing actual posts right? In Saber, posts are also pages, but they are kinda special, you need to populate them in `./pages/_posts` directory.

We'll start with the classic Hello World post, let's create `./pages/_posts/hello-world.md`:

```markdown
---
title: Hello World
date: 2019-02-22
layout: page
---

## Hello

This is my hello world post.
```

And then go to http://localhost:3000/posts/hello-world.html:

<img src="./images/hello-world.png" class="browser-image" alt="hello world">

## Showing Posts on the Homepage

By default you can access the post list via the `page` prop from homepage itself (if no layout is specified) or its layout component, you can open Vue Devtools in your browser to inspect the `page` prop:

<img src="./images/vue-devtools-page-prop.png" class="browser-image" alt="vue-devtools-page-prop">

Awesome, now let's update the `./src/layouts/page.vue` to show recent posts:

```vue {highlightLines:['5-16',27]}
<template>
  <div>
    <Navbar />
    <slot name="default" />
    <div class="recent-posts" v-if="page.posts">
      <ul>
        <li v-for="post in page.posts" :key="post.permalink">
          <h2>
            {{ formatDate(post.attributes.createdAt) }} -
            <saber-link :to="post.attributes.permalink">{{
              post.attributes.title
            }}</saber-link>
          </h2>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'

export default {
  components: {
    Navbar
  },
  props: ['page'],
  methods: {
    formatDate(v) {
      const date = new Date(v)
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    }
  }
}
</script>

<style scoped>
.recent-posts ul {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.recent-posts a {
  color: blue;
  text-decoration: none;
}
</style>
```

You can add pagination based on the `page.pagination` value if you have more posts, we only have one so it doesn't matter for now:

<img src="./images/post-list.png" class="browser-image" alt="post list">

## Adding Document Title

Everything seems to work fine now, but I just notice that our pages don't have browser tab titles, let's add a quick fix to the layout `./src/layouts/page.vue`:

```vue {highlightLines:[6,'11-16']}
<template>
  <div><!-- ..omitted --></div>
</template>

<script>
import { siteConfig } from 'saber/config'

export default {
  // ..omitted
  props: ['page']
  head() {
    const pageTitle = this.page.attributes.title
    return {
      title: pageTitle ? `${pageTitle} - ${siteConfig.title}` : siteConfig.title
    }
  }
}
</script>

<style scoped>
/* ..omitted */
</style>
```

You can use `head` option to manage tags in `<head>`, this feature is powered by [vue-meta](https://github.com/nuxt/vue-meta) which is maintained and used Nuxt.js.

Note that `siteConfig` we imported in the first highlighted line:

```js
import { siteConfig } from 'saber/config'
```

`saber/config` is pointed to a JSON file which exposes `siteConfig` and `themeConfig` properties in you Saber config file. In this case you need to add a `title` property for site title:

```yaml
siteConfig:
  title: My Blog
```

Now the browser tab will display page title properly.

## Build for Production

Run `yarn saber generate` in your project, the output website can be found at `.saber/public` directory, you can directly deploy it to GitHub pages or Netlify.

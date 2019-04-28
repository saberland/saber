---
title: Markdown Features
layout: docs
---

Saber has built-in Markdown support via [markdown-it](https://github.com/markdown-it/markdown-it), you can enjoy all [Markdown](https://daringfireball.net/linked/2014/01/08/markdown-extension) and [GFM](https://github.github.com/gfm/) features without any configurations.

## Notable Features

Not all Markdown features are documented here, we only intend to document the notable ones.

### Front Matter

Front matter is used to set page attributes:

```markdown
---
title: My Page Title
---

Markdown content goes here...
```

You can use [YAML](https://yaml.org/) syntax in the front matter.

### Excerpt

Excerpt is an optional summary or description of a page, you can set it via page attributes:

```markdown {highlightLines:[3]}
---
title: My Post
excerpt: This post is dedicated to the world
---

This is a wonderful world..
```

Alternatively, if this attribute is not set Saber will automatically use the first paragrah or everthing before `<!-- more -->` comment as the excerpt.

```markdown
---
title: My Post
---

This is a wonderful world..

Blah blah..
```

Then `page.attributes.excerpt` will be `<p>This is a wonderful world..</p>`. If you only need plain text, you can strip HTML tags with a simple regular expression: `html.replace(/<(?:.|\n)*?>/gm, '')`.

If you're using `<!-- more -->` comment, please note that only block comment is supported for now, i.e. you can't use `<!-- more -->` inside a paragraqh:

```markdown {highlightLines:[9]}
---
title: My Post
---

This is a wonderful world..

Isn't it?

<!-- more -->

Blah blah..
```


### Task List

- [Specification](https://github.github.com/gfm/#task-list-items-extension-)

Input:

```markdown
- [ ] Conquer the world
- [ ] Create a website
- [x] Install Saber
```

Output:

- [ ] Conquer the world
- [ ] Create a website
- [x] Install Saber

Note that you also need some CSS to override the default style for `ul` tags:

```css
ul.task-list {
  list-style: none;
  padding-left: 0;
}
```

### Tables

- [Specification](https://github.github.com/gfm/#tables-extension-)

Input:

```markdown
| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |
```

Output:

| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |

### Table of Contents

[TODO]

### Code Highlighting

To highlight code blocks, you need to use a highlighter, [Prism.js](https://prismjs.com/) is what we recommend:

```bash
# In your project
yarn add saber-highlighter-prism
```

Then set the markdown highlighter in your `saber-config.yml`:

```yaml
markdown:
  highlighter: prism
```

Input:

````markdown
```js
try {
  do_something.i_have_no_idea.what_i_am_doing()
} catch (err) {
  window.location.href = `https://stackoverflow.com/search?q=[js]+${
    err.message
  }`
}
```
````

Output:

```js
try {
  do_something.i_have_no_idea.what_i_am_doing()
} catch (err) {
  window.location.href = `https://stackoverflow.com/search?q=[js]+${
    err.message
  }`
}
```

You also need to include a Prism theme in your app to make it display properly, we recommend `prism.css`:

```js
// saber-browser.js
import 'prismjs/themes/prism.css'
```

### Line Highlighting in Code Blocks

Input:

````markdown
```yaml {highlightLines:[2, '7-8']}
siteConfig:
  title: Saber
  description: A framework for building modern static websites.

theme: ./src

markdown:
  highlighter: prism
```
````

Output:

```yaml {highlightLines:[2, '7-8']}
siteConfig:
  title: Saber
  description: A framework for building modern static websites.

theme: ./src

markdown:
  highlighter: prism
```

In this case the rendered HTML will look like:

```html
<div class="saber-highlight" data-lang="yaml">
  <div class="saber-highlight-mask language-yaml">
    <div class="code-line"><!-- ... --></div>
    <div class="code-line highlighted"><!-- ... --></div>
    <div class="code-line"><!-- ... --></div>
  </div>
  <pre class="saber-highlight-code language-yaml">
    <code class="language-yaml"><!-- ... --></code>
  </pre>
</div>
```

You also need the package `saber-highlight-css` which provides some default styles for line highlight to render properly:

```bash
yarn add saber-highlight-css
```

Then import in your `saber-browser.js`:

```js
import 'saber-highlight-css/default.css'
```

The default CSS works well with `prismjs/themes/prism.css`, for other themes some tweaks might be needed to suit your needs.

If you want to override the font size or font family, you need to add CSS for both `.saber-highlight-mask` and `.saber-highlight-code code`:

```css
.saber-highlight-mask,
.saber-highlight-code code {
  /* Default: */
  font-size: .875rem;
}
```

## Configure markdown-it

Check out [markdown.options](./saber-config.md#markdown.options) for setting markdown-it options and [markdown.plugins](./saber-config.md#markdown.plugins) for adding markdown-it plugins.

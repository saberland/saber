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
  title: Saber.js
  description: A framework for building modern static websites.

theme: ./src

markdown:
  highlighter: prism
```
````

Output:

```yaml {highlightLines:[2, '7-8']}
siteConfig:
  title: Saber.js
  description: A framework for building modern static websites.

theme: ./src

markdown:
  highlighter: prism
```

In this case the rendered HTML will look like:

```html
<div class="code-wrapper" data-lang="yaml">
  <div class="code-mask language-yaml">
    <div class="code-line"><!-- ... --></div>
    <div class="code-line highlighted"><!-- ... --></div>
    <div class="code-line"><!-- ... --></div>
  </div>
  <pre class="code-block language-yaml">
    <code class="language-yaml"><!-- ... --></code>
  </pre>
</div>
```

Saber's default CSS work well with `prism-tomorrow.css`, for other themes some tweaks might be needed to suit your needs.

## Configure markdown-it

Check out [markdown.options](./saber-config.md#markdown.options) for setting markdown-it options and [markdown.plugins](./saber-config.md#markdown.plugins) for adding markdown-it plugins.

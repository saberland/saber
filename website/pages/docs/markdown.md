---
title: Markdown
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

### Line Highlighting in Code Blocks

[TODO]

## Configure markdown-it

Check out [markdown.options](/docs/config.html#markdown.options) for setting markdown-it options and [markdown.plugins](/docs/config.html#markdown.plugins) for adding markdown-it plugins.

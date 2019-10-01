---
title: Permalinks
layout: docs
---

Permalinks are the output path for your pages and posts. They allow you to structure the directories of your source code differently from the directories in your output.

By default we infer the permalink from the filename.

## Front Matter

The simplest way to change a permalink is using the front matter `permalink`.

For example, you might have a Markdown page on your site located at `./pages/sub_folder/hello.md` and you want the output url to be `/about` In the front matter of the page you should set:

```markdown
---
permalink: /about
---
```

## Global

Setting a permalink using the front matter `permalink` for every page on your site is no fun. Luckily, Saber lets you set the permalink structure globally in your config file.

To set a global permalink, you use the permalink variable in `saber-config.yml`. You can use placeholders to modify the output. For example:

```yaml
# Default values:
permalinks:
  post: /:year/:month/:day/:slug.html
  page: /:slug.html
```

Note that placeholders like `:year` and `:month` are parsed from the page attribute `createdAt` which can be any valid date value like: `2015-02-31`, it defaults to the creation time of your page.

### Placeholders

Here’s the full list of placeholders available:

| Variable | Description                                                |
| -------- | ---------------------------------------------------------- |
| year     | Year from the page attribute `date`                        |
| month    | Month from the page attribute `date`                       |
| i_month  | Month from the page attribute `date`, without leading zero |
| day      | Day from the page attribute `date`                         |
| i_day    | Day from the page attribute `date`, without leading zero   |
| slug     | The filename of the page, without extension                |

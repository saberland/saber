# Known Issues

## Hot module replacement sometimes doesn't work

In a markdown page, if you have following content:

```markdown
---
title: heh
---

hi

<script>
export default {}
</script>
```

If you add some text in the line where `hi` is, the page will not be hot-reloaded, you need to manually reload the page.

However if you add a new line, it works.

This issue only occurs when you use `<script>` element in markdown pages.

## Performance

Running my own blog which has ~70 posts takes 6s on a cold start and 2s on subsequential builds.

__Performance improvement__ is in the roadmap, contributions are very welcome too.

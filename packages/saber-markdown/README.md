# saber-markdown

A custom build of markdown-it for Saber.

## Differences

Implemented via a [babel plugin](./babel-plugin-vue-features.js).

### Support `@` in attribute names

In:

```html
<button @click="foo"></button>
```

Out:

```diff
- <p>&lt;button @click=&quot;foo&quot;&gt;</button></p>\n
+ <p><button @click="foo"></button></p>\n
```

### Support top-level components

In:

```html
<FooBar />
```

Out:

```diff
- <p><FooBar /> hi</p>\n
+ <FooBar /> hi
```

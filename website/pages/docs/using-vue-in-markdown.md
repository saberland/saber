---
title: Using Vue in Markdown
layout: docs
---

## Interpolation

Markdown code is compiled to HTML first and then compiled to Vue render functions, for example:

```markdown
Hello **Saber**!
```

compiles to:

```js
function render() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c('p', [
    _vm._v('Hello '),
    _c('strong', [_vm._v('Saber')]),
    _vm._v('!')
  ])
}
```

This means you can use Vue-style interpolation in Markdown like this:

```markdown
This result of 1 + 1 is: {{ 1 + 1 }}
```

It renders:

<div class="output">
This result of 1 + 1 is: {{ 1 + 1 }}
</div>

If you want to disable Vue-style interpolation for a part of your Markdown page, you can wrap it inside code fence, inline code or using the `v-pre` attribute as follows:

````markdown
```js
const foo = `{{ safe, this won't be interpolated! }}`
```

And `{{ bar }}` is safe too! <span v-pre>{{ yeah }}</span>
````

It renders:

<div class="output">

```js
const foo = `{{ safe, this won't be interpolated! }}`
```

And `{{ bar }}` is safe too! <span v-pre>{{ yeah }}</span>

</div>

## `<script>` block

`<script>` tag in a Markdown page is not the normal HTML `<script>` element, it's treated as [Vue SFC `<script>` block](https://vue-loader.vuejs.org/spec.html#script) instead.

```markdown
**This is an example:**

<button @click="count++">{{ count }}</button>

<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>
```

It renders:

<div class="output">

**This is an example:**

<button @click="count++">{{ count }}</button>

</div>

<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

Like a regular Vue single-file component, your Markdown page can have at most one script block.

## `<style>` block

`<style>` tags in Markdown page are not HTML `<style>` elements either, they are [Vue SFC `<style>` blocks](https://vue-loader.vuejs.org/spec.html#style).

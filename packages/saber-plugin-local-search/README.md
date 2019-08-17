# saber-plugin-local-search

Adds a hyper-fast, easy to integrate and highly customizable search to your app.

## Install

```bash
yarn add saber-plugin-local-search
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-local-search
    options:
      index:
        - title
        - excerpt
        - permalink
```

You can index any value from `page` or `page.attributes`. Then, create a search component:

```html
<template>
  <div>
    <input type="search" v-model="searchTerm" />

    <ul>
      <li v-for="result in searchResults" :key="result.permalink">
        <saber-link :to="result.permalink">{{ result.title }}</saber-link>
      </li>
    </ul>
  </div>
</template>

<!-- ... -->

<script>
  export default {
    data() {
      return {
        searchTerm: '',
        searchResults: []
      }
    },
    watch: {
      async searchTerm(query) {
        this.searchResults = await this.$searchPages(query)
      }
    }
  }
</script>
```

Pretty simple, right?

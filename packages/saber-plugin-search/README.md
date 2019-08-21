# saber-plugin-search

Adds a hyper-fast, easy to integrate and highly customizable search to your app.

## Install

```bash
yarn add saber-plugin-search
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-search
    options:
      adapter: local
      index:
        - title
        - excerpt
        - permalink
```

This plugin comes with its own search adapter, which uses [Fuzzy Search](https://www.npmjs.com/package/fuzzy-search) - if you feel uncontent with that, you can also choose between `algolia` (please then also provide `algoliaId`, `algoliaSearchKey` and `algoliaAdminKey` with the options) or even implement your own search adapter:

```ts
type adapterFunction = (searchData: searchData[], query: string) => searchData[]

interface searchData {
  [index: string]: string
}
```

You can index any stringable value from `page` or `page.attributes`. Then, create a search component:

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

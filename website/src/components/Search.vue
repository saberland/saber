<template>
  <div class="search" :class="{'is-focused': focused}">
    <div class="search--icon">
      <svg
        width="13"
        height="13"
        viewBox="0 0 13 13"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <path
          d="M8.87 8.16l3.25 3.25-.7.71-3.26-3.25a5 5 0 1 1 .7-.7zM5 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        ></path>
      </svg>
    </div>
    <input type="text" class="search--input" @focus="handleFocus(true)" @blur="handleFocus(false)">
  </div>
</template>

<script>
export default {
  data() {
    return {
      focused: false
    }
  },

  async mounted() {
    const docsearch = await import('docsearch.js')
    docsearch.default({
      apiKey: '226f92e3cf36f89eda7c402258e73cb2',
      indexName: 'saber',
      inputSelector: '.search--input',
      handleSelected: (input, event, suggestion) => {
        this.$router.push(suggestion.url.replace(/^https:\/\/saber\.land/, ''))
      },
      debug: process.env.NODE_ENV === 'development' // Set debug to true if you want to inspect the dropdown
    })
  },

  methods: {
    handleFocus(focused) {
      this.focused = focused
    }
  }
}
</script>

<style src="docsearch.js/dist/cdn/docsearch.min.css"></style>

<style scoped>
.search {
  display: flex;
  margin-right: 20px;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 3px;
  height: 50%;

  &.is-focused {
    border-color: var(--border-dark-color);
  }
}

.search--input {
  border: none;
  outline: none;
  height: 100%;
  display: block;
  width: 240px;
  padding-right: 10px;
}

.search--icon {
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

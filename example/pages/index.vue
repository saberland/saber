<template>
  <div>
    <h1>{{ post.title }}</h1>
    <p>{{ post.body }}</p>
  </div>
</template>

<script>
export default {
  name: 'index'
}
</script>


<saber>
const axios = require('axios')

export default {
  async data() {
    const { data: post } = await axios
      .get('https://jsonplaceholder.typicode.com/posts/1')

    return  {
      post
    }
  }
}
</saber>

<style scoped>
div {
  & h1 {
    color: red
  }
}
</style>

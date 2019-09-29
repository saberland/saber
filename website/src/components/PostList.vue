<template>
  <div class="posts">
    <div class="post" v-for="post in posts" :key="post.permalink">
      <h2 class="post-title">
        <a :href="post.permalink">{{ post.title }}</a>
      </h2>
      <PostMeta :page="post" />
      <div class="post-excerpt" v-html="post.excerpt"></div>
    </div>
  </div>
</template>

<script>
import PostMeta from './PostMeta.vue'

export default {
  components: {
    PostMeta
  },

  props: ['posts']
}
</script>

<style scoped>
.post-title {
  margin: 0 0 10px 0;
}

.post {
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
}
</style>


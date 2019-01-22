<template>
  <div>
    <h2 class="page-title">{{ page.attributes.title }}</h2>
    <div class="page-content">
      <slot name="default"></slot>
    </div>
    <div class="posts" v-if="page.posts && page.posts.length > 0">
      <div class="post" v-for="post in page.posts" :key="post.attributes.permalink">
        <h2 class="post-title">
          <saber-link :to="post.attributes.permalink">{{ post.attributes.title }}</saber-link>
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['page'],
  head() {
    return {
      title: this.page.attributes.title
    }
  }
}
</script>

<style scoped>
.page-title {
  font-size: 3rem;
}
</style>

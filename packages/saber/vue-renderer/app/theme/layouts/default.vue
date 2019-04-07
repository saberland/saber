<template>
  <div>
    <h2 :class="$style.Title" v-if="page.attributes.title">{{ page.attributes.title }}</h2>
    <div :class="$style.Content">
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
  name: 'LayoutDefault',
  props: ['page'],
  head() {
    return {
      title: this.page.attributes.title
    }
  }
}
</script>

<style module>
.Title {
  font-size: 3rem;
}

.Content {

}
</style>

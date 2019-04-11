<template>
  <div class="layout">
    <Header :showToggle="true"/>
    <Sidebar class="home-sidebar" :items="$themeConfig.sidebar"/>
    <div class="content">
      <slot name="default"/>
      <PostList :posts="page.posts"/>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import PostList from '../components/PostList.vue'

export default {
  props: ['page'],

  head() {
    const { title } = this.page.attributes
    return {
      title: title
        ? `${title} - ${this.$siteConfig.title}`
        : this.$siteConfig.title
    }
  },

  components: {
    Header,
    Sidebar,
    PostList
  }
}
</script>

<style scoped>
.home-sidebar {
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
}
</style>

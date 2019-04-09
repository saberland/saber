<template>
  <div class="layout">
    <Header :showToggle="true"/>
    <Sidebar class="home-sidebar" :items="$themeConfig.sidebar"/>
    <div class="content">
      <main class="main">
        <slot name="default"/>
        <PostList :posts="page.posts" />
      </main>
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
      title: title ? `${title} - ${this.$siteConfig.title}` : this.$siteConfig.title
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

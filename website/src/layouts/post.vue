<template>
  <div class="layout">
    <Header :showToggle="true"/>
    <Sidebar class="home-sidebar" :items="$themeConfig.sidebar"/>
    <div class="content">
      <h1 class="page-title">{{ page.attributes.title }}</h1>
      <PostMeta :page="page"/>
      <div class="page-content">
        <slot name="default"/>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import PostMeta from '../components/PostMeta.vue'

export default {
  props: ['page'],

  head() {
    return {
      title: `${this.page.attributes.title} - ${this.$siteConfig.title}`,
      meta: [
        {
          name: 'twitter:title',
          content: this.page.attributes.title
        },
        {
          name: 'twitter:description',
          content: this.page.attributes.subtitle
        }
      ]
    }
  },

  components: {
    Header,
    Sidebar,
    PostMeta
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

.page-title {
  font-size: 3rem;
  margin: 0 0 20px 0;
}
</style>

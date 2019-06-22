<template>
  <Wrap :page="page" :showLeftbar="false">
    <h1 class="page-title">{{ page.attributes.title }}</h1>
    <PostMeta :page="page"/>
    <div class="page-content">
      <slot name="default"/>
    </div>
  </Wrap>
</template>

<script>
import Wrap from '../components/Wrap.vue'
import PostMeta from '../components/PostMeta.vue'

export default {
  components: {
    Wrap,
    PostMeta
  },

  props: ['page'],

  head() {
    return {
      title: `${this.page.attributes.title} - ${this.$siteConfig.title}`,
      meta: [
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:site',
          content: '@saber_land'
        },
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
  }
}
</script>

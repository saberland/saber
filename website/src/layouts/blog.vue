<template>
  <Wrap :page="page" :showLeftbar="false" :showRightbar="false" :showEditInfo="false">
    <PostList :posts="page.posts"/>
  </Wrap>
</template>

<script>
import Wrap from '../components/Wrap.vue'
import PostList from '../components/PostList.vue'

export default {
  components: {
    Wrap,
    PostList
  },

  props: ['page'],

  head() {
    const { title } = this.page.attributes
    return {
      title: title
        ? `${title} - ${this.$siteConfig.title}`
        : this.$siteConfig.title
    }
  }
}
</script>

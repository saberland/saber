<template>
  <Wrap :page="page" :showSidebar="false" :showEditInfo="false" mainWidth="960px">
    <slot />
  </Wrap>
</template>


<script>
import Wrap from '../components/Wrap.vue'

export default {
  components: {
    Wrap
  },

  props: ['page'],

  head() {
    return {
      title: this.$siteConfig.title
    }
  }
}
</script>

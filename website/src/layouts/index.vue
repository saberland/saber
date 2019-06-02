<template>
  <Wrap :page="page" :showLeftbar="false" :showRightbar="false" :showEditInfo="false">
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

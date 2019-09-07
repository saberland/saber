<template>
  <Wrap :page="page" :showSidebar="false">
    <div class="page-title">{{ page.title }}</div>
    <div class="page-content">
      <slot name="default"/>
    </div>
  </Wrap>
</template>

<script>
import Wrap from '../components/Wrap.vue'
import DocMixin from '../mixins/doc'

export default {
  components: {
    Wrap
  },

  props: ['page'],

  mixins: [DocMixin],

  head() {
    return {
      title: `${this.page.title} - Saber`
    }
  }
}
</script>

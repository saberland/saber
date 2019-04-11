<template>
  <div class="layout">
    <Header :showToggle="true" />
    <Sidebar :items="sidebar" />
    <main class="main">
      <div class="content">
        <div class="page-title">{{ page.attributes.title }}</div>
        <div class="page-content">
          <slot name="default" />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import DocMixin from '../mixins/doc'

export default {
  props: ['page'],

  mixins: [DocMixin],

  head() {
    return {
      title: `${this.page.attributes.title} - Saber`
    }
  },

  data() {
    return {
      sidebar: []
    }
  },

  mounted() {
    const items = Array.prototype.map.call(this.$el.querySelectorAll('.page-content > h2'), el => {
      return {
        title: el.textContent,
        link: `#${el.getAttribute('id')}`
      }
    })
    this.sidebar = [
      {
        title: 'Tutorial',
        children: items
      }
    ]
  },

  components: {
    Header,
    Sidebar
  }
}
</script>

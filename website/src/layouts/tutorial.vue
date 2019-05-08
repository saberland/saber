<template>
  <div class="layout">
    <Header :showToggle="true"/>
    <Sidebar :items="sidebar"/>
    <main class="main">
      <div class="content">
        <div class="page-title">{{ page.attributes.title }}</div>
        <div class="page-content">
          <slot name="default"/>
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

  computed: {
    sidebar() {
      const items = this.page.attributes.markdownHeadings
        .filter(h => h.level === 2)
        .map(h => ({
          title: h.text,
          link: `#${h.slug}`
        }))
      return [
        {
          title: 'Tutorial',
          children: items
        }
      ]
    }
  },

  components: {
    Header,
    Sidebar
  }
}
</script>

<template>
  <div class="layout">
    <Header />
    <div class="container content">
      <Sidebar :items="sidebar" />
      <main>
        <div class="page-title">{{ page.attributes.title }}</div>
        <div class="page-content">
          <slot name="default" />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'

export default {
  props: ['page'],

  head() {
    return {
      title: `${this.page.attributes.title} - Saber.js`
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

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style scoped src="../css/page.css"></style>

<template>
  <div class="layout">
    <Header/>
    <div class="container content">
      <Sidebar :items="$themeConfig.sidebar"/>
      <main>
        <div class="page-title">{{ page.attributes.title }}</div>
        <div class="page-content">
          <slot name="default"/>
        </div>
      </main>
    </div>
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
      title: `${this.page.attributes.title} - Saber.js`
    }
  },

  components: {
    Header,
    Sidebar
  }
}
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style scoped src="../css/page.css"></style>

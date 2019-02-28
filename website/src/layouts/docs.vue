<template>
  <div class="layout">
    <Header/>
    <div class="container content">
      <Sidebar :items="sidebar"/>
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
import { themeConfig } from 'saber/config'
import jump from 'jump.js'
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
      sidebar: themeConfig.sidebar
    }
  },

  watch: {
    '$route.hash': {
      handler(hash) {
        this.$nextTick(() => {
          if (hash) {
          const el = document.getElementById(hash.slice(1))
          if (el) {
            jump(el, {
              duration: 200,
              offset: -(document.querySelector('.header').clientHeight + 20)
            })
          }
        }
        })
      },
      immediate: true
    }
  },

  mounted() {
    // Make footnotes focusable
    const items = this.$el.querySelectorAll('.footnote-item,.footnote-ref a')
    Array.prototype.forEach.call(items, el => {
      el.tabIndex = 1
    })
  },

  components: {
    Header,
    Sidebar
  }
}
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style scoped src="../css/page.css"></style>

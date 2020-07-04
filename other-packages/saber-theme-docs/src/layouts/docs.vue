<template>
  <div>
    <Header />
    <div class="main container mx-auto">
      <div class="grid grid-cols-9 gap-5">
        <div class="hidden md:block md:col-span-2"><SidebarMenu /></div>
        <div class="col-span-9 md:col-span-7 lg:col-span-5">
          <h2 class="page-title">{{ page.title }}</h2>
          <div class="page-content">
            <slot />
          </div>
        </div>
        <div class="hidden lg:block col-span-2">
          <div class="pl-8">
            <TOC :headings="page.markdownHeadings" />
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import SidebarMenu from '../components/SidebarMenu.vue'
import TOC from '../components/TOC.vue'

export default {
  components: {
    Header,
    Footer,
    SidebarMenu,
    TOC
  },

  props: ['page'],

  head() {
    return {
      title: `${this.page.title} - ${this.$siteConfig.title}`
    }
  }
}
</script>

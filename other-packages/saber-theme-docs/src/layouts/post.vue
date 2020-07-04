<template>
  <div>
    <Header />
    <div class="container max-w-2xl mx-auto">
      <div class="main">
        <div class="flex flex-col space-y-5">
          <h2 class="page-title">{{ page.title }}</h2>
          <div class="mt-3 text-gray-500">
            Published on {{ formatDate(page.createdAt, 'DD MMM, YYYY') }}
          </div>
          <div class="page-content"><slot /></div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

export default {
  components: {
    Header,
    Footer
  },

  props: ['page'],

  head() {
    return {
      title: `${this.page.title} - ${this.$siteConfig.title}`
    }
  },

  methods: {
    formatDate(date, format) {
      return dayjs(date).format(format)
    }
  }
}
</script>

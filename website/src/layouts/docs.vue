<template>
  <Wrap :page="page">
    <div class="page-title">{{ page.title }}</div>
    <div class="page-content">
      <slot name="default"/>
    </div>
    <div class="prev-next-page">
      <a class="prev-page" v-if="prevNextPage.prev" :href="prevNextPage.prev.link">
        <span class="arrow">←</span>
        {{ prevNextPage.prev.title }}
      </a>
      <a class="next-page" v-if="prevNextPage.next" :href="prevNextPage.next.link">
        {{ prevNextPage.next.title }}
        <span class="arrow">→</span>
      </a>
    </div>
  </Wrap>
</template>

<script>
import DocMixin from '../mixins/doc'
import Wrap from '../components/Wrap.vue'

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
  },

  computed: {
    flatSidebarItems() {
      return this.$themeConfig.sidebarMenu.reduce((res, item) => {
        return res.concat(item.children)
      }, [])
    },

    prevNextPage() {
      for (const [index, item] of this.flatSidebarItems.entries()) {
        if (item.link === this.$route.path) {
          return {
            prev: this.flatSidebarItems[index - 1],
            next: this.flatSidebarItems[index + 1]
          }
        }
      }
      return {}
    }
  }
}
</script>

<style scoped>
.prev-next-page {
  display: inline-block;
  width: 100%;
  margin-top: 80px;
}

.arrow {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}

.prev-page {
  float: left;
}

.next-page {
  float: right;
}

.prev-page,
.next-page {
  border: 1px solid var(--border-color);
  border-radius: 3px;
  padding: 5px 10px;
  font-size: 0.875rem;
  transition: border 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    border-color: #dddddd;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
}
</style>

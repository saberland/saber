<template>
  <div class="layout">
    <Header :showToggle="true"/>
    <Sidebar :items="$themeConfig.sidebar"/>
    <main class="main">
      <div class="content">
        <div class="page-title">{{ page.attributes.title }}</div>
        <div class="page-content">
          <slot name="default"/>
        </div>
        <div class="prev-next-page">
          <saber-link class="prev-page" v-if="prevNextPage.prev" :to="prevNextPage.prev.link">
            <span class="arrow">←</span> {{ prevNextPage.prev.title }}
          </saber-link>
          <saber-link class="next-page" v-if="prevNextPage.next" :to="prevNextPage.next.link">
            {{ prevNextPage.next.title }} <span class="arrow">→</span>
          </saber-link>
        </div>
        <div class="page-meta">
          <span class="last-edited">
            Last Edited on {{ updatedDate }}
          </span>
          <a class="edit-link" target="_blank" :href="editLink">Edit This Page on GitHub</a>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import format from 'date-fns/format'
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
    flatSidebarItems() {
      return this.$themeConfig.sidebar.reduce((res, item) => {
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
    },

    updatedDate() {
      return format(this.page.attributes.updatedAt, 'MMMM DD, YYYY')
    },

    editLink() {
      return `https://github.com/egoist/saber/blob/master/website/pages/${this.page.attributes.slug}.md`
    }
  },

  components: {
    Header,
    Sidebar
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}

.prev-page {
  float: left;
}

.next-page {
  float: right;
}

.prev-page, .next-page {
  border: 1px solid var(--border-color);
  border-radius: 3px;
  padding: 5px 10px;
  font-size: .875rem;
  transition: border .3s ease, box-shadow .3s ease;
  &:hover {
    border-color: #dddddd;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }
}

.page-meta {
  margin-top: 20px;
  padding-top: 20px;
  color: #666666;
  font-size: .6rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
}
</style>

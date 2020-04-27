<template>
  <div
    class="wrap"
    :style="{'--main-width': mainWidth || 'inherit'}"
    :class="{'no-sidebar': !showSidebar}"
  >
    <Header />
    <Toc
      v-if="page.markdownHeadings && page.markdownHeadings.length > 0"
      :headings="page.markdownHeadings"
    />
    <Sidebar :items="$themeConfig.sidebarMenu" :hide="!showSidebar">
      <template #content>
        <slot name="sidebar" />
      </template>
    </Sidebar>
    <div class="page">
      <div class="main">
        <slot name="default" />
        <div class="edit-info" v-if="showEditInfo">
          <!-- <span class="last-edited">Last Edited on {{ updatedDate }}</span> -->
          <a class="edit-link" target="_blank" :href="editLink">Edit This Page on GitHub</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import format from 'date-fns/format'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import Toc from './Toc.vue'

export default {
  components: {
    Header,
    Sidebar,
    Toc
  },

  props: {
    page: {
      type: Object,
      required: true
    },
    showSidebar: {
      type: Boolean,
      default: true
    },
    showEditInfo: {
      type: Boolean,
      default: true
    },
    mainWidth: {
      type: String
    }
  },

  computed: {
    updatedDate() {
      return format(this.page.updatedAt, 'MMMM DD, YYYY')
    },

    editLink() {
      const { slug, type } = this.page
      return `https://github.com/saberland/saber/blob/master/website/pages/${
        type === 'post' ? '_posts/' : ''
      }${slug}.md`
    }
  }
}
</script>

<style scoped>
.edit-info {
  margin-top: 20px;
  padding-top: 20px;
  color: var(--text-light-color);
  font-size: 0.8rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
}
</style>

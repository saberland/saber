<template>
  <div class="leftbar" :class="{'is-hidden': hide}">
    <SiteNav class="show-on-mobile" />

    <div class="items">
      <div class="item" v-for="(item, i) in items" :key="i">
        <div class="item-title" @click="toggleOpenLink(item.children)">{{ item.title }}</div>
        <transition name="fade">
          <div class="item-children" v-if="isExpanded(item.children)">
            <div class="item-child" v-for="(childItem, i) in item.children" :key="i">
              <saber-link
                :to="childItem.link"
                :class="{active: isActive(childItem.link)}"
              >{{ childItem.title }}</saber-link>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import SiteNav from './SiteNav.vue'

const addOrRemove = (arr, value) => {
  const index = arr.indexOf(value)
  if (index === -1) {
    return [...arr, value]
  }
  return arr.filter((_, i) => i !== index)
}

export default {
  components: {
    SiteNav
  },

  props: {
    items: {
      type: Array,
      required: true
    },
    hide: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      openLinks: [this.$route.path]
    }
  },

  computed: {
    flatItems() {
      const res = []
      for (const item of this.items) {
        res.push({ disabled: true, title: item.title })
        for (const child of item.children) {
          res.push({ ...child, disabled: false })
        }
      }
      return res
    }
  },

  methods: {
    isActive(link) {
      if (!link) return false
      return link[0] === '#'
        ? link === this.$route.hash
        : link === this.$route.path
    },

    isExpanded(items) {
      return items.some(item => {
        return this.openLinks.indexOf(item.link) > -1
      })
    },

    toggleOpenLink(children) {
      let closed = false

      for (const openLink of this.openLinks) {
        const isChildLinkActive = children.some(
          child => child.link === openLink
        )
        if (isChildLinkActive) {
          this.openLinks = this.openLinks.filter(link => link !== openLink)
          closed = true
          break
        }
      }

      if (!closed) {
        this.openLinks.push(children[0].link)
      }
    }
  }
}
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.leftbar {
  width: var(--leftbar-width);
  background: var(--sidebar-bg);
  padding: 20px;
  transition: transform 200ms cubic-bezier(0.2, 1, 0.2, 1);
  border-right: 1px solid var(--border-color);
  position: fixed;
  top: var(--header-height);
  bottom: 0;
  left: 0;
  z-index: 999;
  overflow: auto;

  &.is-hidden {
    display: none;
  }

   & /deep/ .nav {
    height: auto;
  }

  @nest .header-unpinned & {
    top: 0;
  }

  @media (max-width: 992px) {
    border-right: 1px solid var(--border-color);
    transform: translateX(-100%);

    &.is-hidden {
      display: block;
    }

    @nest .show-leftbar & {
      transform: translateX(0);
    }
  }

  @media (max-width: 768px) {
    width: 80%;
  }
}

.item {
  &:not(:first-child) {
    margin-top: 10px;
  }
}

.item-title {
  cursor: pointer;
  font-size: 14px;
  color: var(--text-dark-color);
  font-weight: 500;
  text-transform: uppercase;
  user-select: none;
}

.item-children {
  margin-top: 10px;
}

.item-child {
  font-size: 0.9rem;
  margin-top: 5px;
}

.item-child a {
  display: block;
  color: var(--text-light-color);
}

.item-child a:hover:not(.active) {
  color: #333;
}

.item-child a.active {
  color: var(--theme-color);
}
</style>

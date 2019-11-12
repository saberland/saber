<template>
  <div class="sidebar" :class="{'is-hidden': hide}">
    <SiteNav class="show-on-mobile" />

    <slot name="content" v-if="$slots.content"></slot>
    <div class="items" v-else>
      <div class="item" v-for="(item, i) in items" :key="i">
        <div
          class="item-title"
          :class="{'is-expanded': isExpanded(item.children)}"
          @click="toggleOpenLink(item.children)"
        >
          <span>{{ item.title }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-chevron-right"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        <transition name="fade">
          <div class="item-children" v-if="isExpanded(item.children)">
            <div class="item-child" v-for="(childItem, i) in item.children" :key="i">
              <a
                :href="childItem.link"
                :class="{active: isActive(childItem.link)}"
              >{{ childItem.title }}</a>
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
      default: []
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

.sidebar {
  width: var(--sidebar-width);
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

  @nest .header-unpinned.header-not-top & {
    top: 0;
  }

  @media (max-width: 992px) {
    border-right: 1px solid var(--border-color);
    transform: translateX(-100%);

    &.is-hidden {
      display: block;
    }

    @nest .show-sidebar & {
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
  color: var(--text-light-color);
  font-weight: 500;
  text-transform: uppercase;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & svg {
    width: 1em;
    height: 1em;
    transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
    opacity: .3;
  }

  &.is-expanded svg {
    transform: rotate(90deg);
  }

  &:hover svg {
    opacity: 1;
  }
}

.item-children {
  margin-top: 10px;
}

.item-child {
  font-size: 0.9rem;
  margin-top: 3px;
}

.item-child a {
  display: block;
  color: var(--text-dark-color);
  padding: 2px 0;
}

.item-child a:hover:not(.active) {
  color: #333;
}

.item-child a.active {
  background: rgb(230, 255, 250);
  padding: 2px 8px;
  border-radius: 4px;
  margin: 0 -8px;
}
</style>

<template>
  <div class="leftbar" :class="{'is-hidden': hide}">
    <div class="sticky">
      <div class="items">
        <div class="item" v-for="(item, i) in items" :key="i">
          <div class="item-title" @click="toggleOpenLink(item.children[0].link)">{{ item.title }}</div>
          <div class="item-children" :class="{'is-expanded': isExpanded(item.children)}">
            <div class="item-child" v-for="(childItem, i) in item.children" :key="i">
              <saber-link
                :to="childItem.link"
                :class="{active: isActive(childItem.link)}"
              >{{ childItem.title }}</saber-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
      openLink: null
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
        if (this.openLink) {
          return item.link === this.openLink
        }
        return item.link === this.$route.path
      })
    },

    toggleOpenLink(link) {
      if (this.openLink === link) {
        this.openLink = null
      } else {
        this.openLink = link
      }
    }
  }
}
</script>


<style scoped>
.leftbar {
  width: var(--leftbar-width);
  background: var(--sidebar-bg);
  transition: transform 200ms cubic-bezier(0.2, 1, 0.2, 1);

  &.is-hidden {
    display: none;
  }

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 80%;
    top: var(--header-height);
    padding: 20px;
    z-index: 999;
    border-right: 1px solid var(--border-color);
    transform: translateX(-100%);

    &.is-hidden {
      display: block;
    }

    @nest .show-leftbar & {
      transform: translateX(0);
    }

    & .sticky {
      position: initial;
    }
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
}

.item-children {
  display: none;
  margin-top: 10px;

  &.is-expanded {
    display: block;
  }
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

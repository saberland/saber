<template>
  <nav class="sidebar">
    <div class="items">
      <div class="item" v-for="(item, i) in items" :key="i">
        <div class="item-title">{{ item.title }}</div>
        <div class="item-children">
          <div class="item-child" v-for="(childItem, i) in item.children" :key="i">
            <saber-link :to="childItem.link" :class="{active: isActive(childItem.link)}">
              {{ childItem.title }}
            </saber-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>

export default {
  props: {
    items: {
      type: Array,
      required: true
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
      return link[0] === '#' ? link === this.$route.hash : link === this.$route.path
    }
  }
}
</script>


<style scoped>
.sidebar {
  width: var(--sidebar-width);
  top: var(--header-height);
  border-right: 1px solid var(--border-color);
  position: fixed;
  left: 0;
  bottom: 0;
  overflow: auto;
  padding: 20px 0;
  background: var(--sidebar-bg);
  z-index: 1000;
  transition: transform 200ms cubic-bezier(0.2, 1, 0.2, 1);

  @media (max-width: 768px) {
    transform: translateX(calc(-1 * var(--sidebar-width)));

    @nest .show-sidebar & {
      transform: translateX(0);
    }
  }
}

.item {
  &:not(:first-child) {
    margin-top: 30px;
  }
}

.item-title {
  font-size: 1rem;
  text-transform: uppercase;
  margin-bottom: 10px;
  padding: 0 20px;
  color: var(--dark);
}

.item-child {
  font-size: .9rem;
  margin: 10px 0;
}

.item-child:not(:first-child) {
  margin-top: 5px;
}

.item-child a {
  display: block;
  color: var(--text-light-color);
  padding: 0 20px;
}

.item-child a:hover:not(.active) {
  color: #333;
}

.item-child a.active {
  color: var(--theme-color);
  box-shadow: inset 2px 0 0 0 var(--theme-color);
}
</style>

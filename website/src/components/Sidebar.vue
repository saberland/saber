<template>
  <nav class="sidebar">
    <div class="items">
      <div class="item" v-for="(item, i) in items" :key="i">
        <div class="item-title">{{ item.title }}</div>
        <div class="item-children">
          <div class="item-child" v-for="(childItem, i) in item.children" :key="i">
            <saber-link :to="childItem.link" :class="{active: $route.path === childItem.link}">
              {{ childItem.title }}
            </saber-link>
          </div>
        </div>
      </div>
    </div>

    <select class="mobile-items" @change="e => $router.push(e.target.value)">
      <option
        :value="item.link"
        :disabled="item.disabled"
        v-for="(item, i) in flatItems"
        :selected="item.link === $route.path"
        :key="i">
        {{ item.title }}
      </option>
    </select>

  </nav>
</template>

<script>
import { themeConfig } from 'saber-config'

export default {
  data() {
    return {
      items: themeConfig.sidebar
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
  }
}
</script>


<style scoped>
.sidebar {
  width: var(--sidebar-width);
  padding-right: 20px;
  position: sticky;
  top: calc(var(--header-height) + 30px);
  height: calc(100vh - var(--header-height) - 30px);

  @media (max-width: 768px) {
    position: initial;
    top: 0;
    height: auto;
    padding-right: 0;
    width: 100%;
  }
}

.items {
  @media (max-width: 768px) {
    display: none;
  }
}

.item {
  &:not(:first-child) {
    margin-top: 30px;
  }
}

.mobile-items {
  display: none;
  width: 100%;
  @media (max-width: 768px) {
    display: block;
  }
}

.item-title {
  font-size: 1rem;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 10px;
}

.item-child {
  font-size: 1rem;
  margin: 10px 0;
}

.item-child:not(:first-child) {
  margin-top: 5px;
}

.item-child a {
  color: #666;
  border-bottom: 2px solid transparent;
}

.item-child a:hover:not(.active) {
  border-color: var(--theme-color);
}

.item-child a.active {
  color: var(--theme-color);
}
</style>

<template>
  <aside class="tocbar">
    <div class="items">
      <div class="item" v-for="(item, i) in items" :style="{ paddingLeft: `${7 * item.level}px`, 'font-size': `${1 - 0.01 * item.level}rem` }" :key="i">
        <saber-link
          :to="item.link"
          :class="{active: isActive(item.link)}"
        >{{ item.title }}</saber-link>
      </div>
    </div>
  </aside>
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
      return link[0] === '#'
        ? link === this.$route.hash
        : link === this.$route.path
    },
    handleScrolling() {
      console.log('fffff')
      this.hTags.forEach(el => {
        const top = window.pageYOffset;
        const distance = top - el.offsetTop;
        const hash = el.getElementsByTagName('a')[0].hash;
        if (distance < 50 && distance > -50 && this.currentHash != hash) {
            this.$router.push(hash);
            this.currentHash = hash;
        }
      })
    }
  },

  mounted() {
    const hLevels = this.$themeConfig.markdownHeadingsLevels ? this.$themeConfig.markdownHeadingsLevels : [2]
    this.hTags = hLevels.map(val => {
      return [...document.getElementsByTagName('h' + val)]
    }).flat()
    
    this.currentHash = ''
    window.addEventListener('scroll', this.handleScrolling)
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScrolling)
  }
}
</script>


<style scoped>
.tocbar {
  width: var(--tocbar-width);
  top: var(--header-height);
  border-right: 1px solid var(--border-color);
  position: fixed;
  right: 0;
  bottom: 0;
  overflow: auto;
  padding: 20px 0;
  background: var(--sidebar-bg);
  z-index: 1000;
  transition: transform 200ms cubic-bezier(0.2, 1, 0.2, 1);

  @media (max-width: 950px) {
    transform: translateX(var(--tocbar-width));
  }
}

.item {
  &:not(:first-child) {
    margin-top: 30px;
  }
}

.item-title {
  font-size: 1rem;
  margin-bottom: 10px;
  padding: 0 20px;
  color: var(--dark);
}

.item {
  font-size: 1.2rem;
  margin: 10px 0;
}

.item:not(:first-child) {
  margin-top: 5px;
}

.item a {
  display: block;
  color: var(--text-light-color);
  padding: 0 20px;
}

.item a:hover:not(.active) {
  color: #333;
}

.item a.active {
  color: var(--theme-color);
}
</style>

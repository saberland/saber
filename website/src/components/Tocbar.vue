<template>
  <aside class="tocbar">
    <div class="items" :key="currentHash">
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
        ? link === this.currentHash
        : link === this.$route.path
    },
    handleScrolling() {
      this.hTags.forEach(el => {
        const top = window.pageYOffset;
        const distance = top - el.offsetTop;
        const hash = el.getElementsByTagName('a')[0].hash;
        if (distance < 50 && distance > -50 && this.currentHash != hash) {
            //this.$router.push(hash);
            history.pushState(null, null, hash)
            this.currentHash = hash;
        }
      })
    }
  },

  watch: {
    $route(to, from) {
      this.currentHash = this.$route.hash
    }
  },

  data() {
    return {
      currentHash: null
    }
  },

  mounted() {
    const hLevels = this.$themeConfig.markdownHeadingsLevels ? this.$themeConfig.markdownHeadingsLevels : [2]
    this.hTags = hLevels.map(val => {
      return [...document.getElementsByTagName('h' + val)]
    }).flat()
    
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
  z-index: 50;
  transition: transform 200ms cubic-bezier(0.2, 1, 0.2, 1);

  @media (max-width: 950px) {
    transform: translateX(var(--tocbar-width));
  }

  @media (max-width: 768px) and (min-width: 650px) {
    transform: translateX(0);
  }
  
  &::-webkit-scrollbar {
    width: 6px;
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(216, 216, 216);
  }

  &:hover::-webkit-scrollbar  {
    display: block;
  }
}

.item {
  font-size: 1.2rem;
  margin: 10px 0;
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

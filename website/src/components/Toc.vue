<template>
  <div class="toc">
    <div class="toc-title">Contents</div>
    <div class="toc-headings">
      <saber-link
        :data-level="heading.level"
        :class="{'toc-heading': true, 'router-link-exact-active': `#${heading.slug}` === currentHash }"
        v-for="heading in filteredHeadings"
        :key="heading.slug"
        :to="{hash: heading.slug}"
      >{{ heading.text }}</saber-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    headings: {
      type: Array,
      required: true
    }
  },

  computed: {
    filteredHeadings() {
      return this.headings.filter(heading => heading.level < 4)
    }
  },

  data() {
    return {
      currentHash: null
    }
  },

  methods: {
    handleScrolling() {
      this.hTags.forEach(el => {
        const top = window.pageYOffset
        const distance = top - el.offsetTop
        const hash = el.getElementsByTagName('a')[0].hash
        if (distance < 50 && distance > -50 && this.currentHash != hash) {
            history.pushState(null, null, hash)
            this.currentHash = hash
        }
      })
    }
  },

  mounted() {
  	this.currentHash = window.location.hash
    const hLevels = [2, 3]
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
.toc-title {
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: 10px;
  color: var(--text-dark-color);
}

.toc-heading {
  display: block;
  margin-bottom: 5px;
  color: var(--text-light-color);
  font-size: 0.875rem;

  &:hover {
    color: var(--text-color);
  }

  &.router-link-exact-active {
    color: var(--text-dark-color);
  }

  &[data-level="3"] {
    padding-left: 10px;
  }
}
</style>

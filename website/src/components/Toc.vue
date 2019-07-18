<template>
  <div class="toc">
    <div class="toc-title">Contents</div>
    <div class="toc-headings">
      <saber-link
        :data-level="heading.level"
        :class="{'toc-heading': true, 'active-hash': `#${heading.slug}` === currentHash }"
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

  watch: {
    $route() {
      this.isRoute = true
      this.currentHash = this.$route.hash
    }
  },

  data() {
    return {
      currentHash: null,
      observer: null,
      isRoute: false,
      justMounted: true
    }
  },
  
  mounted() {
    this.observer = new IntersectionObserver(([firstEntry]) => {
      if (this.isRoute || this.justMounted) {
      	this.isRoute = false
      	this.justMounted = false
      } else if (firstEntry.boundingClientRect.bottom <= firstEntry.intersectionRect.bottom) {
        const hash = `#${firstEntry.target.id}`
        history.pushState(null, null, hash)
        this.currentHash = hash
      }
    })

    this.filteredHeadings.forEach(heading => this.observer.observe(document.querySelector(`#${heading.slug}`)))
  },

  beforeDestroy() {
    this.observer.disconnect()
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

  &.active-hash {
    color: var(--text-dark-color);
  }

  &[data-level="3"] {
    padding-left: 10px;
  }
}
</style>

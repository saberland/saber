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

  data() {
    return {
      currentHash: null,
      observer: null
    }
  },

  methods: {
  	handleHash: function({target}) {
  	  this.currentHash = `#${target.href.split('#')[1]}`
  	}
  },

  mounted() {
  	this.observer = new IntersectionObserver((entries) => {
      let hash = entries.length === 1 ? `#${entries[0].target.id}` : null
      history.pushState(null, null, hash)
      this.currentHash = hash
    }, {rootMargin: `-50px 0px ${50 - window.innerHeight}px 0px`})

    const hLevels = [2, 3]
    hLevels.forEach(hLevel => document.querySelectorAll(`h${hLevel}`).forEach(el => this.observer.observe(el)))

    document.querySelectorAll('.toc-heading').forEach(el => {
      el.addEventListener('click', this.handleHash)
    })
  },

  beforeDestroy() {
	this.observer.disconnect()
	document.querySelectorAll('.toc-heading').forEach(el => {
      el.removeEventListener('click', this.handleHash)
    })
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

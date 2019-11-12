<template>
  <div class="toc" :class="{show}">
    <div class="toc-trigger" @click="show = !show">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="list"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><circle cx="4" cy="7" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="17" r="1"/><rect x="7" y="11" width="14" height="2" rx=".94" ry=".94"/><rect x="7" y="16" width="14" height="2" rx=".94" ry=".94"/><rect x="7" y="6" width="14" height="2" rx=".94" ry=".94"/></g></g></svg>
    </div>
    <div class="toc-title">Contents</div>
    <div class="toc-headings">
      <a
        :data-level="heading.level"
        :class="{'toc-heading': true, 'active-hash': `#${heading.slug}` === currentHash}"
        v-for="heading in filteredHeadings"
        :key="heading.slug"
        :href="{hash: heading.slug}"
      >{{ heading.text }}</a>
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
      justMounted: true,
      show: false
    }
  },

  mounted() {
    this.observer = new IntersectionObserver(([firstEntry]) => {
      if (this.isRoute || this.justMounted) {
        this.isRoute = false
        this.justMounted = false
      } else if (
        firstEntry.boundingClientRect.bottom <=
        firstEntry.intersectionRect.bottom
      ) {
        const hash = `#${firstEntry.target.id}`
        history.replaceState(null, null, hash)
        this.currentHash = hash
      }
    })

    this.filteredHeadings.forEach(heading =>
      this.observer.observe(document.querySelector(`#${heading.slug}`))
    )
  },

  beforeDestroy() {
    this.observer.disconnect()
  }
}
</script>

<style scoped>
.toc {
  width: 200px;
  position: fixed;
  right: 0;
  top: calc(var(--header-height) + 30px);
  border: 1px solid var(--border-color);
  border-right: 0;
  border-radius: 0 0 0 3px;
  padding: 10px;
  transform: translateX(100%);
  transition: transform 200ms cubic-bezier(0.2, 1, 0.2, 1);
  z-index: 999;
  background: #fcfcfc;

  &:hover,
  &.show {
    transform: translateX(0);
  }

  @nest .header-unpinned.header-not-top & {
    top: 30px;
  }

  @media (max-width: 768px) {
    display: none;
  }
}

.toc-trigger {
  position: absolute;
  left: -1px;
  top: -1px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-right: 0;
  transform: translateX(-100%);
  border-radius: 3px 0 0 3px;
  font-size: 0;
  background: #fcfcfc;

  & svg {
    width: 1.3rem;
    height: 1.3rem;
    color: #9e9e9e;
  }
}

.toc-title {
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: 10px;
  color: var(--text-dark-color);
}

.toc-heading {
  display: block;
  color: var(--text-light-color);
  font-size: 0.875rem;

  &:hover {
    color: var(--text-color);
  }

  &.active-hash {
    color: var(--text-dark-color);
  }

  &[data-level='3'] {
    padding-left: 10px;
  }

  &:not(:last-child) {
    margin-bottom: 5px;
  }
}
</style>

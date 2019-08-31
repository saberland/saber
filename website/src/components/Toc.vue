<template>
  <div class="toc" :class="{show}">
    <div class="toc-trigger" @click="show = !show">
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
        class="feather feather-book"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    </div>
    <div class="toc-title">Contents</div>
    <div class="toc-headings">
      <saber-link
        :data-level="heading.level"
        :class="{'toc-heading': true, 'active-hash': `#${heading.slug}` === currentHash}"
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

  &:hover, &.show {
    transform: translateX(0);;
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

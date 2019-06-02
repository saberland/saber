<template>
  <div class="toc">
    <div class="toc-title">Contents</div>
    <div class="toc-headings">
      <saber-link class="toc-heading" v-for="heading in headings" :key="heading.slug" :to="{hash: heading.slug}">
        {{ heading.text }}
      </saber-link>
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
  font-size: .875rem;

  &:hover {
    color: var(--text-color);
  }

  &.router-link-exact-active {
    color: var(--text-dark-color);
  }
}
</style>

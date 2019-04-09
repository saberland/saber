<template>
  <div class="page-meta">
    <span class="page-date">
      {{ format(new Date(page.attributes.createdAt), 'MMM DD, YYYY') }}
    </span>
  </div>
</template>

<script>
import format from 'date-fns/format'

export default {
  props: ['page'],

  methods: {
    format
  }
}
</script>

<style scoped>
.page-meta {
  color: var(--text-light-color);
}
</style>

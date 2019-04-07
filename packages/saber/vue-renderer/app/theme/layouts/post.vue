<template>
  <div class="layout-post">
    <h2>{{ page.attributes.title }} </h2>
    <div class="post-content">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutPage',
  props: ['page']
}
</script>

<style scoped>
h2 {
  color: green;
}
</style>

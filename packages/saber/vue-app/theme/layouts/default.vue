<template>
  <div>
    <h2 v-if="page.title">{{ page.title }}</h2>
    <slot name="default"></slot>
  </div>
</template>

<script>
export default {
  props: ['page']
}
</script>

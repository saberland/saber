<template>
  <div>
    <h2 v-if="page.attributes.title">{{ page.attributes.title }}</h2>
    <slot name="default"></slot>
  </div>
</template>

<script>
export default {
  props: ['page']
}
</script>

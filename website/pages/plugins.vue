<template>
  <div>
    <div v-for="plugin in plugins" :key="plugin.name">
      {{ plugin.name }}
    </div>
  </div>
</template>

<script>
export const page = {
  injectData: {
    plugins: {
      source: 'get-plugins'
    }
  },
  pagination: {
    perPage: 1,
    data: 'plugins',
    orderBy: 'name'
  }
}

export default {
  props: ['plugins']
}
</script>

<template>
  <div>
    <div v-for="plugin in page.plugins" :key="plugin.name">
      {{ plugin.name }}
    </div>
  </div>
</template>

<script>
export const page = {
  injectPageData: {
    plugins: {
      use: 'get-plugins'
    }
  },
  paginate: {
    perPage: 1,
    dataKey: 'plugins',
    orderBy: 'name'
  }
}

export default {
  props: ['page']
}
</script>

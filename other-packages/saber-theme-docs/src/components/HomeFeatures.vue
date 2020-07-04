<template>
  <div class="bg-gray-100 py-36 mt-16">
    <div class="max-w-6xl mx-auto flex space-x-8">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="w-4/12 bg-white shadow rounded p-10"
      >
        <h3 class="text-xl font-bold mb-3">{{ feature.title }}</h3>
        <div class="text-gray-700 leading-snug">{{ feature.details }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    features: {
      type: Array,
      required: true
    }
  }
}
</script>

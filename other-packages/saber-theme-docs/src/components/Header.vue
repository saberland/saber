<template>
  <header class="border-b fixed top-0 left-0 right-0 h-16 bg-white z-10">
    <div
      class="container mx-auto px-5 flex items-center justify-between h-full"
    >
      <h1 class="font-bold text-xl">
        <a href="/" class="flex items-center space-x-2"
          ><Logo /><span>{{ $siteConfig.title }}</span></a
        >
      </h1>
      <div class="flex items-center space-x-5">
        <DocSearch />
        <ul class="flex items-center space-x-5">
          <li
            v-for="item in $themeConfig.navLinks"
            :key="item.title"
            class="group relative"
          >
            <a
              v-if="item.link"
              :href="item.link"
              class="navlink text-gray-500"
              :class="{ 'is-active': isActiveLink(item.link) }"
              >{{ item.title }}</a
            >
            <span
              v-else
              class="navlink text-gray-500"
              :class="{ 'is-active': isActiveLink(item.link) }"
              >{{ item.title }}</span
            >
            <div
              v-if="item.children"
              class="navlink--children hidden group-hover:block absolute right-0"
            >
              <ul class="mt-2 shadow-lg rounded bg-white overflow-hidden">
                <li v-for="child in item.children" :key="child.title">
                  <a
                    :href="child.link"
                    class="flex p-2 font-medium text-gray-600 hover:text-theme hover:bg-gray-100"
                    >{{ child.title }}</a
                  >
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import Logo from './Logo.vue'
import DocSearch from './DocSearch.vue'

export default {
  components: {
    Logo,
    DocSearch
  },

  methods: {
    isActiveLink(link) {
      return this.$route.path === link
    }
  }
}
</script>

<style scoped>
.navlink {
  @apply cursor-pointer;
  @apply text-gray-500;
}

.navlink:hover,
.navlink.is-active {
  @apply text-theme;
}

.navlink--children {
  min-width: 150px;
}

.navlink--children a.router-link-exact-active {
  @apply text-theme;
}
</style>

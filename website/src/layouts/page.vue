<template>
  <div class="layout">
    <Header />
    <div class="container content">
      <Sidebar />
      <main>
        <div class="page-title">{{ page.attributes.title }}</div>
        <div class="page-content">
          <slot name="default" />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'

export default {
  props: ['page'],

  head() {
    return {
      title: `${this.page.attributes.title} - Saber.js`
    }
  },

  components: {
    Header,
    Sidebar
  }
}
</script>

<style src="prismjs/themes/prism.css"></style>

<style scoped>
.page-content {
  margin: 40px 0;
  font-size: 1.2rem;
  line-height: 1.6;
}

.page-title {
  font-size: 3rem;
  font-weight: 500;
}

main {
  width: calc(100% - var(--sidebar-width));
  padding: 0 100px;

  @media (max-width: 768px) {
    padding: 0;
    border-top: 1px solid var(--border-color);
    margin-top: 40px;
    padding-top: 40px;
    width: 100%;
  }
}

h2 {
  font-size: 2rem;
  margin-top: 60px;
  font-weight: 500;
}

.page-title, h1, h2, h3, h4, h5 {
  font-family: 'Josefin Sans', sans-serif;
}

p {
  margin-top: 2rem;
}

hr {
  border: none;
  height: 1px;
  background: var(--border-color);
  margin: 30px 0;
}

code {
  background: rgba(255, 105, 180, 0.09);
  border-radius: 3px;
  font-size: 14px;
}

pre {
  border: 1px solid var(--border-color);
  padding: 20px;
}

pre code {
  background: transparent;
}

ul {
  padding-left: 20px;
}

table {
  width: 100%;
  border-spacing: 0;
  border-collapse: separate;
}

thead th {
  color: #666;
  background: #fafafa;
  border-top: 1px solid var(--border-color);
  font-weight: 400;
  font-size: 12px;
  padding: 10px;
}

table td, table th, thead th {
  border-bottom: 1px solid var(--border-color);
}

table td, table th {
    padding: 12px 10px;
    text-align: left;
}

thead th:first-child {
  border-left: 1px solid var(--border-color);
  border-radius: 4px 0 0 4px;
}

thead th:last-child {
  border-right: 1px solid var(--border-color);
  border-radius: 0 4px 4px 0;
}
</style>

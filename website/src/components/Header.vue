<template>
  <header class="header">
    <div class="container">
      <div class="header-left">
        <div v-if="showToggle" class="toggle" @click="toggleSidebar" role="button" aria-label="Toggle Sidebar" tabindex="0">
          <svg viewBox="0 0 512 512">
            <path
              d="M64 384h384v-42.666H64V384zm0-106.666h384v-42.667H64v42.667zM64 128v42.665h384V128H64z"
              ssrc="6.0."
            ></path>
          </svg>
        </div>
        <h1 class="logo">
          <saber-link to="/">Saber</saber-link>
        </h1>
      </div>
      <ul class="menu">
        <li class="menu-item">
          <saber-link to="/docs/">Guide</saber-link>
        </li>
        <li class="menu-item">
          <saber-link to="/tutorial/tutorial.html">Tutorial</saber-link>
        </li>
        <li class="menu-item">
          <a href="https://github.com/egoist/saber" target="_blank">GitHub</a>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    showToggle: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    toggleSidebar() {
      if (document.body.classList.contains('show-sidebar')) {
        document.body.classList.remove('show-sidebar')
      } else {
        document.body.classList.add('show-sidebar')
      }
    }
  }
}
</script>


<style scoped>
.header {
  border-bottom: 1px solid var(--border-color);
  height: var(--header-height);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--header-bg);

  & a {
    color: #000;
  }
}

.header >>> .container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle {
  margin-right: 5px;
  height: 40px;
  width: 40px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 940922px;
  margin-left: -8px;
  use-select: none;
  outline: none;

  &:hover, &:focus {
    background: #f5f5f5;
    cursor: pointer;
  }

  & svg {
    fill: currentColor;
    width: 100%;
    height: 100%;
  }

  @media (min-width: 768px) {
    display: none;
  }
}

.logo {
  font-size: 1.4rem;
  margin: 0;
  font-weight: 700;
}

.menu {
  list-style: none;
  margin: 0;
  font-size: 1rem;
  display: flex;
  height: 100%;

  & a {
    color: var(--text-light-color);
    display: flex;
    height: 100%;
    align-items: center;

    &:hover,
    &.router-link-exact-active {
      color: var(--dark);
    }

    &.router-link-exact-active {
      box-shadow: inset 0 -2px 0 var(--dark);
    }
  }
}

.menu-item {
  margin-left: 20px;
}
</style>

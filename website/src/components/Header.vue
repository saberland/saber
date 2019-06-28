<template>
  <header class="header">
    <div class="container">
      <div class="header-left">
        <div
          class="toggle"
          @click="toggleLeftbar"
          role="button"
          aria-label="Toggle Leftbar"
          tabindex="0"
        >
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
      <div class="header-right">
        <Search />
        <SiteNav />
      </div>
    </div>
  </header>
</template>

<script>
import Search from './Search.vue'
import SiteNav from './SiteNav.vue'

export default {
  components: {
    Search,
    SiteNav
  },

  methods: {
    toggleLeftbar() {
      if (document.body.classList.contains('show-leftbar')) {
        document.body.classList.remove('show-leftbar')
      } else {
        document.body.classList.add('show-leftbar')
      }
    }
  },

  mounted() {
    const Headroom = require('headroom.js')
    this.headroom = new Headroom(this.$el, {
      onPin() {
        document.body.classList.add('header-pinned')
      },
      onUnpin() {
        document.body.classList.remove('header-pinned')
      }
    })
    this.headroom.init()
  },

  beforeDestroy() {
    if (this.headroom) {
      this.headroom.destroy()
    }
  }
}
</script>


<style scoped>
.header {
  height: var(--header-height);
  background: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  transform: translateY(0);
  transition: transform 0.3s ease;

  & a {
    color: #000;
  }

  &.headroom--unpinned {
    transform: translateY(-100%);
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
  display: none;
  align-items: center;
  justify-content: center;
  border-radius: 940922px;
  margin-left: -8px;
  use-select: none;
  outline: none;

  &:hover,
  &:focus {
    background: #f5f5f5;
    cursor: pointer;
  }

  & svg {
    fill: currentColor;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 768px) {
    display: flex;
  }
}

.logo {
  font-size: 1.4rem;
  margin: 0;
  font-weight: 700;
}

.header-right {
  display: flex;
  align-items: center;
  height: 100%;
}

@media (max-width: 768px) {
  /* Hide nav on mobile because we will display it in sidebar */
  /deep/ .nav {
    display: none;
  }
}
</style>

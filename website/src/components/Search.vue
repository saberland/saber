<template>
  <div class="search" :class="{'is-focused': focused, 'fit-header': fitHeader, fullWidth}">
    <div class="search--icon" @click="handleFocus(true)">
      <svg
        width="13"
        height="13"
        viewBox="0 0 13 13"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <path
          d="M8.87 8.16l3.25 3.25-.7.71-3.26-3.25a5 5 0 1 1 .7-.7zM5 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        ></path>
      </svg>
    </div>
    <input
      type="text"
      class="search--input"
      ref="input"
      @focus="handleFocus(true)"
      @blur="handleFocus(false)"
      @input="e => $emit('change', e.target.value)"
      :id="inputId"
      :placeholder="placeholder"
    >
  </div>
</template>

<script>
export default {
  props: {
    inputId: {
      type: String
    },
    fitHeader: {
      type: Boolean
    },
    fullWidth: {
      type: Boolean
    },
    placeholder: {
      type: String
    }
  },

  data() {
    return {
      focused: false
    }
  },

  methods: {
    async handleFocus(focused) {
      this.focused = focused
      if (focused) {
        await this.$nextTick()
        this.$refs.input.focus()
      }
    }
  }
}
</script>

<style scoped>
.search {
  --search-height: calc(var(--header-height) * 0.5);
  --icon-width: 30px;
  --search-width: 240px;

  display: flex;
  margin-right: 20px;
  align-items: center;
  box-shadow: 0 0 0 1px #ddd;
  border-radius: 33px;
  height: var(--search-height);
  position: relative;
  width: var(--search-width);

  &.fullWidth {
    --search-width: 100%;
  }

  &.is-focused {
    box-shadow: 0 0 0 1px var(--theme-color);
  }

  @media (max-width: 768px) {
    &.fit-header {
      --search-width: 140px;
      width: var(--icon-width);
      margin-right: 0;

      &.is-focused {
        width: var(--search-width);
      }

      &.is-focused .search--input {
        display: block;
      }
    }
  }
}

.search--input {
  border: none;
  outline: none;
  height: var(--search-height);
  display: block;
  width: var(--search-width);
  padding-left: 30px;
  padding-right: 15px;
  border-radius: 33px;

  @media (max-width: 768px) {
    @nest .fit-header & {
      display: none;
    }
  }
}

.search--icon {
  height: 100%;
  width: var(--icon-width);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}
</style>

<template>
  <div class="themes__container">
    <div class="themes__categories">
      <div class="themes__categories--header">category</div>
      <div class="themes__categories--list">
        <div class="themes__categories--list-item" v-for="(count, key) in categories" :key="key">
          <div>
            <svg
              fill="currentColor"
              preserveAspectRatio="xMidYMid meet"
              height="1em"
              width="1em"
              viewBox="0 0 40 40"
              style="vertical-align: -0.125em;"
              @click="toggleSelection(key)"
              v-if="filters.includes(key)"
            >
              <g>
                <path
                  d="m16.6 28.4l15-15-2.3-2.5-12.7 12.7-5.9-5.9-2.3 2.3z m15-23.4c1.9 0 3.4 1.6 3.4 3.4v23.2c0 1.8-1.5 3.4-3.4 3.4h-23.2c-1.9 0-3.4-1.6-3.4-3.4v-23.2c0-1.8 1.5-3.4 3.4-3.4h23.2z"
                ></path>
              </g>
            </svg>

            <svg
              fill="currentColor"
              preserveAspectRatio="xMidYMid meet"
              height="1em"
              width="1em"
              viewBox="0 0 40 40"
              style="vertical-align:-0.125em"
              @click="toggleSelection(key)"
              v-else
            >
              <g>
                <path
                  d="m31.6 5q1.4 0 2.4 1t1 2.4v23.2q0 1.4-1 2.4t-2.4 1h-23.2q-1.4 0-2.4-1t-1-2.4v-23.2q0-1.4 1-2.4t2.4-1h23.2z m0 3.4h-23.2v23.2h23.2v-23.2z"
                ></path>
              </g>
            </svg>
            <span>{{key}}</span>
          </div>
          <span>{{count}}</span>
        </div>
      </div>
    </div>
    <div class="themes__gallery">
      <div class="themes__gallery--header">
        <span>Themes</span>
        ({{themes.length}})
      </div>
      <div class="themes__gallery--list">
        <div class="themes__card" v-for="(theme, index) in filteredThemes" :key="index">
          <div class="themes__card--header">
            <div
              class="themes__card--thumbnail"
              :style="{backgroundImage: `url(${getThumbnail(theme.thumbnail)})`}"
            ></div>
            <div class="themes__card--title">{{theme.name}}</div>
          </div>
          <div class="themes__card--footer">
            <div class="themes__card--subtitle">{{formatCategories(theme.categories)}}</div>
            <div class="themes__card--ext">
              <span class="themes__card--ext-github" v-if="theme.github">
                <a target="_blank" :href="theme.github">
                  <svg
                    fill="currentColor"
                    preserveAspectRatio="xMidYMid meet"
                    height="1rem"
                    width="1rem"
                    viewBox="0 0 40 40"
                    style="vertical-align:text-top"
                  >
                    <g>
                      <path
                        d="m20 0c-11 0-20 9-20 20 0 8.8 5.7 16.3 13.7 19 1 0.2 1.3-0.5 1.3-1 0-0.5 0-2 0-3.7-5.5 1.2-6.7-2.4-6.7-2.4-0.9-2.3-2.2-2.9-2.2-2.9-1.9-1.2 0.1-1.2 0.1-1.2 2 0.1 3.1 2.1 3.1 2.1 1.7 3 4.6 2.1 5.8 1.6 0.2-1.3 0.7-2.2 1.3-2.7-4.5-0.5-9.2-2.2-9.2-9.8 0-2.2 0.8-4 2.1-5.4-0.2-0.5-0.9-2.6 0.2-5.3 0 0 1.7-0.5 5.5 2 1.6-0.4 3.3-0.6 5-0.6 1.7 0 3.4 0.2 5 0.7 3.8-2.6 5.5-2.1 5.5-2.1 1.1 2.8 0.4 4.8 0.2 5.3 1.3 1.4 2.1 3.2 2.1 5.4 0 7.6-4.7 9.3-9.2 9.8 0.7 0.6 1.4 1.9 1.4 3.7 0 2.7 0 4.9 0 5.5 0 0.6 0.3 1.2 1.3 1 8-2.7 13.7-10.2 13.7-19 0-11-9-20-20-20z"
                      ></path>
                    </g>
                  </svg>
                </a>
              </span>
              <span class="themes__card--ext-demo" v-if="theme.demo">
                <a target="_blank" :href="theme.demo">
                  <svg
                    fill="currentColor"
                    preserveAspectRatio="xMidYMid meet"
                    height="1rem"
                    width="1rem"
                    viewBox="0 0 40 40"
                    style="vertical-align:text-top"
                  >
                    <g>
                      <path
                        d="m23.4 5h11.6v11.6h-3.4v-5.9l-16.3 16.3-2.3-2.3 16.3-16.3h-5.9v-3.4z m8.2 26.6v-11.6h3.4v11.6q0 1.4-1 2.4t-2.4 1h-23.2q-1.4 0-2.4-1t-1-2.4v-23.2q0-1.4 1-2.4t2.4-1h11.6v3.4h-11.6v23.2h23.2z"
                      ></path>
                    </g>
                  </svg>
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { themes } from '../data/themes.yml'

export const attributes = {
  layout: 'themes',
  title: 'Themes'
}

export default {
  data() {
    return {
      themes,
      filters: []
    }
  },
  computed: {
    categories() {
      const categories = {}
      this.categoryArray.forEach(category => {
        categories[category] = categories[category]
          ? categories[category] + 1
          : 1
      })
      return categories
    },
    categoryArray() {
      return themes.reduce((acc, theme) => {
        acc = [...acc, ...theme.categories]
        return acc
      }, [])
    },
    filteredThemes() {
      if (this.filters.length !== 0) {
        return this.themes.filter(theme =>
          theme.categories.some(cat => {
            return this.filters.includes(cat)
          })
        )
      } else {
        return this.themes
      }
    }
  },
  methods: {
    formatCategories(categories) {
      return categories.join(', ')
    },
    getThumbnail(name) {
      return require('../images/themes/' + name)
    },
    toggleSelection(key) {
      if (this.filters.includes(key)) {
        this.filters.splice(this.filters.indexOf(key), 1)
      } else {
        this.filters.push(key)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.themes {
  &__container {
    display: flex;
  }

  &__categories {
    padding-right: 1rem;
    flex-basis: var(--sidebar-width);

    &--header {
      text-transform: uppercase;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    &--list {
      &-item {
        display: flex;
        justify-content: space-between;
        text-transform: capitalize;
      }
    }
  }

  &__gallery {
    padding-left: 1rem;
    width: 100%;

    &--header {
      padding-bottom: 1rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);

      span {
        font-weight: 600;
      }
    }

    &--list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 3rem;
    }
  }

  &__card {
    &--header:hover &--thumbnail {
      box-shadow: 0px 4px 8px rgba(46, 41, 51, 0.08),
        0px 8px 16px rgba(71, 63, 79, 0.16);
    }

    &--thumbnail {
      height: 12rem;
      background-size: cover;
      background-position: center;
      transition: 0.3s;
      margin-bottom: 1rem;
    }

    &--title {
      font-weight: 600;
    }

    &--footer {
      display: flex;
      justify-content: space-between;
      color: hsla(270, 3.674150944000001%, 0%, 0.36);
    }

    &--subtitle {
      text-transform: capitalize;
      font-size: 0.8rem;
    }

    &--ext {
      svg {
        fill: hsla(270, 3.674150944000001%, 0%, 0.36);
      }

      svg:hover {
        fill: black;
      }
    }
  }

  @media (max-width: 960px) {
    &__gallery {
      &--list {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  @media (max-width: 768px) {
    &__categories {
      display: none;
    }
  }

  @media (max-width: 660px) {
    &__gallery {
      &--list {
        grid-template-columns: 1fr;
        justify-items: center;
      }
    }

    &__card {
      width: 20rem;
    }
  }
}
</style>

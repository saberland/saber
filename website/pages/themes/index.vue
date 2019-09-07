<template>
  <Wrap :page="page" :showEditInfo="false" mainWidth="100%">
    <template #sidebar>
      <Search @change="updateKeywords" :fullWidth="true" placeholder="Search Themes.." />
      <div class="tags">
        <div class="tag" v-for="tag in tagNames" :key="tag">
          <label>
            <input type="checkbox" v-model="checkedTags" :value="tag" />
            {{ tag }}
          </label>
          <span class="count">{{ tags[tag] }}</span>
        </div>
      </div>
    </template>

    <div class="themes-header">
      <div class="themes-title">Themes</div>
      <span
        class="themes-count"
      >{{ filteredThemes.length }} result{{ filteredThemes.length === 1 ? '' : 's' }}</span>
    </div>

    <div class="columns">
      <div class="theme column is-4" v-for="theme in filteredThemes" :key="theme.name+theme.npm">
        <a :href="theme.repo" target="_blank">
          <saber-image class="theme-preview" :src="getPreview(theme.npm)" :alt="theme.name" />
        </a>
        <div class="theme-name">
          {{ theme.name }}
          <div class="theme-links">
            <a title="Preview" class="theme-demo" :href="theme.demo" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-eye"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </a>
            <a title="Repository" class="theme-repo" :href="theme.repo" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-code"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </a>
          </div>
        </div>
        <div class="theme-tags">
          <div class="theme-tag" v-for="tag in theme.tags" :key="tag">
            <span class="hashtag">#</span>
            <span>{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </Wrap>
</template>

<script>
import Wrap from '@/src/components/Wrap.vue'
import PostMeta from '@/src/components/PostMeta.vue'
import Search from '@/src/components/Search.vue'
import themes from './_themes.yml'

export default {
  components: {
    Wrap,
    Search,
    PostMeta
  },

  props: ['page'],

  head() {
    return {
      title: `Themes - ${this.$siteConfig.title}`,
      meta: [
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:site',
          content: '@saber_land'
        },
        {
          name: 'twitter:title',
          content: 'Themes'
        }
      ]
    }
  },

  data() {
    return {
      themes,
      keywords: '',
      checkedTags: []
    }
  },

  computed: {
    filteredThemes() {
      return this.themes.filter(theme => {
        if (this.checkedTags.length > 0) {
          const matchTag = this.checkedTags.every(tag =>
            theme.tags.includes(tag)
          )
          if (!matchTag) {
            return false
          }
        }

        if (this.keywords) {
          return (
            `${theme.name} ${theme.tags.join(',')}`
              .toLowerCase()
              .indexOf(this.keywords) > -1
          )
        }
        return true
      })
    },

    tags() {
      const result = {}
      for (const theme of this.themes) {
        for (const tag of theme.tags) {
          if (result[tag] == undefined) {
            result[tag] = 0
          }
          result[tag]++
        }
      }
      return result
    },

    tagNames() {
      return Object.keys(this.tags).sort()
    }
  },

  methods: {
    getPreview(id) {
      return require(`./previews/${id}.png`)
    },

    updateKeywords(keywords) {
      this.keywords = keywords
    }
  }
}
</script>

<style scoped>
.theme-preview {
  box-shadow: 0px 1px 2px rgba(46, 41, 51, 0.08),
    0px 2px 4px rgba(71, 63, 79, 0.08);
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 3px;
  margin-bottom: 10px;

  &:hover {
    box-shadow: 0px 4px 8px rgba(46, 41, 51, 0.08),
      0px 8px 16px rgba(71, 63, 79, 0.16);
    transform: translateY(-5px);
  }
}

.theme-name {
  color: var(--text-dark-color);
  font-size: 1.1rem;
  font-weight: bold;
  overflow: auto;
}

.theme-links {
  float: right;

  & svg {
    width: 1em;
  }

  & > a:not(:last-child) {
    margin-right: 3px;
  }
}

.theme-desc {
  color: var(--text-light-color);
}

.theme-tags {
  display: flex;
}

.theme-tag {
  color: rgb(136, 136, 136);
  font-size: 0;

  &:not(:first-child) {
    margin-left: 5px;
  }

  & span {
    font-size: 0.8rem;
  }

  & .hashtag {
    color: #ccc;
    margin-right: 2px;
  }
}

.themes-header {
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 30px;
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.themes-title {
  font-size: 2rem;
  color: #000;
}

.themes-count {
  color: #ccc;
  font-size: 1.6rem;
}

.theme-search-input {
  outline: none;
  width: 100%;
  border: none;
}

.tags {
  margin-top: 20px;
}

.tag {
  display: flex;
  align-items: center;
  user-select: none;
  justify-content: space-between;

  & input {
    margin-right: 5px;
  }

  & label {
    display: flex;
    align-items: center;
  }

  & .count {
    color: #ccc;
    font-size: 0.9rem;
    font-style: italic;
  }
}
</style>

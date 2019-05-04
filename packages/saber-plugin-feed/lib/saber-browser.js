/* eslint-disable */
import Vue from 'vue'
import { jsonFeedPath, atomFeedPath, rss2FeedPath } from 'saber/variables'

const getPermalink = (localePath, feedPath) => {
  return `${localePath === '/' ? '' : localePath}/${feedPath.replace(
    /^\.?\//,
    ''
  )}`
}

Vue.mixin({
  computed: {
    $feed() {
      const allFeeds = this.$allFeeds
      const permalink = allFeeds.atom || allFeeds.rss2 || allFeeds.json
      const type = allFeeds.atom ? 'atom' : allFeeds.rss2 ? 'rss2' : 'json'
      return {
        permalink,
        type
      }
    },
    $allFeeds() {
      return {
        atom: atomFeedPath && getPermalink(this.$localePath, atomFeedPath),
        rss2: rss2FeedPath && getPermalink(this.$localePath, rss2FeedPath),
        json: jsonFeedPath && getPermalink(this.$localePath, jsonFeedPath)
      }
    }
  }
})

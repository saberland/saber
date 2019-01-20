<script>
const layouts = {}
const r = require.context('#theme/layouts', false, /\.(js|vue)$/)
r.keys().forEach(key => {
  const name = key.slice(2).replace(/\.[a-z]+$/, '')
  layouts[name] = r(key).default
})

export default {
  name: 'layout-manager',
  functional: true,
  props: {
    page: {
      type: Object,
      required: true
    }
  },
  render(
    h,
    {
      props: { page },
      children
    }
  ) {
    const layoutName = page.attributes.layout || page.attributes.type || 'default'
    const Layout = layouts[layoutName] || layouts.default

    if (!Layout) {
      console.error(`Cannot find layout component "${layoutName}" in `, layouts)
    }

    return h(Layout, { props: { page } }, children)
  }
}
</script>

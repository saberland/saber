<script>
export default {
  name: 'layout-manager',
  functional: true,
  props: {
    page: {
      type: Object,
      required: true
    }
  },
  inject: ['layouts'],
  render(
    h,
    {
      props: { page },
      children,
      injections: { layouts }
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

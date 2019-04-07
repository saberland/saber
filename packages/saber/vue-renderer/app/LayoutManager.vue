<script>
export default {
  name: 'layout-manager',
  functional: true,
  props: {
    page: {
      type: Object,
      required: true
    },
    PageComponent: {
      type: null
    }
  },
  inject: ['layouts'],
  render(
    h,
    {
      props: { page, PageComponent },
      children,
      injections: { layouts }
    }
  ) {
    const attrs = { props: { page } }

    const { layout } = page.attributes

    if (typeof layout !== 'string') {
      return PageComponent ? h(PageComponent, attrs) : h('div', {
        ...attrs,
        class: '_saber-page'
      }, children)
    }

    const LayoutComponent = layouts[layout] || layouts.default

    if (!LayoutComponent) {
      console.error(`Cannot find layout component "${layout}" in `, layouts)
    }

    return h(LayoutComponent, attrs, PageComponent ? [h(PageComponent, attrs)] : children)
  }
}
</script>

<script>
export default {
  name: 'layout-manager',
  functional: true,
  inject: ['layouts'],
  render(
    h,
    {
      injections: { layouts },
      parent,
      scopedSlots
    }
  ) {
    const page = parent.$page
    const { layout, isVueSFC } = parent.$options
    const { component: componentSlot, default: defaultSlot } = scopedSlots

    const attrs = { props: { page } }

    if (typeof layout !== 'string') {
      return componentSlot ? componentSlot(attrs.props) : h('div', {
        ...attrs,
        class: '_saber-page'
      }, defaultSlot())
    }

    const LayoutComponent = layouts[layout] || layouts.default

    if (!LayoutComponent) {
      console.error(`Cannot find layout component "${layout}" in `, layouts)
    }

    return h(LayoutComponent, attrs, componentSlot ? componentSlot(attrs.props) : defaultSlot())
  }
}
</script>

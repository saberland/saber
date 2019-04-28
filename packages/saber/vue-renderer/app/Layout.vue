<script>
export default {
  name: 'SaberLayout',
  functional: true,
  inject: ['layouts'],
  render(
    h,
    {
      scopedSlots,
      injections: { layouts },
      parent,
      data
    }
  ) {
    let pageWrapper
    const { isVueSFC, isPageWrapper } = parent.$options // .vue or .js

    if (isPageWrapper) {
      pageWrapper = parent
    } else {
      throw new Error(`You can only use the <Layout> component in a page component.`)
    }

    const page = pageWrapper.$page
    const layout = pageWrapper.$options.layout

    const attrs = { props: { page, layout }, attrs: data.attrs, scopedSlots }

    if (typeof layout !== 'string') {
      if (isVueSFC) {
        const defaultSlot = scopedSlots().default
        if (defaultSlot.length > 0) {
          console.error(`When 'layout' attribute is not specified, the default slot of <Layout> component can only have ONE child element`)
        }
        return scopedSlots().default[0]
      }
      return h('div', {
        ...attrs,
        class: '_saber-page',
      })
    }

    const LayoutComponent = layouts[layout] || layouts.default

    if (!LayoutComponent) {
      console.error(`Cannot find layout component "${layout}" in `, layouts)
    }

    return h(LayoutComponent, attrs)
  }
}
</script>

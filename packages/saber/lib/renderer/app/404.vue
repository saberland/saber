<script>
export default {
  functional: true,
  inject: ['layouts'],
  render(h, { injections: { layouts } }) {
    if (layouts['404']) {
      return h(layouts['404'])
    }
    return h('div', { class: 'not-found' }, [
      h('h1', {}, ['Not Found']),
      h('saber-link', {
        props: {
          to: '/'
        }
      }, ['Back Home'])
    ])
  }
}
</script>

<style scoped>
.not-found {
  margin: 2rem;
}
</style>


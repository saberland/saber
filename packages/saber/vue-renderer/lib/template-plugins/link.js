const getAttribute = (node, name) => {
  if (node.attrs[name] !== undefined) {
    return { value: node.attrs[name], isStatic: true }
  }

  return {
    value: node.attrs[`:${name}`] || node.attrs[`v-bind:${name}`],
    isStatic: false
  }
}

const removeAttribute = (node, name) => {
  delete node.attrs[name]
  delete node.attrs[`:${name}`]
  delete node.attrs[`v-bind:${name}`]
}

module.exports = ({ openLinkInNewTab = true } = {}) => tree => {
  tree.walk(node => {
    if (!node.attrs) return node

    if ('saber-ignore' in node.attrs) {
      delete node.attrs['saber-ignore']
      return node
    }

    const href = getAttribute(node, 'href')

    if (node.tag === 'a' && href.value) {
      node.tag = 'saber-link'
      if (href.isStatic) {
        node.attrs.to = href.value
      } else {
        node.attrs[':to'] = href.value
      }

      removeAttribute(node, 'href')

      if (
        openLinkInNewTab === false &&
        getAttribute(node, 'openLinkInNewTab').value === undefined
      ) {
        node.attrs[':openLinkInNewTab'] = JSON.stringify(openLinkInNewTab)
      }
    }

    return node
  })
}

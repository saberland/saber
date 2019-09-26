const isExernal = input => /^[^:]+:/i.test(input)

module.exports = () => tree => {
  tree.walk(node => {
    if (!node.attrs) return node

    if ('saber-ignore' in node.attrs) {
      delete node.attrs['saber-ignore']
      return node
    }

    if (node.tag === 'a' && node.attrs.href) {
      if (isExernal(node.attrs.href)) {
        // Add attributes for external link
        if (/^https?:\/\//.test(node.attrs.href)) {
          node.attrs = Object.assign(
            {
              target: '_blank',
              rel: 'noopener noreferrer'
            },
            node.attrs
          )
        }
      } else {
        // Convert internal `<a>` to `<saber-link>`
        node.tag = 'saber-link'
        // Resolve link using `getPageLink`
        node.attrs[':to'] = `$saber.getPageLink('${node.attrs.href}')`
        delete node.attrs.href
      }
    }

    // Resolve link using `getPageLink`
    if (node.tag === 'saber-link' && node.attrs.to) {
      node.attrs[':to'] = `$saber.getPageLink('${node.attrs.to}')`
      delete node.attrs.to
    }

    return node
  })
}

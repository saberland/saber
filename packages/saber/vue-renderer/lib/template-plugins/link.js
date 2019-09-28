const { isAbsoluteUrl } = require('saber-utils')

module.exports = ({ openLinkInNewTab = true } = {}) => tree => {
  tree.walk(node => {
    if (!node.attrs) return node

    if ('saber-ignore' in node.attrs) {
      delete node.attrs['saber-ignore']
      return node
    }

    if (node.tag === 'a' && node.attrs.href) {
      if (isAbsoluteUrl(node.attrs.href)) {
        // Add attributes for external link
        if (/^https?:\/\//.test(node.attrs.href)) {
          node.attrs = Object.assign(
            {
              target: openLinkInNewTab ? '_blank' : undefined,
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

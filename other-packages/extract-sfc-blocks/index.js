const posthtml = require('posthtml')
const stringifyAttrs = require('stringify-attributes')

function stringifyNode(node) {
  if (typeof node === 'string') {
    return node
  }

  const content = node.content || []
  return `<${node.tag}${stringifyAttrs(node.attrs || {})}>${content
    .map(n => stringifyNode(n))
    .join('')}</${node.tag}>`
}

module.exports = input => {
  const blocks = []
  const { html } = posthtml([
    tree =>
      tree.walk(node => {
        if (node.tag === 'script' || node.tag === 'style') {
          blocks.push(stringifyNode(node))
          return
        }

        return node
      })
  ]).process(input, {
    sync: true,
    recognizeSelfClosing: true
  })

  return {
    html,
    blocks
  }
}

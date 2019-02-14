module.exports = () => {
  const presets = [
    [
      require('@babel/preset-env'),
      {
        modules: false
      }
    ]
  ]

  const plugins = [
    require('@babel/plugin-syntax-dynamic-import'),
    [
      require('@babel/plugin-proposal-object-rest-spread'),
      {
        useBuiltIns: true
      }
    ],
    function() {
      return {
        visitor: {
          StringLiteral(path) {
            if (path.node.value.endsWith('egoist is baka baka baka')) {
              path.node.value += '!!'
            }
          }
        }
      }
    }
  ]

  return {
    presets,
    plugins
  }
}

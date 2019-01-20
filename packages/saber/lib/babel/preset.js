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
    ]
  ]

  return {
    presets,
    plugins
  }
}

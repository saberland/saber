module.exports = () => {
  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          modules: false
        }
      ]
    ],
    plugins: [
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      require.resolve('@babel/plugin-transform-runtime'),
      require.resolve('babel-plugin-macros')
    ]
  }
}

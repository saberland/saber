export default {
  input: './src/index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs'
  },
  plugins: [
    require('rollup-plugin-commonjs')(),
    require('rollup-plugin-node-resolve')(),
    require('rollup-plugin-json')(),
    require('rollup-plugin-babel')({
      plugins: [require('./babel-plugin-vue-features')]
    }),
    require('rollup-plugin-terser').terser()
  ],
  external: require('builtin-modules')
}

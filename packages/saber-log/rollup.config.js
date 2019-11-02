export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
    require('rollup-plugin-typescript2')({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true
        }
      }
    })
  ]
}

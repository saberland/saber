// this might be useful for eslint-plugin-import
const app = require('.')()

module.exports = app.getWebpackConfigForESLint()

/* example .eslintrc
{
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": "./node_modules/saber/webpack.config.js"
      }
    }
  }
}
*/

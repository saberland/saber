const { prefixSpace } = require('./utils')

/**
 * Get the initial HTML sent from server-side
 * @param {any} documentData
 */
module.exports = ({
  title,
  meta,
  link,
  style,
  headScript,
  bodyScript,
  noscript,
  bodyAttrs,
  headAttrs,
  htmlAttrs
}) => {
  return `
    <html${prefixSpace(htmlAttrs)}>
      <head${prefixSpace(headAttrs)}>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        ${meta} ${title} ${link}
        ${style} ${headScript} ${noscript}
      </head>
      <body${prefixSpace(bodyAttrs)}>
        <div id="_saber"></div>
        ${bodyScript}
      </body>
    </html>
  `
}

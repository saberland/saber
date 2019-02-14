/**
 * Get the initial HTML sent from server-side
 * @param {any} context - ssr context
 */
module.exports = context => {
  const {
    title,
    meta,
    link,
    style,
    script,
    noscript,
    bodyAttrs,
    headAttrs,
    htmlAttrs
  } = context.head

  return `
    <html${htmlAttrs}>
      <head${headAttrs}>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        ${meta} ${title} ${link} ${context.renderStyles()}
        ${style} ${script} ${noscript}
      </head>
      <body${bodyAttrs}>
        <div id="_saber"></div>
        ${context.renderState()}
        ${context.renderScripts()}
      </body>
    </html>
  `
}

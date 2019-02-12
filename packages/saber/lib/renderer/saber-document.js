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
  } = context.head.inject()

  return `
    <html data-saber-ssr ${htmlAttrs.text()}>
      <head ${headAttrs.text()}>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        ${meta.text()} ${title.text()} ${link.text()} ${context.renderStyles()}
        ${style.text()} ${script.text()} ${noscript.text()}
      </head>
      <body ${bodyAttrs.text()}>
        <div id="_saber"></div>
        ${context.renderState()}
        ${context.renderScripts()}
      </body>
    </html>
  `
}

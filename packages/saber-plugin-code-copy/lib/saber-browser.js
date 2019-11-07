/* eslint-env browser */
/* globals __CODE_COPY_OPTIONS__ */

export default ({ router }) => {
  if (process.browser) {
    const copy = require('modern-copy').default

    const forEach = (arr, fn) => Array.prototype.forEach.call(arr, fn)
    const { statusAttribute = 'title', buttonStyle } = __CODE_COPY_OPTIONS__

    let isStyleInjected = false
    const injectStyle = () => {
      if (isStyleInjected) {
        return
      }

      const style = document.createElement('style')
      style.id = 'saber-plugin-code-copy-style'
      style.append(
        document.createTextNode(`
      .saber-highlight {position: relative;}
      .saber-highlight:hover:before {display: none !important;}
      .saber-highlight:hover .saber-plugin-code-copy-button {
        opacity: 1;
      }
      .saber-plugin-code-copy-button {
        opacity: 0;
        position: absolute;
        right: 8px;
        top: 8px;
        z-index: 2000;
        background: #f0f0f0;
        color: inherit;
        padding: 3px 6px;
        border-radius: 4px;
        cursor: pointer;
        border: 1px solid #ccc;
        transition: opacity .3s ease-in-out;
      }
      `)
      )
      document.head.append(style)
      isStyleInjected = true
    }

    router.afterEach(() => {
      setTimeout(() => {
        forEach(document.querySelectorAll('.saber-highlight'), el => {
          if (el.dataset.hasCopy) return
          el.dataset.hasCopy = true
          const copyButton = document.createElement('button')
          copyButton.className = 'saber-plugin-code-copy-button'
          copyButton.innerHTML = `<svg height="16" class="codecopy-btn-icon" viewBox="0 0 14 16" version="1.1" width="16" aria-hidden="true">
          <path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path>
        </svg>`
          copyButton.setAttribute(statusAttribute, 'Copy')
          copyButton.addEventListener('click', () => {
            copy(el.querySelector('.saber-highlight-code').textContent)
            copyButton.setAttribute(statusAttribute, 'Copied')
          })
          copyButton.addEventListener('mouseleave', () => {
            copyButton.setAttribute(statusAttribute, 'Copy')
          })
          Object.assign(copyButton.style, buttonStyle)
          injectStyle()
          el.append(copyButton)
        })
      }, 100)
    })
  }
}

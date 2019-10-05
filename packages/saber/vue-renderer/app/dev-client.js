import client from 'webpack-hot-middleware/client'
import { createContainer, createCss } from './helpers/build-indicator'

export const init = ({ router }) => {
  window.__SABER_DEV_CLIENT_ID__ = Math.random()
    .toString(36)
    .substring(7)

  const shadowHost = document.createElement('div')
	shadowHost.id = '__saber-build-watcher'
	// Make sure container is fixed and on a high zIndex so it shows
	shadowHost.style.position = 'fixed'
	shadowHost.style.bottom = '10px'
	shadowHost.style.right = '20px'
	shadowHost.style.width = 0
	shadowHost.style.height = 0
	shadowHost.style.zIndex = 99999
	document.body.appendChild(shadowHost)

	let shadowRoot
	let prefix = ''

	if (shadowHost.attachShadow) {
	  shadowRoot = shadowHost.attachShadow({ mode: 'open' })
	} else {
	  // If attachShadow is undefined then the browser does not support
	  // the Shadow DOM, we need to prefix all the names so there
	  // will be no conflicts
	  shadowRoot = shadowHost
	  prefix = '__saber-build-watcher-'
	}

	// Container
	const container = createContainer(prefix)
	shadowRoot.appendChild(container)

	// CSS
	const css = createCss(prefix)
	shadowRoot.appendChild(css)

	// State
	let isVisible = false
	let isBuilding = false
	let timeoutId = null

	function updateContainer () {
	  if (isBuilding) {
	    container.classList.add(`${prefix}building`)
	  } else {
	    container.classList.remove(`${prefix}building`)
	  }

	  if (isVisible) {
	    container.classList.add(`${prefix}visible`)
	  } else {
	    container.classList.remove(`${prefix}visible`)
	  }
	}

  client.subscribeAll(obj => {
    if (obj.action === 'router:push' && obj.id === __SABER_DEV_CLIENT_ID__) {
      if (obj.hasError) {
        console.error(`You need to refresh the page when the error is fixed!`)
      }
      if (obj.alreadyBuilt) {
        router.push(obj.route)
      } else {
        const handler = status => {
          if (status === 'idle') {
            module.hot.removeStatusHandler(handler)
            router.push(obj.route)
          }
        }
        module.hot.addStatusHandler(handler)
      }
    } else if (obj.action === 'building') {
    	timeoutId && clearTimeout(timeoutId)
      isVisible = true
      isBuilding = true
      updateContainer()
    } else if (obj.action === 'built') {
    	isBuilding = false
      // Wait for the fade out transtion to complete
      timeoutId = setTimeout(() => {
        isVisible = false
        updateContainer()
      }, 100)
      updateContainer()
    }
  })
}

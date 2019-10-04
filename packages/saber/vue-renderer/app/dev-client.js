import client from 'webpack-hot-middleware/client'

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

function createContainer (prefix) {
  const container = document.createElement('div')
  container.id = `${prefix}container`
  container.innerHTML = `
    <div id="${prefix}icon-wrapper">
      <svg viewBox="0 0 300 200">
			  <defs>
				  <linearGradient
			      x1="114.720775%"
			      y1="181.283245%"
			      x2="39.5399306%"
			      y2="100%"
			      id="${prefix}burn"
			    >
			      <stop stop-color="#6e722a" offset="0%" />
			      <stop stop-color="#ddda60" offset="100%" />
			    </linearGradient>
			    <linearGradient
			      x1="114.720775%"
			      y1="181.283245%"
			      x2="39.5399306%"
			      y2="100%"
			      id="${prefix}cold"
			    >
			      <stop stop-color="#fff" offset="0%" />
			      <stop stop-color="#000" offset="100%" />
			    </linearGradient>
			  </defs>
			  <circle class="firstSeal" cx="150" cy="100" r="80" fill="url(#${prefix}cold)" />
			  <circle cx="150" cy="93" r="75" fill="#fff" />
			  
			  <circle class="secondSeal" cx="150" cy="95" r="45" fill="url(#${prefix}cold)" />
			  <circle cx="150" cy="100" r="42" fill="#fff" />
			  
			  <circle class="lastSeal" cx="150" cy="97" r="36" fill="url(#${prefix}cold)" />
			  <circle cx="150" cy="92" r="32.5" fill="#fff" />
			  
			  <path class="secondSeal" d="M150,10 Q158,50 150,90 M150,10 Q142,50 150,90"  fill="url(#${prefix}cold)" />
			</svg>
    </div>
  `

  return container
}

function createCss (prefix) {
  const css = document.createElement('style')
  css.textContent = `
    #${prefix}container {
      position: absolute;
      bottom: 10px;
      right: 30px;
      background: #fff;
      color: #000;
      font: initial;
      cursor: initial;
      letter-spacing: initial;
      text-shadow: initial;
      text-transform: initial;
      visibility: initial;
      padding: 0;
      align-items: center;
      box-shadow: 0 11px 40px 0 rgba(0, 0, 0, 0.25), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
      display: none;
      opacity: 0;
      border-radius: 50%;
      transition: opacity 0.1s ease, bottom 0.1s ease;
      animation: ${prefix}fade-in 0.1s ease-in-out;
    }
    #${prefix}container.${prefix}visible {
      display: flex;
    }
    #${prefix}container.${prefix}building {
      bottom: 20px;
      opacity: 1;
    }
    #${prefix}icon-wrapper {
      width: 48px;
      height: 48px;
    }
    #${prefix}icon-wrapper > svg {
      width: 100%;
      height: 100%;
    }
    #${prefix}icon-group {
      animation: ${prefix}strokedash 1s ease-in-out both infinite;
    }
    @keyframes ${prefix}fade-in {
      from {
        bottom: 10px;
        opacity: 0;
      }
      to {
        bottom: 20px;
        opacity: 1;
      }
    }
    @keyframes firstSeal {
		  0% {
		    opacity: 1;
		    fill: url("#${prefix}burn");
		  }
		  30% {
		    opacity: 0;
		  }
		  90% {
		    opacity: 0;
		  }
		  91% {
		    opacity: 1;
		  }
		  100% {
		    opacity: 1;
		  }
		}
		@keyframes secondSeal {
		  30% {
		    opacity: 1;
		    fill: url("#${prefix}burn");
		  }
		  60%{
		    opacity: 0;
		  }
		  90% {
		    opacity: 0;
		  }
		  91% {
		    opacity: 1;
		  }
		  100% {
		    opacity: 1;
		  }
		}
		@keyframes lastSeal {
		  60% {
		    opacity: 1;
		    fill: url("#${prefix}burn");
		  }
		  90%{
		    opacity: 0;
		  }
		  91% {
		    opacity: 1;
		  }
		  100% {
		    opacity: 1;
		  }
		}
		.firstSeal {
		  animation: firstSeal 1s ease-in-out both infinite;
		}
		.secondSeal {
		  animation: secondSeal 1s ease-in-out both infinite;
		}
		.lastSeal {
		  animation: lastSeal 1s ease-in-out both infinite;
		}
  `

  return css
}
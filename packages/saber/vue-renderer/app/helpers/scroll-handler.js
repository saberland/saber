/*
  modified after Vue Router's scroll util
  https://github.com/vuejs/vue-router/blob/3c7d8ab20f9c716652e92065767a5a44ffb21c13/src/util/scroll.js
*/

/**
 *
 * @param {object} router Vue Router instance
 * @param {object} to Destination route
 * @param {object} from Starting route
 */
export default function(router, to, from) {
  if (!router.app) {
    return
  }

  const behavior = router.options.scrollBehavior
  if (!behavior) {
    return
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(() => {
    const shouldScroll = behavior.call(router, to, from, null)

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll
        .then(shouldScroll => {
          scrollToPosition(shouldScroll)
        })
        .catch(err => {
          if (process.env.NODE_ENV !== 'production') {
            console.error(err)
          }
        })
    } else {
      scrollToPosition(shouldScroll)
    }
  })
}

function getElementPosition(el, offset) {
  const docEl = document.documentElement
  const docRect = docEl.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition(obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition(obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset(obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber(v) {
  return typeof v === 'number'
}

function scrollToPosition(shouldScroll) {
  let position
  const isObject = typeof shouldScroll === 'object'
  if (isObject && typeof shouldScroll.selector === 'string') {
    const el = document.getElementById(shouldScroll.selector.substr(1))
    if (el) {
      let offset =
        shouldScroll.offset && typeof shouldScroll.offset === 'object'
          ? shouldScroll.offset
          : {}
      offset = normalizeOffset(offset)
      position = getElementPosition(el, offset)
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll)
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll)
  }

  if (position) {
    window.scrollTo(position.x, position.y)
  }
}

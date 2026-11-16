import { h } from '@magic/hyperapp'

/** @import { VNode } from '@magic/hyperapp' */

/**
 * @param {string} name
 * @returns {(props?: unknown, children?: unknown) => VNode}
 */
export const component =
  name =>
  (props = {}, children) => {
    if (lib.is(children, 'undefined')) {
      // are there children that have been processed by h already?
      if (/** @type {Record<string, unknown>} */ (props).props) {
        return h(name, {}, [props])
      }

      if (
        lib.is(props, 'string') ||
        lib.is.number(props) ||
        lib.is(props, 'function') ||
        lib.is.array(props)
      ) {
        children = props
        props = {}
      } else if (lib.is(/** @type {Record<string, unknown>} */ (props).View, 'function')) {
        children = /** @type {Record<string, unknown>} */ (props).View
        props = {}
      }
    }

    return h(name, props, children)
  }

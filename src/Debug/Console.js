import { queryObject } from '../helper/querystring'

/**
 * Load vConsole according querystring. When specified pattern is found in
 * querystring, vConsole will be enabled.
 *
 * WARNING: If you are using Babel, you need to enable @babel/plugin-syntax-dynamic-import.
 *
 * @see https://github.com/Tencent/vConsole
 */
class Console {
  /**
   * @param {string} [field='debug'] field will be searched in querystring
   */
  constructor(field = 'debug') {
    const qo = queryObject()
    const hasField = qo[field] !== undefined
    if (hasField) {
      import('vconsole').then(({ default: VConsole }) => {
        new VConsole()
      })
    }
  }
}

export default Console

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
   * @param {RegExp} [pattern=/debug/] pattern will be searched
   */
  constructor(pattern = /debug/) {
    if (pattern.test(location.search)) {
      import('vconsole').then(({ default: VConsole }) => {
        new VConsole()
      })
    }
  }
}

export default Console

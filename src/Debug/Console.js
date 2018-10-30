class Console {
  constructor(pattern = /debug/) {
    if (pattern.test(location.search)) {
      import('vconsole').then(({ default: VConsole }) => {
        new VConsole()
      })
    }
  }
}

export default Console

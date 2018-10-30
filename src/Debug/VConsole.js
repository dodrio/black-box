class VConsole {
  constructor(pattern = /debug/) {
    if (pattern.test(location.search)) {
      import('vconsole').then(({ default: VC }) => {
        new VC()
      })
    }
  }
}

export default VConsole

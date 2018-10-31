import { Tween as $Tween } from 'black-engine'

// Add complete() for origin Tween
class Tween extends $Tween {
  constructor(...args) {
    super(...args)
    this.mIsComplete = false
  }

  onAdded(gameObject) {
    this.on('complete', () => {
      this.mIsComplete = true
    })

    super.onAdded(gameObject)
  }

  complete() {
    return new Promise(resolve => {
      if (this.mIsComplete) {
        resolve()
      } else {
        this.on('complete', resolve)
      }
    })
  }
}

export default Tween

import { Tween as $Tween } from 'black-engine'

// Add complete() for origin Tween
class Tween extends $Tween {
  constructor(...args) {
    super(...args)
    this.mIsCompleted = false
  }

  onAdded(gameObject) {
    this.on('complete', () => {
      this.mIsCompleted = true
    })

    super.onAdded(gameObject)
  }

  complete() {
    return new Promise(resolve => {
      if (this.mIsCompleted) {
        resolve()
      } else {
        this.on('complete', resolve)
      }
    })
  }
}

export default Tween

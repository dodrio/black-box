import Tween from './Tween'

const IN = 'in'
const OUT = 'out'

class Fade extends Tween {
  constructor({ type = IN, duration = 1 } = {}, onComplete) {
    if (type === IN) {
      super({ alpha: 1 }, duration)
      this.startValue = 0
    } else if (type === OUT) {
      super({ alpha: 0 }, duration)
      this.startValue = 1
    } else {
      throw new Error(`[Fade] unknown type - ${type}`)
    }

    this.mOnComplete = onComplete
  }

  onAdded(gameObject) {
    if (this.mOnComplete) {
      this.on('complete', () => {
        this.mOnComplete()
      })
    }

    gameObject.alpha = this.startValue
    super.onAdded()
  }
}

export default Fade

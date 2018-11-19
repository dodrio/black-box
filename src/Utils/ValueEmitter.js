import { Black, GameObject } from 'black-engine'
import { Tween } from '../Animation'

/**
 * @experimental
 */
class ValueEmitter extends GameObject {
  constructor({ start = 0, end, duration = 0.5 } = {}) {
    super()

    this.mStartValue = start
    this.mEndValue = end
    this.mDuration = duration
    this.mIsComplete = false
    Black.stage.addChild(this)
  }

  serial(value) {
    if (!this.tween) return
    this.tween.serial({ value })
  }

  onAdded() {
    this.value = this.mStartValue
    this.tween = new Tween({}, this.mDuration, { removeOnComplete: false })
    this.tween.on('update', () => {
      if (this.mEndValue && this.value === this.mEndValue) {
        if (!this.mIsComplete) {
          this.mIsComplete = true
          this.post('complete')
        }
      }
    })
    this.addComponent(this.tween)
  }
}

export default ValueEmitter

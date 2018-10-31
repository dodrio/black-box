import { Tween, Ease } from 'black-engine'

class Breath extends Tween {
  constructor({ duration = 1.5 } = {}, onComplete) {
    super({ alpha: 1 }, duration, {
      yoyo: true,
      loop: true,
      ease: Ease.cubicInOut,
    })

    this.mOnComplete = onComplete
  }

  onAdded(gameObject) {
    gameObject.alpha = 0
    gameObject.completeAnimation = this.complete

    super.onAdded()
  }

  // End the animation by playing the remaining animations.
  // Or, it will be awkward with a breaking animation.
  end = () => {
    if (this.mOnComplete) {
      this.on('complete', this.mOnComplete)
    }

    this.pause()
    this.loop = false
    this.repeats = this.mIsYoyoBack ? 0 : 1
    this.play()
  }
}

export default Breath

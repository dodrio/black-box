import { Tween, Ease } from '@2players/black-engine'

/**
 * A common animation - breath.
 *
 * @example
 * const breath = new Breath({ duration: 2 })
 * gameObject.addComponent(breath)
 *
 * // 10 seconds later
 * breath.end()
 */
class Breath extends Tween {
  /**
   * @param {Object} args
   * @param {number} [args.duration=1.5] duration of animation
   * @param {function} onComplete callback will be called when animation is completed
   */
  constructor({ duration = 1.5 } = {}, onComplete) {
    super({ alpha: 1 }, duration, {
      yoyo: true,
      loop: true,
      ease: Ease.cubicInOut,
    })

    /**
     * @private
     */
    this.mOnComplete = onComplete
  }

  /**
   * @ignore
   */
  onAdded(gameObject) {
    gameObject.alpha = 0
    gameObject.completeAnimation = this.complete

    super.onAdded()
  }

  /**
   * End the animation by playing the remaining animations. Or, it will be
   * awkward with a breaking animation.
   */
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

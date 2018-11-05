import Tween from './Tween'

const IN = 'in'
const OUT = 'out'

/**
 * A common animation - fade.
 *
 * @example
 * const fade = new Fade({ type: 'in' })
 * gameObject.addComponent(fade)
 */
class Fade extends Tween {
  /**
   * @param {Object} args
   * @param {string} [args.type='in'] type of animation, valid value: `in` / `out`
   * @param {number} [args.duration=1] duration of animation
   * @param {function} onComplete callback will be called when animation is completed
   */
  constructor({ type = IN, duration = 1 } = {}, onComplete) {
    if (type === IN) {
      super({ alpha: 1 }, duration)
      /**
       * @ignore
       */
      this.startValue = 0
    } else if (type === OUT) {
      super({ alpha: 0 }, duration)
      /**
       * @ignore
       */
      this.startValue = 1
    } else {
      throw new Error(`[Fade] unknown type - ${type}`)
    }

    /**
     * @access private
     */
    this.mOnComplete = onComplete
  }

  /**
   * @ignore
   */
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

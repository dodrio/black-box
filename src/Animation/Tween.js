import { Tween as $Tween } from '@2players/black-engine'

/**
 * Extended version of Tween provided by Black Engine.
 */
class Tween extends $Tween {
  /**
   * @ignore
   */
  constructor(...args) {
    super(...args)

    /**
     * @access private
     */
    this.mIsCompleted = false

    /**
     * @access private
     */
    this.mValuesCache = []
  }

  /**
   * Queue a new values to be tweened.
   *
   * @example
   * const tween = new Tween({ x: 200 }, 0.2, {
   *   removeOnComplete: false,
   * })
   *
   * gameObject.addComponent(tween)
   *
   * tween.serial({ x: 300 })
   * tween.serial({ x: 450 })
   */
  serial(values) {
    this.mValuesCache.push(values)
  }

  /**
   * @ignore
   */
  onAdded(gameObject) {
    this.on('complete', () => {
      this.mIsCompleted = true
    })

    super.onAdded(gameObject)
  }

  /**
   * @ignore
   */
  onUpdate() {
    if (!this.isPlaying && this.mValuesCache.length > 0) {
      const values = this.mValuesCache.splice(0, 1)[0]
      const { duration } = this
      this.to(values, duration).play()
    }

    super.onUpdate()
  }

  /**
   * @return {Promise} It will be resolved when current tween is completed.
   */
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

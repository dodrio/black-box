import { Tween as $Tween } from 'black-engine'

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

import { Component } from 'black-engine'
import random from '@m31271n/random-number'

/**
 * A common animation - shake.
 *
 * @example
 * const shake = new Shake({ offset: 3 })
 * gameObject.addComponent(shake)
 */
class Shake extends Component {
  /**
   * @param {Object} args
   * @param {number} [args.offset=3] max offset of shaking
   */
  constructor({ offset = 3 } = {}) {
    super()
    this.mOffset = offset
    this.mOriginalX = 0
    this.mOriginalY = 0
  }

  onAdded() {
    this.mOriginalX = this.gameObject.x
    this.mOriginalY = this.gameObject.y
  }

  onUpdate() {
    if (!this.gameObject) return

    const { mOffset: offset } = this

    const offsetX = random({
      min: -offset,
      max: offset,
      float: true,
      includeMax: true,
    })

    const offsetY = random({
      min: -offset,
      max: offset,
      float: true,
      includeMax: true,
    })

    this.gameObject.x = this.mOriginalX + offsetX
    this.gameObject.y = this.mOriginalY + offsetY
  }
}

export default Shake

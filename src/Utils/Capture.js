import {
  Black,
  Device,
  GameObject,
  CanvasRenderTexture,
} from '@2players/black-engine'
import classname from '../helper/classname'

/**
 * Capture a game object.
 *
 * @example
 *
 * const gameObject = new GameObject()
 * // add content to above game object.
 * // ...
 *
 * const capture = new Capture({ debug: true })
 * capture.shot(gameObject)
 */
class Capture extends GameObject {
  constructor({ debug = false } = {}) {
    super()

    this.mDebug = debug

    this.mMatrix = Black.instance.stage.mWorldTransform.clone().invert()
    const scale = 1 / Device.getDevicePixelRatio()
    this.mMatrix.scale(scale, scale)
    this.mMatrix.setTranslation(0, 0)

    this.mRenderTexture = new CanvasRenderTexture(0, 0, 1)
  }

  shot(gameObject, { type, encoderOptions } = {}) {
    if (this.mDebug) {
      // eslint-disable-next-line
      console.time(`[${classname(this)}] spend time`)
    }

    const { width, height, x, y } = gameObject

    this.mRenderTexture.resize(width, height, 1)

    this.post('beforecapture')
    gameObject.x = 0
    gameObject.y = 0
    Black.driver.render(gameObject, this.mRenderTexture, this.mMatrix)
    gameObject.x = x
    gameObject.y = y
    this.post('aftercapture')

    const canvas = this.mRenderTexture.native
    const url = canvas.toDataURL(type, encoderOptions)

    if (this.mDebug) {
      // eslint-disable-next-line
      console.timeEnd(`[${classname(this)}] spend time`)
    }

    return url
  }
}

export default Capture

import { Black, GameObject } from 'black-engine'
import Layer from '../Layer'
import { transformDOM } from '../helper/dom'

/**
 * It add an transparent <img> on the top of canvas for saving image on mobile
 * devices.
 *
 * @example
 * // common usage
 * const savedImage = new SavingImage({ debug: true })
 * savedImage.src = 'path/to/image'
 *
 * @example
 * // usage with Capture
 * const savedImage = new SavingImage({ debug: true })
 * const capture = new Capture({ debug: true })
 * const url = capture.shot(gameObject)
 * savedImage.src = url
 *
 * // Now, hold on the screen of mobile devices, image will be saved.
 */
class SavingImage extends GameObject {
  constructor({ debug = false } = {}) {
    super()

    this.mDebug = debug
    this.mDom = document.createElement('img')
  }

  set src(url) {
    this.mDom.src = url
  }

  onAdded() {
    const { containerElement, stage } = Black.instance
    const { mDom } = this
    mDom.style.position = 'absolute'
    mDom.style.width = `${stage.width}px`
    mDom.style.height = `${stage.height}px`
    mDom.style.zIndex = Layer.DOM_INTERACTION
    this.position()
    containerElement.appendChild(mDom)

    if (this.mDebug) {
      mDom.style.opacity = 0.2
    } else {
      mDom.style.opacity = 0
    }

    this.resizeListener = Black.instance.stage.on('resize', this.position)
  }

  onRemoved() {
    const { containerElement } = Black.instance
    containerElement.removeChild(this.mDom)
    this.resizeListener.off()
  }

  position = () => {
    const { mDom: dom } = this
    const { stage } = Black.instance
    const matrix = stage.worldTransformation
    transformDOM(dom, matrix)
  }
}

export default SavingImage

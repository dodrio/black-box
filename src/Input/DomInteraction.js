import { Black, Component } from 'black-engine'
import Layer from '../Layer'
import { transformDOM } from '../helper/dom'

class DomInteraction extends Component {
  constructor(
    callback,
    { events = ['touchend', 'click'], once = false, debug = false } = {}
  ) {
    super()

    if (!callback || typeof callback !== 'function') {
      throw new Error('[DomInteraction] invalid callback')
    }

    this.mDom = null
    this.mEvents = events
    this.mOnce = once
    this.mTriggeredOnce = false
    this.mCallback = callback
    this.mDebug = debug
  }

  cb = () => {
    if (this.mOnce && this.mTriggeredOnce) return

    this.mTriggeredOnce = true
    this.mCallback()
  }

  onAdded(gameObject) {
    const { containerElement } = Black.instance
    const { width, height } = gameObject

    const dom = document.createElement('div')
    this.mDom = dom
    dom.style.position = 'absolute'
    dom.style.width = `${width}px`
    dom.style.height = `${height}px`
    dom.style.zIndex = Layer.DOM_INTERACTION
    this.position()
    containerElement.appendChild(dom)

    if (this.mDebug) {
      dom.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'
    }

    this.mEvents.forEach(event => {
      dom.addEventListener(event, this.cb)
    })

    Black.instance.stage.on('resize', this.position, this)
  }

  onRemoved() {
    const { containerElement } = Black.instance

    this.mEvents.forEach(event => {
      this.mDom.removeEventListener(event, this.cb)
    })

    containerElement.removeChild(this.mDom)

    Black.instance.stage.off('resize')
  }

  position() {
    const { gameObject, mDom: dom } = this
    const matrix = gameObject.worldTransformation
    transformDOM(dom, matrix)
  }
}

export default DomInteraction

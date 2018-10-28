import { Black, Component } from 'black-engine'
import Layer from '../Layer'
import { transformDOM } from '../helper/dom'

class DomInteraction extends Component {
  constructor(callback, { events = ['touchend'], debug = false } = {}) {
    super()

    if (!callback || typeof callback !== 'function') {
      throw new Error('[DomInteraction] invalid callback')
    }

    this.mDom = null
    this.mEvents = events
    this.mCallback = callback
    this.mDebug = debug
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
      dom.addEventListener(event, this.mCallback)
    })

    Black.instance.stage.on('resize', this.position, this)
  }

  onRemoved() {
    const { containerElement } = Black.instance

    this.mEvents.forEach(event => {
      this.mDom.removeEventListener(event, this.mCallback)
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

import { Component } from 'black-engine'

class DocumentInteraction extends Component {
  constructor(callback, { events = ['touchend', 'click'], once = false } = {}) {
    super()

    if (!callback || typeof callback !== 'function') {
      throw new Error('[DocumentInteraction] invalid callback')
    }

    this.mDom = null
    this.mEvents = events
    this.mOnce = once
    this.mTriggeredOnce = false
    this.mCallback = callback
  }

  cb = () => {
    if (this.mOnce && this.mTriggeredOnce) return

    this.mTriggeredOnce = true
    this.mCallback()
  }

  onAdded() {
    this.mEvents.forEach(event => {
      document.addEventListener(event, this.cb)
    })
  }

  onRemoved() {
    this.mEvents.forEach(event => {
      document.removeEventListener(event, this.cb)
    })
  }
}

export default DocumentInteraction

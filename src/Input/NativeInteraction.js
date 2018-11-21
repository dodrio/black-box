import { Component, GameObject, Input } from '@2players/black-engine'

class NativeInteraction extends Component {
  constructor(callback, { events = ['touchend'] } = {}) {
    super()

    if (!callback || typeof callback !== 'function') {
      throw new Error('[NativeInteraction] invalid callback')
    }

    this.mEvents = events
    this.mCallback = callback
  }

  eventHandler = () => {
    if (GameObject.intersects(this.gameObject, Input.pointerPosition)) {
      this.mCallback()
    }
  }

  onAdded() {
    this.mEvents.forEach(event => {
      document.addEventListener(event, this.eventHandler)
    })
  }

  onRemoved() {
    this.mEvents.forEach(event => {
      document.removeEventListener(event, this.eventHandler)
    })
  }
}

export default NativeInteraction

import { Component } from 'black-engine'

class ScaleButton extends Component {
  constructor(scale = 0.95) {
    super()

    this.mScale = scale
    this.mOnPointerUp = null
    this.mOnPointerDown = null
    this.mOriginalScale = 1
  }

  onAdded(gameObject) {
    this.mOriginalScale = gameObject.scale

    this.mOnPointerUp = gameObject.on('pointerUp', () => {
      gameObject.scale = this.mOriginalScale
    })

    this.mOnPointerDown = gameObject.on('pointerDown', () => {
      gameObject.scale = this.mOriginalScale * this.mScale
    })
  }

  onRemoved() {
    this.mOnPointerUp.off()
    this.mOnPointerDown.off()
  }
}

export default ScaleButton

import { Component, Tween, Ease } from 'black-engine'

class Wave extends Component {
  constructor({ x, duration = 2 } = {}) {
    super()
    this.t = 0
    this.mDestX = x
    this.mDuration = duration

    this.magicNumber = 3 // magic number for a smooth wave
    this.T = this.mDuration * this.magicNumber
  }

  onAdded(gameObject) {
    this.mOriginalX = this.gameObject.x
    this.mOriginalY = this.gameObject.y

    const move = new Tween({ x: this.mDestX }, this.mDuration, {
      loop: true,
      ease: Ease.linear,
    })
    this.move = move

    gameObject.addComponent(move)
  }

  onUpdate() {
    if (!this.gameObject) return
    this.gameObject.y = this.ease(this.t) + this.mOriginalY
    this.t += 0.05
    this.t = this.t > this.T ? 0 : this.t
  }

  ease(t) {
    const A = 50
    const w = (2 * Math.PI) / this.T
    return A * Math.sin(w * t)
  }

  stop() {
    this.move.stop()
    this.removeFromParent()
  }
}

export default Wave

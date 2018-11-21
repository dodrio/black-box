import { Component, Graphics, GameObject } from '@2players/black-engine'

/**
 * Add visible bounds for an existing GameObject.
 *
 * @example
 * const bounds = new Bounds()
 * gameObject.addComponent(bounds)
 */
class Bounds extends Component {
  /**
   * @ignore
   */
  onAdded(gameObject) {
    const { parent } = gameObject

    this.topLeft = this.makeIndicator(0)
    this.topRight = this.makeIndicator(Math.PI * 0.5)
    this.bottomLeft = this.makeIndicator(Math.PI * 1.5)
    this.bottomRight = this.makeIndicator(Math.PI)
    parent.add(this.topLeft)
    parent.add(this.topRight)
    parent.add(this.bottomLeft)
    parent.add(this.bottomRight)

    this.placeIndicator()
  }

  /**
   * @ignore
   */
  onRemoved() {
    this.topLeft.removeFromParent()
    this.topRight.removeFromParent()
    this.bottomLeft.removeFromParent()
    this.bottomRight.removeFromParent()
  }

  /**
   * @ignore
   */
  onUpdate() {
    this.placeIndicator()
  }

  /**
   * @ignore
   */
  placeIndicator() {
    // get the bounds relative to sprite's parent with all children
    const bounds = this.gameObject.getBounds(null, true)
    const { left, right, top, bottom } = bounds
    this.topLeft.x = left
    this.topLeft.y = top
    this.topRight.x = right
    this.topRight.y = top
    this.bottomLeft.x = left
    this.bottomLeft.y = bottom
    this.bottomRight.x = right
    this.bottomRight.y = bottom
  }

  /**
   * @ignore
   */
  makeIndicator(rotation = 0) {
    const color = 0xf9b626
    const cross = new GameObject()

    const g1 = new Graphics()
    g1.beginPath()
    g1.fillStyle(color)
    g1.lineStyle(1, color)
    g1.rect(0, 0, 4, 20)
    g1.stroke()
    g1.fill()
    cross.add(g1)

    const g2 = new Graphics()
    g2.beginPath()
    g2.fillStyle(color)
    g2.lineStyle(1, color)
    g2.rect(0, 0, 20, 4)
    g2.stroke()
    g2.fill()
    cross.add(g2)

    cross.alignPivot()
    cross.rotation = rotation
    return cross
  }
}

export default Bounds

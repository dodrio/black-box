import { Component, Graphics } from '@2players/black-engine'

/*
 * This component adds a rectangle to small elements in order to make clicking
 * them easier.
 *
 * Usage:
 *   const sprite = new Sprite('image')
 *   // you should use alignPivotOffset() other than alignAnchor(), in order to
 *   // avoid unwanted offsets due to adding external rectangle provided by this
 *   // component.
 *   sprite.alignPivotOffset(1, 0)
 *   sprite.addComponent(
 *     new MinimalInteractiveArea({ width: 150, height: 150, debug: true })
 *   )
 */
class MinimalInteractiveArea extends Component {
  constructor({ width = 150, height = 150, debug = false } = {}) {
    super()

    this.mDebug = debug
    this.width = width
    this.height = height
  }

  onAdded() {
    const {
      parent: { width: containerWidth, height: containerHeight },
      width,
      height,
    } = this
    const lineAlpha = this.mDebug ? 1 : 0

    const g = new Graphics()
    g.touchable = true
    g.beginPath()
    g.lineStyle(1, 0xff0000, lineAlpha)
    g.rect(
      (containerWidth - width) / 2,
      (containerHeight - height) / 2,
      width,
      height
    )
    g.stroke()
    this.parent.addChild(g)
    this.parent.minimalInteractiveArea = g
  }
}

export default MinimalInteractiveArea

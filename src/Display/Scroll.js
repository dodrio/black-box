import {
  GameObject,
  Component,
  Input,
  InputComponent,
  Tween,
  Time,
} from 'black-engine'
import { Ease } from '../Animation'
import classname from '../helper/classname'

export class ScrollView extends GameObject {
  constructor({ x, y, width, height } = {}) {
    super()

    this.addComponent(new InputComponent())
    this.mX = x
    this.mY = y
    this.mWidth = width
    this.mHeight = height
  }

  get width() {
    return this.mWidth
  }

  get height() {
    return this.mHeight
  }
}

export class Scroller extends Component {
  constructor({
    debug = false,
    momentumLimitTime = 0.5,
    momentumLimitDistance = 15,
    scrollDuration = 2.5,
    bounceLimit = 50,
    bounceDuration = 0.8,
    enableHorizontal = true,
    enableVertical = true,
  } = {}) {
    super()

    this._debug = debug

    this._current = null
    this._parent = null

    this._clickPosX = 0
    this._clickPosY = 0

    this._pointerDownTime = Time.now
    this._pointerDownPositionX = 0
    this._pointerDownPositionY = 0

    this._pointerUpTime = Time.now
    this._pointerUpPositionX = 0
    this._pointerUpPositionY = 0

    this._scrolling = false
    this._momentumLimitTime = momentumLimitTime
    this._momentumLimitDistance = momentumLimitDistance

    this._scrollTween = null
    this._scrollDuration = scrollDuration

    this._bounceTween = null
    this._bounceLimit = bounceLimit
    this._bounceDuration = bounceDuration

    this._enableHorizontal = enableHorizontal
    this._enableVertical = enableVertical
  }

  debug() {
    const { _current, _parent } = this

    const cn = classname(this)
    // eslint-disable-next-line
    console.info(
      [
        `[${cn}] container size: ${_parent.width} x ${_parent.height}`,
        `[${cn}] content size: ${_current.width} x ${_current.height}`,
      ].join('\n')
    )

    if (this.shouldScrollHorizontal) {
      // eslint-disable-next-line
      console.info(`[${cn}] enable horizontal scroller`)
    }

    if (this.shouldScrollVertical) {
      // eslint-disable-next-line
      console.info(`[${cn}] enable vertical scroller`)
    }
  }

  onAdded(gameObject) {
    this._current = gameObject
    this._parent = gameObject.parent

    if (this._debug) this.debug()

    gameObject.addComponent(new InputComponent())
    gameObject.on('pointerDown', this.onPointerDown, this)
    Input.on('pointerMove', this.onPointerMove, this)
    Input.on('pointerUp', this.onPointerUp, this)
  }

  onPointerDown() {
    const { _current } = this

    this._scrolling = true
    this.stopScrollTween()
    this.stopBounceTween()

    // click position relative to _current
    const clickPos = _current.globalToLocal(Input.pointerPosition)
    this._clickPosX = clickPos.x * _current.scale
    this._clickPosY = clickPos.y * _current.scale

    this._pointerDownTime = Time.now
    this._pointerDownPositionX = _current.x
    this._pointerDownPositionY = _current.y
  }

  onPointerMove() {
    if (!this._scrolling) return

    const { _current, _parent } = this

    this._pointerUpTime = Time.now
    this._pointerUpPositionX = _current.x
    this._pointerUpPositionY = _current.y

    // click position  relative to _current's parent
    const parentPos = _parent.globalToLocal(Input.pointerPosition)
    const parentPosX = parentPos.x * _parent.scale
    const parentPosY = parentPos.y * _parent.scale

    if (this.shouldScrollHorizontal) {
      if (this.beyondLeftLimit() || this.beyondRightLimit()) return
      _current.x = parentPosX - this._clickPosX + _current.pivotX
    }

    if (this.shouldScrollVertical) {
      if (this.beyondTopLimit() || this.beyondBottomLimit()) return
      _current.y = parentPosY - this._clickPosY + _current.pivotY
    }
  }

  onPointerUp() {
    const {
      _current,
      _pointerDownTime: pointerDownTime,
      _pointerDownPositionY: pointerDownPositionY,
      _pointerUpTime: pointerUpTime,
      _pointerUpPositionY: pointerUpPositionY,
    } = this
    const pointerMovementDuration = pointerUpTime - pointerDownTime
    const pointerMovementDistance = pointerUpPositionY - pointerDownPositionY

    const isMomentumScroll =
      pointerMovementDuration < this._momentumLimitTime &&
      Math.abs(pointerMovementDistance) > this._momentumLimitDistance

    if (isMomentumScroll) {
      const destination = this.calculateDestination(
        _current.y,
        pointerMovementDistance,
        pointerMovementDuration
      )

      this.startScrollTween(_current, { y: destination })
    }

    if (this.beyondTop()) {
      const y = this.top
      this.stopScrollTween()
      this.startBounceTween(_current, { y })
    } else if (this.beyondBottom()) {
      const y = this.bottom
      this.stopScrollTween()
      this.startBounceTween(_current, { y })
    } else {
      this._scrolling = false
    }
  }

  startScrollTween(gameObject, values) {
    const tween = new Tween(values, this._scrollDuration, {
      ease: Ease.outQuint,
    })
    this._scrollTween = tween
    gameObject.addComponent(tween)
  }

  stopScrollTween() {
    if (this._scrollTween) {
      this._scrollTween.stop()
      this._scrollTween = null
    }
  }

  startBounceTween(gameObject, values) {
    const tween = new Tween(values, this._bounceDuration, {
      ease: Ease.outQuard,
    })
    this._bounceTween = tween
    tween.on('complete', () => (this._scrolling = false))
    gameObject.addComponent(tween)
  }

  stopBounceTween() {
    if (this._bounceTween) {
      this._bounceTween.stop()
      this._bounceTween = null
    }
  }

  calculateDestination(currentDestination, distance, duration) {
    const speed = Math.abs(distance) / duration
    const deceleration = 2.5

    let destination =
      currentDestination + (speed / deceleration) * (distance < 0 ? -1 : 1)

    if (destination > this.top) {
      destination = this.top
    } else if (destination < this.bottom) {
      destination = this.bottom
    }

    return destination
  }

  get shouldScrollHorizontal() {
    const { _current, _parent, _enableHorizontal } = this
    return _enableHorizontal && _current.width > _parent.width
  }

  get shouldScrollVertical() {
    const { _current, _parent, _enableVertical } = this
    return _enableVertical && _current.height > _parent.height
  }

  get left() {
    return 0
  }

  get right() {
    const { _current, _parent } = this
    return -(_current.width - _parent.width)
  }

  get top() {
    return 0
  }

  get bottom() {
    const { _current, _parent } = this
    return -(_current.height - _parent.height)
  }

  get maxX() {
    return this.left + this._bounceLimit
  }

  get minX() {
    return this.right - this._bounceLimit
  }

  get maxY() {
    return this.top + this._bounceLimit
  }

  get minY() {
    return this.bottom - this._bounceLimit
  }

  beyondLeft() {
    const { _current } = this
    return _current.x > this.left
  }

  beyondRight() {
    const { _current } = this
    return _current.x < this.right
  }

  beyondTop() {
    const { _current } = this
    return _current.y > this.top
  }

  beyondBottom() {
    const { _current } = this
    return _current.y < this.bottom
  }

  beyondLeftLimit() {
    const { _current } = this
    return _current.x > this.maxX
  }

  beyondRightLimit() {
    const { _current } = this
    return _current.x < this.minX
  }

  beyondTopLimit() {
    const { _current } = this
    return _current.y > this.maxY
  }

  beyondBottomLimit() {
    const { _current } = this
    return _current.y < this.minY
  }
}

export default {
  ScrollView,
  Scroller,
}

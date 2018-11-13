import { Input } from 'black-engine'

/**
 * Black Engine's default Input without `Event.preventDefault`
 *
 * Black disables browser's default behaviours via `Event.preventDefault`. It
 * causes problems when you interactive with some DOMs, such as <img>.
 */
class NoPreventDefaultInput extends Input {
  constructor() {
    super()

    this.__fixBody()
  }

  /**
   * @ignore
   */
  __onPointerEvent(evt) {
    // override preventDefault
    evt.preventDefault = () => {}
    return super.__onPointerEvent(evt)
  }

  /**
   * When using this System on iOS, it causes unexpected scrolling when canvas
   * is bigger than viewport. As a workaround, we fix body manually.
   * @ignore
   */
  __fixBody() {
    const body = document.querySelector('body')
    body.style.position = 'fixed'
    body.style.top = 0
    body.style.left = 0
  }
}

export default NoPreventDefaultInput

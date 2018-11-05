/**
 * Eases which are not provided by Black Engine.
 */
class Ease {
  // swipe
  static outQuint(t) {
    return 1 + --t * t * t * t * t
  }

  // swipe bounce
  static outQuard(t) {
    return t * (2 - t)
  }

  // bounce
  static outQuart(t) {
    return 1 - --t * t * t * t
  }
}

export default Ease

import { DisplayObject } from 'black-engine'

/**
 * Scene is abstraction built on DisplayObject.
 *
 * @example
 * // Scene is just a normal DisplayObject in Black Engine.
 * class Playground extends Scene {
 *   onAdded() {
 *     // ...
 *   }
 * }
 *
 * @example
 * // If you wanna extend Scene's constructor, please make sure `super(name)`
 * // is called. Because attribute `name` is required by SceneManager.
 * class Playground extends Scene {
 *   constructor(name) {
 *     super(name)
 *
 *     this.toggle = true
 *   }
 * }
 */
class Scene extends DisplayObject {
  /**
   * constructor
   * @param {string} name name of scene
   */
  constructor(name) {
    super()

    this.name = name
  }
}

export default Scene

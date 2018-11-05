import { Black, Tween } from 'black-engine'

/**
 * Manager of Scenes.
 *
 * @example
 * // default instance of SceneManager.
 * const { default: sceneManager } = SceneManager
 *
 * // register scenes
 * sceneManager.register('preloader', Preloader)
 * sceneManager.register('playground', Playground)
 *
 * class Game extends GameObject {
 *   constructor() {
 *     super()
 *     sceneManager.load('preloader')
 *   }
 * }
 *
 * class Preloader extends Scene {
 *   onAdded() {
 *     // ...
 *     sceneManager.load('playground')
 *   }
 * }
 *
 * class Playground extends Scene {
 *   onAdded() {
 *     // ...
 *   }
 * }
 */
class SceneManager {
  constructor() {
    /**
     * Store all registered scenes.
     * @access private
     */
    this.availableScenes = []

    /**
     * Store all loaded scenes.
     * @access private
     */
    this.activeScenes = []
  }

  /**
   * Register a scene.
   * @param {string} name name of scene
   * @param {Scene} Class subclass of {@link Scene}
   */
  register(name, Class) {
    this.availableScenes.push({
      name,
      Class,
    })
  }

  /**
   * Load scene which is already registered. This method will remove all scenes
   * which aren't sticky.
   *
   * @param {string} name name of scene
   * @param {Object} [options]
   * @param {boolean} [options.sticky=false] scene will not be removed unless
   *                                         you unload it explicitly
   * @param {boolean} [options.transition=true] enable transition when switching
   *                                            scene
   * @param {number} [options.transitionTime=1] transition's duration, unit in
   *                                            seconds
   */
  load(name, { sticky = false, transition = true, transitionTime = 1 } = {}) {
    this.cleanup()
    const scene = this.availableScenes.find(s => s.name === name)

    const { Class, name: $name } = scene
    const activeScene = new Class($name)
    activeScene.sticky = sticky

    this.activeScenes.push(activeScene)

    if (transition) {
      // a simple transition
      activeScene.alpha = 0
      activeScene.add(new Tween({ alpha: 1 }, transitionTime))
    }

    Black.stage.addChild(activeScene)
  }

  /**
   * Cleanup useless actived scenes
   * @access private
   */
  cleanup() {
    this.activeScenes = this.activeScenes.filter(scene => {
      if (scene.sticky) {
        return true
      } else {
        Black.stage.removeChild(scene)
        return false
      }
    })
  }

  /**
   * Unload a scene by name explicitly.
   * @param {string} name name of scene
   */
  unload(name) {
    const index = this.activeScenes.findIndex(s => s.name === name)
    if (index >= 0) {
      const scene = this.activeScenes[index]
      Black.stage.removeChild(scene)
      this.activeScenes.splice(index, 1)
    }
  }

  /**
   * Find a loaded scene by name.
   * @param {string} name name of a loaded scene
   */
  find(name) {
    const scene = this.activeScenes.find(s => s.name === name)
    return scene
  }
}

SceneManager.default = new SceneManager()

export default SceneManager

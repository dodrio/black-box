import { Black, Tween } from 'black'

class SceneManager {
  constructor() {
    this.availableScenes = []
    this.activeScenes = []
  }

  register(name, Class) {
    this.availableScenes.push({
      name,
      Class,
    })
  }

  load(name, { sticky = false, transition = true } = {}) {
    this.cleanup()
    const scene = this.availableScenes.find(s => s.name === name)

    const { Class, name: $name } = scene
    const activeScene = new Class($name)
    activeScene.sticky = sticky

    this.activeScenes.push(activeScene)

    if (transition) {
      // a simple transition
      activeScene.alpha = 0
      activeScene.add(new Tween({ alpha: 1 }, 1))
    }

    Black.stage.addChild(activeScene)
  }

  // cleanup useless actived scenes
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

  unload(name) {
    const index = this.activeScenes.findIndex(s => s.name === name)
    if (index >= 0) {
      const scene = this.activeScenes[index]
      Black.stage.removeChild(scene)
      this.activeScenes.splice(index, 1)
    }
  }

  findActive(name) {
    const scene = this.activeScenes.find(s => s.name === name)
    return scene
  }
}

SceneManager.default = new SceneManager()

export default SceneManager

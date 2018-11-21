import { AssetManager as $AssetManager } from '@2players/black-engine'

/**
 * Extended version of AssetManager provided by Black Engine.
 *
 * @experimental
 *
 * @example
 * const { default: assetManager } = AssetManager
 * assetManager.enqueueImage('bg', urlBG)
 * assetManager.enqueueImage('logo', urlLOGO)
 * // asset manager will wait until bg and logo is loaded
 * await assetManager.load()
 *
 * assetManager.enqueueImage('asset1', urlAsset1)
 * assetManager.enqueueImage('asset2', urlAsset2)
 * await assetManager.load()
 */
class AssetManager extends $AssetManager {
  /**
   * Promised `loadQueue()`.
   */
  load() {
    return new Promise(resolve => {
      /**
       * @ignore
       * fix issue:
       * when calling loadQueue() multiple times, then complete isn't triggered
       */
      this.mTotalPending = 0

      this.loadQueue()
      this.once('complete', resolve)
    })
  }
}

AssetManager.default = new AssetManager()

export default AssetManager

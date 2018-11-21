import { AssetManager, Component } from '@2players/black-engine'

const { default: defaultAssetManager } = AssetManager

class SoundButton extends Component {
  constructor(
    downSoundName,
    upSoundName,
    { assetManager } = { assetManager: defaultAssetManager }
  ) {
    super()

    this.mDownSoundClip =
      (downSoundName && assetManager.getSound(downSoundName)) || null
    this.mUpSoundClip =
      (upSoundName && assetManager.getSound(upSoundName)) || null
    this.mOnPointerUp = null
    this.mOnPointerDown = null
  }

  onAdded(gameObject) {
    this.mOnPointerDown = gameObject.on('pointerDown', () => {
      this.mDownSoundClip.play()
    })

    this.mOnPointerUp = gameObject.on('pointerUp', () => {
      this.mUpSoundClip.play()
    })
  }

  onRemoved() {
    this.mOnPointerDown.off()
    this.mOnPointerUp.off()
  }
}

export default SoundButton

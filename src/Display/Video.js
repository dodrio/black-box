import { Black, GameObject } from 'black-engine'
import Layer from '../Layer'
import { transformDOM } from '../helper/dom'

class Video extends GameObject {
  constructor(src, { id, width, height, loop = false, hide = false } = {}) {
    super()

    this.mSrc = src
    this.mId = id
    this.mWidth = width
    this.mHeight = height
    this.mLoop = loop
    this.mHide = hide

    this.mVideo = this.createVideoDOM()
    this.mContainer = null
    this.mPreplayPromise = null
    this.mReady = false
    this.mReadyTime = 0
  }

  createVideoDOM() {
    const video = document.createElement('video')
    video.src = this.mSrc

    // identifiers
    video.className = 'black-video'
    if (this.mId) video.id = this.mId

    // standard adaptation
    video.style.position = 'absolute'
    video.style.top = '0'
    video.style.left = '0'
    video.style.zIndex = this.mHide
      ? Layer.DOM_DISPLAY_HIDDEN
      : Layer.DOM_DISPLAY
    if (this.mWidth) video.style.width = `${this.mWidth}px`
    if (this.mHeight) video.style.height = `${this.mHeight}px`

    video.loop = this.mLoop
    video.crossorigin = 'anonymous'
    video.setAttribute('preload', 'auto')
    video.setAttribute('playsinline', '')

    // WebKit-based browser adaptation
    video.setAttribute('webkit-playsinline', '')
    
    // QQ Browser
    video.setAttribute('x5-playsinline', '')
    // video.setAttribute('x5-video-player-type', 'h5')

    return video
  }

  onAdded() {
    const { containerElement } = Black.instance
    this.mContainer = containerElement

    const { mVideo: video } = this
    this.transformVideo()

    video.addEventListener('ended', this.onEnd)
    this.resizeListener = Black.instance.stage.on(
      'resize',
      this.transformVideo,
      this
    )

    this.mContainer.appendChild(video)
  }

  onRemoved() {
    const { mVideo: video } = this
    if (!video) return

    video.removeEventListener('ended', this.onEnd)
    this.resizeListener.off()

    this.mContainer.removeChild(video)
  }

  transformVideo() {
    const { localTransformation: matrix } = Black.instance.stage
    transformDOM(this.mVideo, matrix)
  }

  /**
   * Unlock video
   */
  unlock() {
    const { mVideo: video } = this
    const { paused: isPausedBeforeUnlock } = video
    video.play()
    if (isPausedBeforeUnlock) {
      video.pause()
    }
  }

  /**
   * There are following reasons to play video beforehand:
   * 1. solve the blinking problem when playing video on Android devices.
   * 2. fetch metadata of video in advance, such as `duration`.
   */
  play() {
    const { mVideo: video } = this

    if (this.mReady) {
      this.post('play')
      return video.play()
    }

    this.mPreplayPromise =
      this.mPreplayPromise ||
      new Promise(resolve => {
        const listener = () => {
          const { currentTime } = video
          if (currentTime > 0) {
            video.removeEventListener('timeupdate', listener)
            this.mReady = true
            this.mReadyTime = currentTime
            video.muted = false
            this.post('play')
            resolve()
          }
        }
        video.addEventListener('timeupdate', listener)
        video.muted = true
        video.play()
      })
    return this.mPreplayPromise
  }

  pause() {
    this.post('pause')
    return this.mVideo.pause()
  }

  reset() {
    this.post('reset')
    this.mVideo.currentTime = this.mReadyTime
  }

  onEnd = () => {
    this.post('end')
  }

  show() {
    this.mVideo.style.zIndex = Layer.DOM_DISPLAY
    this.post('show')
  }

  hide() {
    this.mVideo.style.zIndex = Layer.DOM_DISPLAY_HIDDEN
    this.post('hide')
  }

  onUpdate() {
    const { currentTime } = this.mVideo
    this.post('progress', { currentTime })
  }

  get duration() {
    return this.mVideo.duration
  }
}

export default Video

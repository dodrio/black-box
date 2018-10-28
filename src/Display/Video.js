import { Black, DisplayObject } from 'black-engine'
import Layer from '../Layer'
import { transformDOM } from '../helper/dom'

class Video extends DisplayObject {
  constructor(src, { id, width, height, loop = false, hide = false } = {}) {
    super()

    this.mSrc = src

    this.mWidth = width
    this.mHeight = height
    this.mId = id
    this.mLoop = loop
    this.mHide = hide

    this.mVideo = null
    this.mPreplayed = false
    // indicate whether video is ready to play
    this.mReady = false
    // record the time point when mReady is true
    this.mReadyTime = 0

    const { containerElement } = Black.instance
    this.container = containerElement
  }

  onAdded() {
    const video = document.createElement('video')
    this.mVideo = video

    // standard adaptation
    video.src = this.mSrc
    video.style.position = 'absolute'
    video.style.top = '0'
    video.style.left = '0'
    video.style.zIndex = this.mHide
      ? Layer.DOM_DISPLAY_HIDDEN
      : Layer.DOM_DISPLAY
    video.className = 'video'

    if (this.mWidth) video.style.width = `${this.mWidth}px`
    if (this.mHeight) video.style.height = `${this.mHeight}px`
    if (this.mId) video.id = this.mId

    video.loop = this.mLoop
    video.crossorigin = 'anonymous'
    video.setAttribute('preload', 'auto')
    video.setAttribute('playsinline', '')

    // WebKit-based browser adaptation
    video.setAttribute('webkit-playsinline', '')

    video.addEventListener('ended', this.onEnd)

    this.transformVideo()
    this.resizeListener = Black.instance.stage.on(
      'resize',
      this.transformVideo,
      this
    )

    this.container.appendChild(video)
  }

  onRemoved() {
    const { mVideo: video } = this
    if (!video) return

    video.removeEventListener('ended', this.onEnd)
    this.resizeListener.off()

    this.container.removeChild(video)
  }

  transformVideo() {
    const { localTransformation: matrix } = this.stage
    transformDOM(this.mVideo, matrix)
  }

  /**
   * There are following reasons to preplay video:
   * 1. solve the blinking problem when playing video on Android devices.
   * 2. fetch metadata of video in advance, such as `duration`.
   *
   * Preplay the video, then pause at a certain point via onUpdate().
   */
  preplay() {
    this.mVideo.muted = true

    if (this.mPreplayed) {
      this.__emitReadyOnce()
    } else {
      this.mPreplayed = true
      this.mVideo.play()
    }
  }

  play() {
    this.mVideo.muted = false
    this.mVideo.play()
    this.post('start')
  }

  pause() {
    this.mVideo.pause()
    this.post('pause')
  }

  resetTimeline() {
    this.mVideo.currentTime = this.mReadyTime
  }

  onEnd = () => {
    this.post('end')
  }

  show() {
    this.mVideo.style.zIndex = Layer.DOM_DISPLAY
  }

  hide() {
    this.mVideo.style.zIndex = Layer.DOM_DISPLAY_HIDDEN
  }

  __emitReadyOnce() {
    this.mFlagReadyOnce = true
  }

  __catchReadyOnce() {
    if (this.mFlagReadyOnce) {
      this.mFlagReadyOnce = false
      this.post('ready')
    }
  }

  onUpdate() {
    this.__catchReadyOnce()

    if (!this.mReady && this.mVideo && this.mVideo.currentTime > 0) {
      this.mReady = true
      this.mVideo.pause()
      this.mReadyTime = this.mVideo.currentTime
      this.post('ready')
    }

    if (this.mReady && this.mVideo) {
      const { currentTime } = this.mVideo
      this.post('progress', { currentTime })
    }
  }

  get duration() {
    return this.mVideo.duration
  }
}

export default Video

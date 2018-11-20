import { Black, GameObject } from 'black-engine'
import Layer from '../Layer'
import { transformDOM } from '../helper/dom'

/**
 * Video player based on HTML5 `<video>` tag.
 *
 * @example
 * const url = 'https://url/to/video'
 * const video = new Video(url, {
 *   width: 750,
 *   height: 1500,
 * })
 *
 * class Theater extends Scene {
 *   onAdded() {
 *     this.addChild(video)
 *   }
 * }
 */
class Video extends GameObject {
  /**
   * @param {string} src='' url of video
   * @param {Object} options
   * @param {string} [options.id=''] id of video
   * @param {number} [options.width=640] width of video
   * @param {number} [options.height=320] height of video
   * @param {boolean} [options.loop=false] enable loop
   * @param {boolean} [options.hide=false] hide video after creating it
   */
  constructor(
    src,
    { id = '', width = 640, height = 320, loop = false, hide = false } = {}
  ) {
    super()

    /**
     * @ignore
     */
    this.mSrc = src
    /**
     * @ignore
     */
    this.mId = id
    /**
     * @ignore
     */
    this.mWidth = width
    /**
     * @ignore
     */
    this.mHeight = height
    /**
     * @ignore
     */
    this.mLoop = loop
    /**
     * @ignore
     */
    this.mHide = hide

    /**
     * @ignore
     */
    this.mVideo = this.createVideoDOM()
    /**
     * @ignore
     */
    this.mContainer = null
    /**
     * @ignore
     */
    this.mPreplayPromise = null
    /**
     * @ignore
     */
    this.mReady = false
    /**
     * @ignore
     */
    this.mReadyTime = 0
  }

  /**
   * Create video DOM.
   * @access private
   */
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

    // QQ Browser on iOS
    const ua =
      window && window.navigator && window.navigator.userAgent
        ? window.navigator.userAgent
        : ''
    const IOS_PATTERN = /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i
    const QQ_BROWSER_UA_PATTERN = /m?(qqbrowser)[\/\s]?([\w\.]+)/i // eslint-disable-line
    if (IOS_PATTERN.test(ua) && QQ_BROWSER_UA_PATTERN.test(ua)) {
      video.setAttribute('x5-playsinline', '')
    }

    return video
  }

  /**
   * @ignore
   */
  onAdded() {
    const { containerElement } = Black.instance
    this.mContainer = containerElement

    const { mVideo: video } = this
    this.transformVideo()

    video.addEventListener('ended', this.onEnd)

    /**
     * @ignore
     */
    this.resizeListener = Black.instance.stage.on(
      'resize',
      this.transformVideo,
      this
    )

    this.mContainer.appendChild(video)
  }

  /**
   * @ignore
   * @emits {end}
   */
  onEnd = () => {
    this.post('end')
  }

  /**
   * Resize and position current video DOM according stage's setting.
   * @access private
   */
  transformVideo() {
    const { localTransformation: matrix } = Black.instance.stage
    transformDOM(this.mVideo, matrix)
  }

  /**
   * @ignore
   *
   * @emits {progress}
   */
  onUpdate() {
    const { currentTime } = this.mVideo
    this.post('progress', { currentTime })
  }

  /**
   * @ignore
   */
  onRemoved() {
    const { mVideo: video } = this
    if (!video) return

    video.removeEventListener('ended', this.onEnd)
    this.resizeListener.off()

    this.mContainer.removeChild(video)
  }

  /**
   * Unlock current video.
   *
   * WARNING: This method can't ensure playing video at a visible position
   * on iOS < 10.3.1, so you need to call await video.play() to avoid black splash.
   *
   * If you need to unlock multiple videos at once, there are 2 conditions because
   * iOS < 10.3.1 don't support playing multiple videos at one time:
   *
   * @example
   * // When you need to support iOS < 10.3.1:
   * video2.unlock()
   * video3.unlock()
   * await video1.unlock()
   * await video1.play()
   *
   * @example
   * // When you need to support iOS > 10.3.1
   * Promise.all([video1.unlock(), video2.unlock(), video3.unlock()])
   * await video1.play()
   *
   * @see https://stackoverflow.com/a/50480115/1793548
   */
  async unlock() {
    const { mVideo: video } = this
    const { paused: isPausedBeforeUnlock } = video
    await video.play()
    if (isPausedBeforeUnlock) {
      video.pause()
    }
  }

  /**
   * Play current video.
   *
   * This method will preplay video beforehand. There are following reasons to
   * do this:
   * 1. solve the blinking problem when playing video on Android devices.
   * 2. fetch metadata of video in advance, such as `duration`.
   *
   * @emits {play}
   * @return {Promise} same as DOM API - `play()`
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

  /**
   * Pause current video.
   *
   * @emits {pause}
   * @return {Promise} same as DOM API - `pause()`
   */
  pause() {
    this.post('pause')
    return this.mVideo.pause()
  }

  /**
   * Reset current video's timeline.
   *
   * @emits {reset}
   */
  reset() {
    this.post('reset')
    this.mVideo.currentTime = this.mReadyTime
  }

  /**
   * Show current video.
   *
   * @emits {show}
   */
  show() {
    this.mVideo.style.zIndex = Layer.DOM_DISPLAY
    this.post('show')
  }

  /**
   * Hide current video.
   *
   * @emits {hide}
   */
  hide() {
    this.mVideo.style.zIndex = Layer.DOM_DISPLAY_HIDDEN
    this.post('hide')
  }

  /**
   * Get duration of current video.
   */
  get duration() {
    return this.mVideo.duration
  }
}

export default Video

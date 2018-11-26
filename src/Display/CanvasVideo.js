import { Black, GameObject } from '@2players/black-engine'
import Layer from '../Layer'
import { transformDOM } from '../helper/dom'
import JSMpeg from '../../vendor/jsmpeg.min.js'

/**
 * Video player based on JSMpeg.
 *
 * TODO: event listener for 'end' event
 *
 * @see https://github.com/phoboslab/jsmpeg
 *
 * @example
 * const url = 'https://url/to/video'
 * const video = new CanvasVideo(url, {
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
class CanvasVideo extends GameObject {
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
    this.mCanvas = null

    /**
     * @ignore
     */
    this.mVideo = this.createPlayer()
    /**
     * @ignore
     */
    this.mContainer = null
  }

  /**
   * Create canvas DOM.
   * @access private
   */
  createPlayer() {
    const canvas = document.createElement('canvas')
    this.mCanvas = canvas

    // identifiers
    canvas.className = 'black-video'
    if (this.mId) canvas.id = this.mId

    // position
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.zIndex = this.mHide
      ? Layer.DOM_DISPLAY_HIDDEN
      : Layer.DOM_DISPLAY
    if (this.mWidth) canvas.style.width = `${this.mWidth}px`
    if (this.mHeight) canvas.style.height = `${this.mHeight}px`

    const src = this.mSrc
    const loop = this.mLoop
    const KB = 1024
    const video = new JSMpeg.Player(src, {
      canvas,
      loop,
      videoBufferSize: 2048 * KB,
    })

    window.video = video

    return video
  }

  /**
   * @ignore
   */
  onAdded() {
    const { containerElement } = Black.instance
    this.mContainer = containerElement

    this.transformVideo()

    // video.addEventListener('ended', this.onEnd)

    /**
     * @ignore
     */
    this.resizeListener = Black.instance.stage.on(
      'resize',
      this.transformVideo,
      this
    )

    this.mContainer.appendChild(this.mCanvas)
  }

  /**
   * @ignore
   * @emits {end}
   */
  // onEnd = () => {
  //   this.post('end')
  // }

  /**
   * Resize and position current video DOM according stage's setting.
   * @access private
   */
  transformVideo() {
    const { localTransformation: matrix } = Black.instance.stage
    transformDOM(this.mCanvas, matrix)
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
    const { mCanvas: canvas } = this
    if (!canvas) return

    // video.removeEventListener('ended', this.onEnd)
    this.resizeListener.off()

    this.mContainer.removeChild(canvas)
    this.mVideo.destroy()
  }

  /**
   * Unlock current video.
   */
  unlock() {
    // nothing to do
    return Promise.resolve()
  }

  /**
   * Play current video.
   *
   * @emits {play}
   */
  play() {
    return new Promise(resolve => {
      this.mVideo.play()
      this.post('play')
      resolve()
    })
  }

  /**
   * Pause current video.
   *
   * @emits {pause}
   */
  pause() {
    return new Promise(resolve => {
      this.mVideo.pause()
      this.post('pause')
      resolve()
    })
  }

  /**
   * Reset current video's timeline.
   *
   * @emits {reset}
   */
  reset() {
    this.post('reset')
    this.mVideo.currentTime = 0
  }

  /**
   * Get duration of current video.
   */
  get duration() {
    return this.mVideo.duration
  }

  /**
   * Show current video.
   *
   * @emits {show}
   */
  show() {
    this.mCanvas.style.zIndex = Layer.DOM_DISPLAY
    this.post('show')
  }

  /**
   * Hide current video.
   *
   * @emits {hide}
   */
  hide() {
    this.mCanvas.style.zIndex = Layer.DOM_DISPLAY_HIDDEN
    this.post('hide')
  }
}

export default CanvasVideo

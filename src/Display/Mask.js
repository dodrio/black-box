import { Black, Graphics } from 'black-engine'

class Mask extends Graphics {
  constructor({ x = 0, y = 0, alpha = 0.6, color = 0x000000 } = {}) {
    super()

    this.beginPath()
    const { width, height } = Black.stage
    this.rect(x, y, width, height)
    this.fillStyle(color, alpha)
    this.fill()
    this.stroke()
    this.alignAnchor()
  }
}

export default Mask

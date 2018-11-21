import { Black, Graphics } from '@2players/black-engine'

class Mask extends Graphics {
  constructor({ x = 0, y = 0, color = 0x000000 } = {}) {
    super()

    this.beginPath()
    const { width, height } = Black.stage
    this.rect(x, y, width, height)
    this.fillStyle(color, 1)
    this.fill()
    this.stroke()
  }
}

export default Mask

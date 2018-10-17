export function transformDOM(dom, matrix) {
  const {
    data: [a, b, c, d, tx, ty],
  } = matrix

  const transform = `matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`
  const transformOrigin = '0 0 0'

  dom.style.transform = transform
  dom.style.transformOrigin = transformOrigin

  dom.style.webkitTransform = transform
  dom.style.webkitTransformOrigin = transformOrigin
}

export default {
  transformDOM,
}

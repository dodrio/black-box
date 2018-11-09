import qs from 'qs'

export function queryObject() {
  const query = location.search.replace('?', '')
  return qs.parse(query)
}

export default {
  queryObject,
}

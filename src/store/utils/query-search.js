import qs from 'qs'

export default function querySearch(states) {
  // eslint-disable-next-line
  let queryStr =  window.location.search
  if (!queryStr) {
    const hash = window.location.hash
    queryStr = hash.replace(/#.*\?/, '')
  }

  const search = qs.parse(queryStr, { ignoreQueryPrefix: true })
  for (const [key, value] of Object.entries(search)) {
    const parseNumber = Number(value)
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(parseNumber)) {
      search[key] = parseNumber
    }
  }

  require('../../utils/json-helper').mergeJSON(states, {
    search
  })
}

import LZString from 'lz-string'

// URL-safe Base64 변형으로 압축 — `+`, `/`, `=` 없이 라우트 파라미터에 안전하게 들어감
export function encodeMatching(data) {
  const json = JSON.stringify(data)
  return LZString.compressToEncodedURIComponent(json)
}

export function decodeMatching(str) {
  if (!str) return null
  try {
    const json = LZString.decompressFromEncodedURIComponent(str)
    if (!json) return null
    return JSON.parse(json)
  } catch {
    return null
  }
}

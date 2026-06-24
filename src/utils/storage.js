/**
 * localStorage wrapper with JSON serialization
 */
export function getStorage(key, fallback = null) {
  try {
    const val = localStorage.getItem(key)
    return val !== null ? JSON.parse(val) : fallback
  } catch {
    return fallback
  }
}

export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* quota exceeded — silently fail */ }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch { /* ignore */ }
}

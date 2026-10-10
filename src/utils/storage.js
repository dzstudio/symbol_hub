/**
 * localStorage wrapper with JSON serialization
 * Respects cookie consent: writes blocked unless consent = 'accepted'
 */

const CONSENT_KEY = 'symbolhub-consent'

/** Check if user has accepted cookies (reads raw localStorage to avoid circular deps) */
export function hasConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (raw === null) return false
    const parsed = JSON.parse(raw)
    return parsed === 'accepted'
  } catch {
    return false
  }
}

export function getStorage(key, fallback = null) {
  try {
    const val = localStorage.getItem(key)
    return val !== null ? JSON.parse(val) : fallback
  } catch {
    return fallback
  }
}

export function setStorage(key, value) {
  // Always allow writing consent itself
  if (key !== CONSENT_KEY && !hasConsent()) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* quota exceeded — silently fail */ }
}

export function removeStorage(key) {
  if (key !== CONSENT_KEY && !hasConsent()) return
  try {
    localStorage.removeItem(key)
  } catch { /* ignore */ }
}

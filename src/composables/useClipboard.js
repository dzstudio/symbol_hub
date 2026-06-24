export function useClipboard() {
  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.cssText = 'position:fixed;left:-9999px'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    }
  }

  return { copy }
}

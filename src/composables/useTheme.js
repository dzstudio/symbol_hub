import { ref, watch, onMounted, onUnmounted } from 'vue'
import { getStorage, setStorage } from '../utils/storage.js'

const THEME_KEY = 'symbolhub-theme'

export function useTheme() {
  const theme = ref(getStorage(THEME_KEY, 'light'))
  let mediaQuery = null
  let handler = null

  function apply(t) {
    const resolved = t === 'auto'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : t
    document.documentElement.setAttribute('data-theme', resolved)
  }

  function setTheme(t) {
    theme.value = t
    setStorage(THEME_KEY, t)
    apply(t)
  }

  function cycleTheme() {
    const order = ['light', 'dark', 'auto']
    const idx = order.indexOf(theme.value)
    setTheme(order[(idx + 1) % 3])
  }

  onMounted(() => {
    apply(theme.value)
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    handler = () => { if (theme.value === 'auto') apply('auto') }
    mediaQuery.addEventListener('change', handler)
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', handler)
  })

  return { theme, setTheme, cycleTheme }
}

import { ref, computed } from 'vue'
import { getStorage, setStorage } from '../utils/storage.js'
import { i18n } from '../data/i18n.js'

const LANG_KEY = 'symbolhub-lang'

function detectLang() {
  const saved = getStorage(LANG_KEY)
  if (saved && i18n[saved]) return saved
  const nav = navigator.language
  if (i18n[nav]) return nav
  const short = nav.split('-')[0]
  if (i18n[short]) return short
  return 'en'
}

const lang = ref(detectLang())

export function useI18n() {
  function t(key) {
    return i18n[lang.value]?.[key] || i18n['en']?.[key] || key
  }

  function setLang(l) {
    if (i18n[l]) {
      lang.value = l
      setStorage(LANG_KEY, l)
    }
  }

  function isZh() {
    return lang.value === 'zh-CN'
  }

  const supportedLangs = computed(() => Object.keys(i18n))

  return { lang, t, setLang, isZh, supportedLangs }
}

import { ref, computed, watch } from 'vue'
import { getStorage, setStorage } from '../utils/storage.js'
import { i18n } from '../data/i18n.js'

const LANG_KEY = 'symbolhub-lang'

// 语言映射表：浏览器语言 → 支持的语言
const LANG_MAP = {
  'zh': 'zh-CN',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-CN',  // 繁体中文也使用简体中文
  'zh-Hans': 'zh-CN',
  'zh-Hant': 'zh-CN',
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'ja': 'ja',
  'ko': 'ko',
  'es': 'es',
  'fr': 'fr',
  'de': 'de'
}

function detectLang() {
  // 1. 优先使用用户保存的语言偏好
  const saved = getStorage(LANG_KEY)
  if (saved && i18n[saved]) return saved

  // 2. 检测浏览器语言
  const nav = navigator.language
  if (nav) {
    // 精确匹配
    if (LANG_MAP[nav] && i18n[LANG_MAP[nav]]) {
      return LANG_MAP[nav]
    }
    // 短码匹配 (例如 'zh-CN' → 'zh')
    const short = nav.split('-')[0]
    if (short && LANG_MAP[short] && i18n[LANG_MAP[short]]) {
      return LANG_MAP[short]
    }
  }

  // 3. 检查浏览器语言列表
  if (navigator.languages) {
    for (const lang of navigator.languages) {
      if (LANG_MAP[lang] && i18n[LANG_MAP[lang]]) {
        return LANG_MAP[lang]
      }
      const short = lang.split('-')[0]
      if (short && LANG_MAP[short] && i18n[LANG_MAP[short]]) {
        return LANG_MAP[short]
      }
    }
  }

  // 4. 默认中文
  return 'zh-CN'
}

const lang = ref(detectLang())

export function useI18n() {
  // 监听语言变化，更新 HTML lang 属性
  watch(lang, (newLang) => {
    document.documentElement.lang = newLang
  }, { immediate: true })

  function t(key) {
    return i18n[lang.value]?.[key] || i18n['en']?.[key] || key
  }

  function setLang(l) {
    if (i18n[l]) {
      lang.value = l
      setStorage(LANG_KEY, l)
      document.documentElement.lang = l
    }
  }

  function isZh() {
    return lang.value === 'zh-CN'
  }

  const supportedLangs = computed(() => Object.keys(i18n))

  return { lang, t, setLang, isZh, supportedLangs }
}

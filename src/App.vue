<script setup>
import { ref, nextTick, watch } from 'vue'
import { categories } from './data/categories.js'
import { useTheme } from './composables/useTheme.js'
import { useI18n } from './composables/useI18n.js'
import { useSearch } from './composables/useSearch.js'
import { useRecent } from './composables/useRecent.js'
import { useClipboard } from './composables/useClipboard.js'
import { useScrollSpy } from './composables/useScrollSpy.js'

import AppNavbar from './components/AppNavbar.vue'
import SymbolGrid from './components/SymbolGrid.vue'
import SearchResults from './components/SearchResults.vue'
import RecentSection from './components/RecentSection.vue'
import FloatingNav from './components/FloatingNav.vue'
import SettingsModal from './components/SettingsModal.vue'
import ToastContainer from './components/ToastContainer.vue'

// composables
const { theme, setTheme, cycleTheme } = useTheme()
const { lang, t, setLang, supportedLangs } = useI18n()
const { query, results, isSearching, setQuery, clearSearch } = useSearch()
const { recent, add: addRecent, removeRecent } = useRecent()
const { copy } = useClipboard()

// scroll spy (plain array, not computed — categories is static)
const sectionIds = categories.map(c => 'cat-' + c.id)
const { activeSection, scrollTo, setActiveSection, reobserve } = useScrollSpy(sectionIds)

// Re-observe when switching back from search to grid
watch(isSearching, (searching) => {
  if (!searching) nextTick(reobserve)
})

// Dynamic lang attribute update
watch(lang, (newLang) => {
  document.documentElement.lang = newLang
}, { immediate: true })

// modal state
const showSettings = ref(false)

// toasts
const toasts = ref([])
let toastId = 0

function showToast(message) {
  const id = ++toastId
  toasts.value.push({ id, message })
  setTimeout(() => {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }, 2000)
}

// actions
async function handleCopy(char) {
  const ok = await copy(char)
  if (ok) {
    addRecent(char)
    showToast(t('toast.copied') + ' ' + char)
  }
}

async function handleCopyAll() {
  const allChars = recent.value.join('')
  const ok = await copy(allChars)
  if (ok) {
    showToast(t('toast.recentCopied'))
  }
}

function handleNavigate(id) {
  setActiveSection(id)
  scrollTo(id)
}

function handleClearRecent(count) {
  removeRecent(count)
  showToast(t('toast.recentCleared'))
}
</script>

<template>
  <AppNavbar
    :t="t"
    :theme="theme"
    :lang="lang"
    :langs="supportedLangs"
    @search="setQuery"
    @clear-search="clearSearch"
    @cycle-theme="cycleTheme"
    @select-lang="setLang"
  />

  <div class="app-layout">
    <main class="main-content">
      <RecentSection
        v-if="!isSearching"
        :recent="recent"
        :t="t"
        @copy="handleCopy"
        @copy-all="handleCopyAll"
        @clear-part="handleClearRecent"
      />

      <SearchResults
        v-if="isSearching"
        :results="results"
        :t="t"
        @copy="handleCopy"
      />
      <SymbolGrid
        v-else
        :t="t"
        @copy="handleCopy"
      />
    </main>
  </div>

  <FloatingNav
    :t="t"
    :active-section="activeSection"
    @navigate="handleNavigate"
  />

  <SettingsModal
    v-if="showSettings"
    :theme="theme"
    :t="t"
    @close="showSettings = false"
    @set-theme="setTheme"
  />

  <ToastContainer :toasts="toasts" />
</template>

<script setup>
import { ref } from 'vue'
import { themeIcons, icons } from '../assets/icons.js'
import LangDropdown from './LangDropdown.vue'

const props = defineProps({
  t: { type: Function, required: true },
  theme: { type: String, required: true },
  lang: { type: String, required: true },
  langs: { type: Array, required: true }
})

const emit = defineEmits(['search', 'clearSearch', 'cycleTheme', 'selectLang'])

const showLang = ref(false)
const searchValue = ref('')
const inputRef = ref(null)

function onInput(e) {
  searchValue.value = e.target.value
  emit('search', e.target.value)
}

function clearSearch() {
  searchValue.value = ''
  emit('clearSearch')
  inputRef.value?.focus()
}

function toggleLang() {
  showLang.value = !showLang.value
}

function selectLang(l) {
  emit('selectLang', l)
  showLang.value = false
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <img src="/favicon.svg" alt="Symbol Hub" class="navbar-logo-img" />
      <span class="navbar-logo-text">Symbol Hub</span>
      <span class="navbar-logo-subtitle">{{ t('nav.subtitle') }}</span>
    </div>
    <div class="navbar-search">
      <span class="navbar-search-icon" v-html="icons.search"></span>
      <input
        ref="inputRef"
        type="text"
        :placeholder="t('nav.search')"
        :value="searchValue"
        @input="onInput"
      />
      <button
        v-if="searchValue"
        class="navbar-search-clear"
        @click="clearSearch"
        title="清空"
      >✕</button>
    </div>
    <div class="navbar-actions">
      <button class="navbar-btn" :title="t('nav.theme')" @click="emit('cycleTheme')" v-html="themeIcons[theme]"></button>
      <div style="position: relative">
        <button class="navbar-btn" :title="t('nav.lang')" @click="toggleLang" v-html="icons.globe"></button>
        <LangDropdown v-if="showLang" :lang="lang" :langs="langs" @select="selectLang" />
      </div>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  lang: { type: String, required: true },
  langs: { type: Array, required: true }
})

const emit = defineEmits(['select'])

const labels = {
  'zh-CN': '中文',
  'en': 'English',
  'ja': '日本語',
  'ko': '한국어',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch'
}
</script>

<template>
  <div class="lang-dropdown">
    <button
      v-for="l in langs"
      :key="l"
      class="lang-option"
      :class="{ selected: l === lang }"
      @click="emit('select', l)"
    >
      {{ labels[l] || l }}
    </button>
  </div>
</template>

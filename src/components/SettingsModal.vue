<script setup>
import { icons } from '../assets/icons.js'

const props = defineProps({
  theme: { type: String, required: true },
  t: { type: Function, required: true }
})

const emit = defineEmits(['close', 'setTheme'])

const themes = ['light', 'dark', 'auto']
const themeIconMap = { light: icons.sun, dark: icons.moon, auto: icons.monitor }
</script>

<template>
  <div class="modal-overlay active" @click.self="emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">{{ t('settings.theme') }}</h2>
        <button class="modal-close" @click="emit('close')">✕</button>
      </div>
      <div class="modal-section">
        <div
          v-for="th in themes"
          :key="th"
          class="modal-option"
          :class="{ selected: theme === th }"
          @click="emit('setTheme', th)"
        >
          <span style="display:flex;align-items:center;gap:8px">
            <span v-html="themeIconMap[th]"></span>
            <span>{{ t('settings.theme' + th.charAt(0).toUpperCase() + th.slice(1)) }}</span>
          </span>
          <span v-if="theme === th">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

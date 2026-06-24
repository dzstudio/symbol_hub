<script setup>
import { ref } from 'vue'
import { icons } from '../assets/icons.js'

const props = defineProps({
  recent: { type: Array, required: true },
  t: { type: Function, required: true }
})

const emit = defineEmits(['copy', 'clearPart'])

const showClearMenu = ref(false)

function handleClear(count) {
  emit('clearPart', count)
  showClearMenu.value = false
}
</script>

<template>
  <div v-if="recent.length > 0" class="recent-section">
    <div class="recent-header">
      <span class="recent-header-icon" v-html="icons.clock"></span>
      <span class="recent-title">{{ t('recent.title') }}</span>
      <div class="recent-header-actions">
        <button class="recent-clear-btn" @click.stop="showClearMenu = !showClearMenu">{{ t('recent.clear') }}</button>
        <div v-if="showClearMenu" class="recent-clear-menu" @click.stop>
          <button class="recent-clear-option" @click="handleClear(Math.ceil(recent.length / 3))">{{ t('recent.clearThird') }}</button>
          <button class="recent-clear-option" @click="handleClear(Math.ceil(recent.length / 2))">{{ t('recent.clearHalf') }}</button>
          <button class="recent-clear-option recent-clear-option--danger" @click="handleClear(recent.length)">{{ t('recent.clearAll') }}</button>
          <button class="recent-clear-option" @click="showClearMenu = false">{{ t('recent.cancel') }}</button>
        </div>
      </div>
    </div>
    <div class="recent-grid">
      <div
        v-for="char in recent"
        :key="char"
        class="recent-char"
        @click="emit('copy', char)"
      >{{ char }}</div>
    </div>
  </div>
</template>

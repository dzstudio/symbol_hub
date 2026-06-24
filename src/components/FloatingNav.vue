<script setup>
import { categories } from '../data/categories.js'
import { categoryIcons } from '../assets/icons.js'

const props = defineProps({
  t: { type: Function, required: true },
  activeSection: { type: String, default: '' }
})

const emit = defineEmits(['navigate'])
</script>

<template>
  <nav class="floating-nav">
    <button
      v-for="cat in categories"
      :key="cat.id"
      class="floating-nav-item"
      :class="{ active: activeSection === 'cat-' + cat.id }"
      @click="emit('navigate', 'cat-' + cat.id)"
    >
      <span class="floating-nav-icon" v-once v-html="categoryIcons[cat.icon]"></span>
      <span class="floating-nav-label">{{ t('cat.' + cat.id) }}</span>
    </button>
  </nav>
</template>

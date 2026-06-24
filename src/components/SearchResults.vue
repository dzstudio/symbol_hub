<script setup>
import SymbolCard from './SymbolCard.vue'

const props = defineProps({
  results: { type: Array, required: true },
  t: { type: Function, required: true }
})

const emit = defineEmits(['copy'])
</script>

<template>
  <div v-if="results.length > 0" class="symbol-grid">
    <SymbolCard
      v-for="s in results"
      :key="s.unicode"
      :symbol="s"
      @copy="emit('copy', $event)"
    />
  </div>
  <div v-else class="empty-state">
    <div class="empty-state-icon">🔍</div>
    <div class="empty-state-text">{{ t('search.noResults') }}</div>
  </div>
</template>

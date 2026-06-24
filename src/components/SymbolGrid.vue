<script setup>
import { computed } from 'vue'
import { categories } from '../data/categories.js'
import { symbols } from '../data/symbols.js'
import SymbolCard from './SymbolCard.vue'

const props = defineProps({
  t: { type: Function, required: true }
})

const emit = defineEmits(['copy'])

const grouped = computed(() => {
  const result = []
  for (const cat of categories) {
    const catSymbols = symbols.filter(s => s.category === cat.id)
    if (catSymbols.length === 0) continue

    // Only 'common' category shows subcategory headers
    if (cat.id === 'common') {
      const subs = []
      for (const sub of cat.subs) {
        const subSymbols = catSymbols.filter(s => s.sub === sub.id)
        if (subSymbols.length === 0) continue
        subs.push({ ...sub, symbols: subSymbols })
      }
      result.push({ ...cat, subs, showSubs: true })
    } else {
      result.push({ ...cat, symbols: catSymbols, showSubs: false })
    }
  }
  return result
})
</script>

<template>
  <div v-for="cat in grouped" :key="cat.id" :id="'cat-' + cat.id" class="category-section">
    <div class="category-header">
      <h2 class="category-title">{{ t('cat.' + cat.id) }}</h2>
      <div class="category-line"></div>
    </div>

    <!-- Common category: show subcategory groups -->
    <template v-if="cat.showSubs">
      <div v-for="sub in cat.subs" :key="sub.id" class="subcategory-section">
        <h3 class="subcategory-title">{{ t(sub.nameKey) }}</h3>
        <div class="symbol-grid">
          <SymbolCard
            v-for="s in sub.symbols"
            :key="s.unicode"
            :symbol="s"
            @copy="emit('copy', $event)"
          />
        </div>
      </div>
    </template>

    <!-- Other categories: flat grid -->
    <div v-else class="symbol-grid">
      <SymbolCard
        v-for="s in cat.symbols"
        :key="s.unicode"
        :symbol="s"
        @copy="emit('copy', $event)"
      />
    </div>
  </div>
</template>

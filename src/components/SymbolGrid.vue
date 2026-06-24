<script setup>
import { categories } from '../data/categories.js'
import { symbols } from '../data/symbols.js'
import SymbolCard from './SymbolCard.vue'

const props = defineProps({
  t: { type: Function, required: true }
})

const emit = defineEmits(['copy'])

// Pre-build category→symbols map (static data, computed once at module load)
const catMap = new Map()
for (const s of symbols) {
  if (!catMap.has(s.category)) catMap.set(s.category, [])
  catMap.get(s.category).push(s)
}

const subMap = new Map()
for (const s of symbols) {
  const key = s.category + '/' + s.sub
  if (!subMap.has(key)) subMap.set(key, [])
  subMap.get(key).push(s)
}

const grouped = categories
  .filter(cat => catMap.has(cat.id))
  .map(cat => {
    if (cat.id === 'common') {
      const subs = cat.subs
        .filter(sub => subMap.has('common/' + sub.id))
        .map(sub => ({ ...sub, symbols: subMap.get('common/' + sub.id) }))
      return { ...cat, subs, showSubs: true }
    }
    return { ...cat, symbols: catMap.get(cat.id), showSubs: false }
  })
</script>

<template>
  <div v-for="cat in grouped" :key="cat.id" :id="'cat-' + cat.id" class="category-section">
    <div class="category-header">
      <h2 class="category-title">{{ t('cat.' + cat.id) }}</h2>
      <div class="category-line"></div>
    </div>

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

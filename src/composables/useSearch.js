import { ref, computed } from 'vue'
import { symbols } from '../data/symbols.js'

// Pre-compute lowercase index (static data, computed once)
const searchIndex = symbols.map(s => ({
  ref: s,
  char: s.char.toLowerCase(),
  name: s.name.toLowerCase(),
  nameZh: s.nameZh.toLowerCase(),
  unicode: s.unicode.toLowerCase()
}))

export function useSearch() {
  const query = ref('')
  let timer = null

  const results = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return []
    return searchIndex
      .filter(s =>
        s.char.includes(q) ||
        s.name.includes(q) ||
        s.nameZh.includes(q) ||
        s.unicode.includes(q)
      )
      .map(s => s.ref)
  })

  const isSearching = computed(() => query.value.trim().length > 0)

  function setQuery(val) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      query.value = val
    }, 300)
  }

  function clearSearch() {
    clearTimeout(timer)
    query.value = ''
  }

  return { query, results, isSearching, setQuery, clearSearch }
}

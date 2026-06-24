import { ref, computed } from 'vue'
import { symbols } from '../data/symbols.js'

export function useSearch() {
  const query = ref('')
  let timer = null

  const results = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return []
    return symbols.filter(s =>
      s.char.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.nameZh.toLowerCase().includes(q) ||
      s.unicode.toLowerCase().includes(q)
    )
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

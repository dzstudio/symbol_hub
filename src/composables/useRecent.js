import { ref } from 'vue'
import { getStorage, setStorage } from '../utils/storage.js'

const RECENT_KEY = 'symbolhub-recent'
const MAX = 50

const recent = ref(getStorage(RECENT_KEY, []))

export function useRecent() {
  function add(char) {
    const idx = recent.value.indexOf(char)
    if (idx >= 0) recent.value.splice(idx, 1)
    recent.value.unshift(char)
    if (recent.value.length > MAX) recent.value.length = MAX
    setStorage(RECENT_KEY, recent.value)
  }

  function clear() {
    recent.value = []
    setStorage(RECENT_KEY, [])
  }

  function removeRecent(count) {
    recent.value.splice(0, count)
    setStorage(RECENT_KEY, recent.value)
  }

  function copyAll() {
    return recent.value.join('')
  }

  return { recent, add, clear, removeRecent, copyAll }
}

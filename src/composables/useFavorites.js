import { ref } from 'vue'
import { getStorage, setStorage } from '../utils/storage.js'

const FAV_KEY = 'symbolhub-favorites'

const favorites = ref(getStorage(FAV_KEY, []))

export function useFavorites() {
  function isFavorited(char) {
    return favorites.value.includes(char)
  }

  function toggle(char) {
    const idx = favorites.value.indexOf(char)
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
    } else {
      favorites.value.push(char)
    }
    setStorage(FAV_KEY, favorites.value)
    return idx < 0
  }

  function clear() {
    favorites.value = []
    setStorage(FAV_KEY, [])
  }

  function copyAll() {
    return favorites.value.join('')
  }

  function exportTxt() {
    return favorites.value.join('\n')
  }

  return { favorites, isFavorited, toggle, clear, copyAll, exportTxt }
}

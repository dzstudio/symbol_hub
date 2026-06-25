<script setup>
import { ref, onMounted } from 'vue'
import { categories } from '../data/categories.js'
import { categoryIcons } from '../assets/icons.js'

const props = defineProps({
  t: { type: Function, required: true },
  activeSection: { type: String, default: '' }
})

const emit = defineEmits(['navigate'])

const STORAGE_KEY = 'symbolhub-floating-nav-position'

const wrapperRef = ref(null)
const isDragging = ref(false)
const position = ref({ x: 0, y: 0 })
const offset = ref({ x: 0, y: 0 })

function startDrag(e) {
  const touch = e.touches ? e.touches[0] : e
  const rect = wrapperRef.value.getBoundingClientRect()

  isDragging.value = true
  offset.value = {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
  }

  e.preventDefault()
  e.stopPropagation()

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('touchend', stopDrag)
}

function onDrag(e) {
  if (!isDragging.value) return
  e.preventDefault()

  const touch = e.touches ? e.touches[0] : e
  const wrapper = wrapperRef.value

  let newX = touch.clientX - offset.value.x
  let newY = touch.clientY - offset.value.y

  // Constrain to viewport
  const maxX = window.innerWidth - wrapper.offsetWidth
  const maxY = window.innerHeight - wrapper.offsetHeight
  newX = Math.max(0, Math.min(maxX, newX))
  newY = Math.max(0, Math.min(maxY, newY))

  position.value = { x: newX, y: newY }

  wrapper.style.left = newX + 'px'
  wrapper.style.top = newY + 'px'
  wrapper.style.right = 'auto'
}

function stopDrag() {
  isDragging.value = false

  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(position.value))
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const pos = JSON.parse(saved)
    position.value = pos
    const wrapper = wrapperRef.value
    if (wrapper && pos.x !== 0 && pos.y !== 0) {
      wrapper.style.left = pos.x + 'px'
      wrapper.style.top = pos.y + 'px'
      wrapper.style.right = 'auto'
    }
  }
})
</script>

<template>
  <div
    ref="wrapperRef"
    class="floating-nav-wrapper"
    :class="{ 'floating-nav-wrapper--dragging': isDragging }"
  >
    <nav class="floating-nav">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="floating-nav-item"
        :class="{ active: activeSection === 'cat-' + cat.id }"
        @click="emit('navigate', 'cat-' + cat.id)"
      >
        <span class="floating-nav-icon" v-html="categoryIcons[cat.icon]"></span>
        <span class="floating-nav-label">{{ t('cat.' + cat.id) }}</span>
      </button>
    </nav>
    <button
      class="floating-nav-drag-handle"
      @mousedown.stop="startDrag"
      @touchstart.stop="startDrag"
    >
      <span class="drag-dots">⠿</span>
    </button>
  </div>
</template>

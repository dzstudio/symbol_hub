<script setup>
import { ref } from 'vue'

const props = defineProps({
  symbol: { type: Object, required: true }
})

const emit = defineEmits(['copy'])
const copied = ref(false)

async function handleCopy() {
  emit('copy', props.symbol.char)
  copied.value = true
  setTimeout(() => { copied.value = false }, 300)
}
</script>

<template>
  <div class="symbol-card" :class="{ copied }" @click="handleCopy" :title="symbol.name">
    <span class="symbol-char">{{ symbol.char }}</span>
  </div>
</template>

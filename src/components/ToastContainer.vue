<script setup>
defineProps({
  toasts: { type: Array, required: true }
})
</script>

<template>
  <div class="toast-container">
    <div v-for="t in toasts" :key="t.id" class="toast">
      {{ t.message }}
    </div>
  </div>
</template>

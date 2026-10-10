<script setup>
import { ref } from 'vue'

const props = defineProps({
  t: Function,
  showToast: Function
})

const isOpen = ref(false)
const symbolDesc = ref('')
const email = ref('')
const submitting = ref(false)

const API_BASE = import.meta.env.BASE_URL + 'api/wishlist.php'

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    symbolDesc.value = ''
    email.value = ''
  }
}

async function submit() {
  if (!symbolDesc.value.trim()) return
  submitting.value = true

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbolDesc: symbolDesc.value.trim(),
        email: email.value.trim()
      })
    })
    const result = await res.json()
    if (result.success) {
      props.showToast(props.t('wishlist.success'))
      symbolDesc.value = ''
      email.value = ''
      isOpen.value = false
    }
  } catch (e) {
    // fallback: silent fail
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="wishlist-panel">
    <!-- Toggle button -->
    <button class="wishlist-toggle" @click="toggle" :title="t('wishlist.title')">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><path d="M7.5 9.5c0 .687.265 1.383.697 1.844l3.009 3.264a1.14 1.14 0 0 0 .407.314a1 1 0 0 0 .783-.004a1.14 1.14 0 0 0 .398-.31l3.008-3.264A2.77 2.77 0 0 0 16.5 9.5A2.5 2.5 0 0 0 12 8a2.5 2.5 0 0 0-4.5 1.5"/></g></svg>
    </button>

    <!-- Panel -->
    <Transition name="wishlist-panel">
      <div v-if="isOpen" class="wishlist-form">
        <div class="wishlist-form__header">
          <span>{{ t('wishlist.title') }}</span>
          <button class="wishlist-form__close" @click="isOpen = false">&times;</button>
        </div>
        <div class="wishlist-form__body">
          <input
            v-model="symbolDesc"
            type="text"
            :placeholder="t('wishlist.placeholder')"
            class="wishlist-input"
            maxlength="200"
          />
          <input
            v-model="email"
            type="email"
            :placeholder="t('wishlist.email')"
            class="wishlist-input"
            maxlength="100"
          />
          <button
            class="wishlist-submit"
            :disabled="!symbolDesc.trim() || submitting"
            @click="submit"
          >
            {{ t('wishlist.submit') }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

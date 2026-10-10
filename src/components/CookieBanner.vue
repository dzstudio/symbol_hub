<script setup>
defineProps({
  bannerVisible: Boolean,
  t: Function
})

defineEmits(['accept', 'reject', 'toggle'])
</script>

<template>
  <!-- Toggle button - bottom-left edge -->
  <button class="cookie-toggle" @click="$emit('toggle')" :title="t('cookie.toggle')">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a10 10 0 1 0 10 10a4 4 0 0 1-5-5a4 4 0 0 1-5-5M8.5 8.5v.01M16 15.5v.01M12 12v.01M11 17v.01M7 14v.01"/></svg>
  </button>

  <!-- Banner -->
  <Transition name="cookie-banner">
    <div v-if="bannerVisible" class="cookie-banner">
      <div class="cookie-banner__content">
        <div class="cookie-banner__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a10 10 0 1 0 10 10a4 4 0 0 1-5-5a4 4 0 0 1-5-5M8.5 8.5v.01M16 15.5v.01M12 12v.01M11 17v.01M7 14v.01"/></svg>
        </div>
        <div class="cookie-banner__text">
          <p>{{ t('cookie.banner.text') }}</p>
        </div>
        <div class="cookie-banner__actions">
          <button class="cookie-btn cookie-btn--accept" @click="$emit('accept')">
            {{ t('cookie.accept') }}
          </button>
          <button class="cookie-btn cookie-btn--reject" @click="$emit('reject')">
            {{ t('cookie.reject') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

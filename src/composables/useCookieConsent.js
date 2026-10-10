import { ref, computed } from 'vue'
import { getStorage, setStorage } from '../utils/storage.js'

const CONSENT_KEY = 'symbolhub-consent'

// null = not yet asked, 'accepted', 'rejected'
const consent = ref(getStorage(CONSENT_KEY, null))
const bannerVisible = ref(consent.value === null)

export function useCookieConsent() {
  const consentGiven = computed(() => consent.value === 'accepted')
  const consentRejected = computed(() => consent.value === 'rejected')

  function accept() {
    consent.value = 'accepted'
    setStorage(CONSENT_KEY, 'accepted')
    bannerVisible.value = false
  }

  function reject() {
    consent.value = 'rejected'
    setStorage(CONSENT_KEY, 'rejected')
    bannerVisible.value = false
  }

  function toggleBanner() {
    bannerVisible.value = !bannerVisible.value
  }

  function showBanner() {
    bannerVisible.value = true
  }

  return {
    consent,
    consentGiven,
    consentRejected,
    bannerVisible,
    accept,
    reject,
    toggleBanner,
    showBanner
  }
}

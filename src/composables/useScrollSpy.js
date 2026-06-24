import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export function useScrollSpy(sectionIds) {
  const activeSection = ref('')
  let observer = null

  function observe() {
    observer?.disconnect()
    observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.id
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  }

  function setActiveSection(id) {
    activeSection.value = id
  }

  function scrollTo(id) {
    activeSection.value = id
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  onMounted(() => {
    nextTick(observe)
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { activeSection, scrollTo, setActiveSection, reobserve: observe }
}

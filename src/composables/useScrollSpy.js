import { ref, onMounted, onUnmounted } from 'vue'

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
    sectionIds.value.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
  }

  function setActiveSection(id) {
    activeSection.value = id
  }

  function scrollTo(id) {
    activeSection.value = id
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    // Re-observe after scroll settles in case observer misses it
    setTimeout(observe, 600)
  }

  onMounted(() => {
    observe()
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { activeSection, scrollTo, setActiveSection }
}

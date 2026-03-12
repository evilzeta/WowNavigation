<template>
  <div
    class="default-logo"
    :style="{
      width: size + 'px',
      height: size + 'px',
      fontSize: (size * 0.5) + 'px',
      background: gradientColor
    }"
  >
    <span class="logo-text">{{ getFirstLetter(name) }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 48
  }
})

const colors = [
  ['#1e3a8a', '#3b82f6'],
  ['#7c3aed', '#a78bfa'],
  ['#dc2626', '#f87171'],
  ['#059669', '#34d399'],
  ['#d97706', '#fbbf24'],
  ['#0891b2', '#22d3ee'],
  ['#be185d', '#f472b6'],
  ['#4f46e5', '#818cf8'],
  ['#65a30d', '#a3e635'],
  ['#9333ea', '#c084fc']
]

const getFirstLetter = (name) => {
  if (!name) return 'W'
  return name.charAt(0).toUpperCase()
}

const gradientColor = computed(() => {
  const index = props.name ? props.name.charCodeAt(0) % colors.length : 0
  const [color1, color2] = colors[index]
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
})
</script>

<style scoped>
.default-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  overflow: hidden;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  user-select: none;
}

.logo-text {
  line-height: 1;
}

.dark .default-logo {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}
</style>
<template>
  <div :class="['min-h-screen', isDark ? 'dark' : '']">
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

// 初始化主题
themeStore.initTheme()
</script>
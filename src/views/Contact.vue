<template>
  <div class="min-h-screen bg-amber-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- 顶部导航栏 -->
    <nav class="sticky top-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Logo和标题 -->
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-compass text-white text-xl"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-800 dark:text-white">
                {{ lang === 'zh' ? (settings.siteTitle || 'WebStack导航') : 'Wow Navigation' }}
              </h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ t('site.subtitle') }}
              </p>
            </div>
          </div>
          
          <!-- 右侧控制按钮 -->
          <div class="flex items-center space-x-3">
            <!-- 语言切换 -->
            <button
              @click="toggleLang"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :title="lang === 'zh' ? 'Switch to English' : '切换到中文'"
            >
              {{ lang === 'zh' ? 'EN' : '中文' }}
            </button>
            
            <!-- 主题切换 -->
            <button
              @click="toggleTheme"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :title="isDark ? t('theme.light') : t('theme.dark')"
            >
              <i v-if="isDark" class="fas fa-sun text-yellow-500"></i>
              <i v-else class="fas fa-moon text-gray-600 dark:text-gray-400"></i>
            </button>
            
            <!-- 返回首页按钮 -->
            <router-link
              to="/"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <i class="fas fa-home mr-2"></i>
              {{ t('nav.home') }}
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- 主要内容区域 -->
    <main class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- 页面标题 -->
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {{ t('contact.title') }}
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400">
            {{ t('contact.subtitle') }}
          </p>
        </div>
        
        <!-- 联系信息卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div class="space-y-8">
            <!-- 邮箱联系 -->
            <section>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <i class="fas fa-envelope text-blue-500 mr-3"></i>
                {{ t('contact.emailContact') }}
              </h3>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">
                  {{ t('contact.emailDesc') }}
                </p>
                <div class="flex items-center justify-center">
                  <a 
                    href="mailto:your-email@example.com"
                    class="text-2xl font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <i class="fas fa-envelope mr-3"></i>
                    your-email@example.com
                  </a>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                  {{ t('contact.emailClick') }}
                </p>
              </div>
            </section>
            
            <!-- 联系说明 -->
            <section>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <i class="fas fa-info-circle text-blue-500 mr-3"></i>
                {{ t('contact.contactNote') }}
              </h3>
              <div class="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  {{ t('contact.note1') }}
                </p>
                <p>
                  {{ t('contact.note2') }}
                </p>
                <p>
                  {{ t('contact.note3') }}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
    
    <!-- 页脚 -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div class="container mx-auto px-4 py-6">
        <div class="text-center text-gray-600 dark:text-gray-400">
          {{ t('footer.copyright').replace(/\{\{year\}\}/g, new Date().getFullYear()) }}
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLangStore } from '../stores/lang'
import { useThemeStore } from '../stores/theme'

const langStore = useLangStore()
const themeStore = useThemeStore()

const lang = computed(() => langStore.lang)
const t = langStore.t
const isDark = computed(() => themeStore.isDark)

const toggleTheme = () => {
  themeStore.toggle()
}

const toggleLang = () => {
  langStore.toggle()
}

// 网站设置
const settings = ref({
  siteTitle: '网站导航'
})

const API_BASE = '/api'

const fetchSettings = async () => {
  try {
    const response = await fetch(`${API_BASE}/settings`)
    const result = await response.json()
    if (result.success) {
      settings.value = result.data
    }
  } catch (error) {
    console.error('获取设置失败:', error)
  }
}

// 添加书签功能
const addBookmark = () => {
  const title = settings.value.siteTitle || '白狐导航'
  const url = window.location.href
  
  if (window.sidebar && window.sidebar.addPanel) {
    window.sidebar.addPanel(title, url, '')
  } else if (window.external && ('AddFavorite' in window.external)) {
    window.external.AddFavorite(url, title)
  } else if (window.opera && window.print) {
    this.title = title
    return true
  } else {
    alert(lang.value === 'zh' ? '请使用 Ctrl+D (或 Cmd+D) 收藏本站' : 'Please use Ctrl+D (or Cmd+D) to bookmark this site')
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
/* 自定义样式 */
</style>
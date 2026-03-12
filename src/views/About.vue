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
            {{ t('about.aboutUs') }}
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400">
            {{ t('about.subtitle') }}
          </p>
        </div>
        
        <!-- 网站统计 -->
        <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <i class="fas fa-chart-line text-blue-500 mr-3"></i>
            {{ t('about.siteStats') }}
          </h3>
          <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-users text-white text-xl"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">{{ t('about.totalVisitors') }}</div>
                  <div class="text-3xl font-bold text-gray-800 dark:text-white">{{ visitCount }}</div>
                </div>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <i class="fas fa-info-circle text-blue-500 mr-2"></i>
                {{ t('about.visitorDesc') }}
              </div>
            </div>
            <div class="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-6">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-eye text-white text-xl"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">{{ t('about.pageViews') }}</div>
                  <div class="text-3xl font-bold text-gray-800 dark:text-white">{{ pageViewCount }}</div>
                </div>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <i class="fas fa-chart-bar text-purple-500 mr-2"></i>
                {{ t('about.pvDesc') }}
              </div>
            </div>
            <div class="bg-green-50 dark:bg-green-900/30 rounded-lg p-6">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-clock text-white text-xl"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">{{ t('about.runningDays') }}</div>
                  <div class="text-3xl font-bold text-gray-800 dark:text-white">{{ runningDays }} 天</div>
                </div>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <i class="fas fa-calendar-alt text-green-500 mr-2"></i>
                {{ t('about.runningDesc') }}
              </div>
            </div>
          </div>
        </section>
        
        <!-- 关于内容卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div class="space-y-8">
            <!-- 网站介绍 -->
            <section>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <i class="fas fa-info-circle text-blue-500 mr-3"></i>
                {{ t('about.intro') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ settings.siteTitle }} {{ t('about.introText') }}
              </p>
            </section>
            
            <!-- 我们的使命 -->
            <section>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <i class="fas fa-bullseye text-green-500 mr-3"></i>
                {{ t('about.mission') }}
              </h3>
              <ul class="space-y-3 text-gray-600 dark:text-gray-400">
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                  <span>{{ t('about.mission1') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                  <span>{{ t('about.mission2') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                  <span>{{ t('about.mission3') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                  <span>{{ t('about.mission4') }}</span>
                </li>
              </ul>
            </section>
            
            <!-- 免责声明 -->
            <section>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <i class="fas fa-shield-alt text-red-500 mr-3"></i>
                {{ t('about.disclaimer') }}
              </h3>
              <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
                <div class="space-y-4 text-gray-700 dark:text-gray-300">
                  <p class="font-semibold text-gray-800 dark:text-white">
                    {{ t('about.disclaimerIntro') }}
                  </p>
                  <ul class="space-y-3 list-disc list-inside">
                    <li>
                      <span class="font-medium">{{ t('about.disclaimerAccuracy') }}</span>
                    </li>
                    <li>
                      <span class="font-medium">{{ t('about.disclaimerCopyright') }}</span>
                    </li>
                    <li>
                      <span class="font-medium">{{ t('about.disclaimerSecurity') }}</span>
                    </li>
                  </ul>
                  <div class="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p class="text-sm text-gray-600 dark:text-gray-400 text-center">
                      <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                      {{ t('about.disclaimerUpdate') }}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        
        <!-- 版权信息 -->
        <div class="text-center text-gray-500 dark:text-gray-400 mt-8">
          <div class="flex flex-wrap items-center justify-center gap-4 mb-4">
            <a
              href="#"
              @click.prevent="addBookmark"
              class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <i class="fas fa-heart mr-1"></i>
              {{ t('about.favorites') }}
            </a>
            <router-link
              to="/sitemap"
              class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <i class="fas fa-sitemap mr-1"></i>
              网站地图
            </router-link>
            <router-link
              to="/contact"
              class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <i class="fas fa-envelope mr-1"></i>
              {{ t('about.contactUs') }}
            </router-link>
          </div>
        </div>
      </div>
    </main>
    
    <!-- 页脚 -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
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
import { useRouter } from 'vue-router'
import { useLangStore } from '../stores/lang'
import { useThemeStore } from '../stores/theme'

const router = useRouter()
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

const settings = ref({
  siteTitle: 'WebStack导航',
  siteDescription: '发现优质网站资源'
})

const API_BASE = '/api'

const visitCount = ref(0)
const pageViewCount = ref(0)
const runningDays = ref(0)

const calculateRunningDays = () => {
  const startDate = new Date('2026-01-01')
  const now = new Date()
  const diffTime = now.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

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

const fetchVisitCount = async () => {
  try {
    const response = await fetch(`${API_BASE}/visits`)
    const result = await response.json()
    if (result.success && result.data) {
      visitCount.value = result.data.total || 0
      pageViewCount.value = result.data.pageViews || 0
    }
  } catch (error) {
    console.error('获取访问统计失败:', error)
    visitCount.value = 0
    pageViewCount.value = 0
  }
}

const addBookmark = () => {
  const title = settings.value.siteTitle || '白淲导航'
  const url = window.location.href
  
  if (window.sidebar && window.sidebar.addPanel) {
    window.sidebar.addPanel(title, url, '')
  } else if (window.external && ('AddFavorite' in window.external)) {
    window.external.AddFavorite(url, title)
  } else if (window.opera && window.print) {
    this.title = title
    return true
  } else {
    alert('请使用 Ctrl+D (或 Cmd+D) 收藏本站')
  }
}

const incrementPageView = async () => {
  try {
    await fetch(`${API_BASE}/visits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: 'pageview' })
    })
  } catch (error) {
    console.error('增加页面浏览量失败:', error)
  }
}

onMounted(() => {
  runningDays.value = calculateRunningDays()
  fetchSettings()
  fetchVisitCount()
  incrementPageView()
})
</script>

<style scoped>
</style>

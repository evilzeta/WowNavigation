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
            
            <!-- 管理员按钮 -->
            <router-link
              v-if="isAdmin"
              to="/admin"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <i class="fas fa-cog mr-2"></i>
              {{ t('nav.adminPanel') }}
            </router-link>
            <router-link
              v-else
              to="/login"
              class="px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors"
            >
              <i class="fas fa-sign-in-alt mr-2"></i>
              {{ t('nav.login') }}
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- 网站详情 -->
    <div v-if="site" class="container mx-auto px-4 pb-16">
      <div class="max-w-4xl mx-auto">
        <div class="card overflow-hidden">
          <!-- 头部区域 -->
          <div class="p-8 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-col md:flex-row md:items-start gap-6">
              <!-- Logo -->
              <div class="flex-shrink-0">
                <div class="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                  <img
                    v-if="!logoLoadError"
                    :src="getSiteLogo(site)"
                    :alt="site.name"
                    class="w-full h-full object-cover"
                    @error="logoLoadError = true"
                  />
                  <DefaultLogo v-else :name="site.name" :size="96" />
                </div>
              </div>
              
              <!-- 基本信息 -->
              <div class="flex-1 min-w-0">
                <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {{ site.name }}
                </h1>
                
                <!-- 描述 -->
                <p class="text-gray-600 dark:text-gray-400 text-lg mb-6 select-none">
                  {{ lang === 'zh' ? (site.description || '暂无描述') : (site.descriptionEn || site.description || 'No description') }}
                </p>
                
                <!-- 标签 -->
                <div class="flex flex-wrap gap-2 mb-6">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    <i class="fas fa-tag mr-1 text-xs"></i>
                    {{ getCategoryName(site.category_id) }}
                  </span>
                  <span v-if="site.tags" class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <i class="fas fa-hashtag mr-1 text-xs"></i>
                    {{ lang === 'zh' ? site.tags : (site.tagsEn || site.tags) }}
                  </span>
                </div>
                
                <!-- 统计信息 -->
                <div class="flex flex-wrap gap-6">
                  <div class="flex items-center">
                    <div class="text-yellow-500 mr-2">
                      <i class="fas fa-star"></i>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800 dark:text-white">
                        {{ site.stars || 3 }}/5
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ t('detail.stars') }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center">
                    <div class="text-blue-500 mr-2">
                      <i class="fas fa-eye"></i>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800 dark:text-white">
                        {{ site.visits || 0 }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ t('detail.visits') }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center">
                    <div class="text-green-500 mr-2">
                      <i class="fas fa-shield-alt"></i>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800 dark:text-white">
                        {{ site.is_active ? '正常' : '失效' }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        状态
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="p-8">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12">
              <button
                v-if="!isCountingDown"
                @click="startQuickAccess"
                class="px-8 py-3 border border-gray-500 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center"
              >
                <i class="fas fa-external-link-alt mr-3"></i>
                {{ countdown > 0 ? `${countdown}s` : t('detail.visit') }}
              </button>
              
              <button
                v-if="isCountingDown"
                disabled
                class="px-8 py-3 border border-gray-500 text-gray-500 rounded-lg flex items-center justify-center"
              >
                <i class="fas fa-clock mr-3"></i>
                {{ countdown }}s
              </button>
              
              <router-link
                to="/"
                class="px-8 py-3 border border-gray-500 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center"
              >
                <i class="fas fa-arrow-left mr-3"></i>
                {{ t('nav.home') }}
              </router-link>
              
              <button
                v-if="isAdmin"
                @click="editSite"
                class="px-8 py-3 border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg flex items-center justify-center"
              >
                <i class="fas fa-edit mr-3"></i>
                {{ t('detail.editInfo') }}
              </button>
            </div>
            
            <!-- 免责声明 -->
            <div class="text-center text-lg text-gray-500 dark:text-gray-400 mb-12 px-4">
              <p class="mb-1">{{ t('disclaimer.line1') }}</p>
              <p class="mb-1">{{ t('disclaimer.line2') }}</p>
              <p>{{ t('disclaimer.line3') }}</p>
            </div>
            
            <!-- 相关网站 -->
            <div v-if="relatedSites.length > 0" class="mb-12">
              <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <i class="fas fa-link mr-3 text-purple-500"></i>
                {{ t('detail.relatedSites') }}
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  v-for="related in relatedSites"
                  :key="related.id"
                  @click="goToDetail(related.id)"
                  class="card cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div class="p-4">
                    <div class="flex items-center mb-3">
                      <div class="w-10 h-10 rounded-lg overflow-hidden">
                        <img
                          v-if="!related.logoError"
                          :src="getSiteLogo(related)"
                          :alt="related.name"
                          class="w-full h-full object-cover"
                          @error="related.logoError = true"
                        />
                        <DefaultLogo v-else :name="related.name" :size="40" />
                      </div>
                      <div class="ml-3 flex-1 min-w-0">
                        <h4 class="font-semibold text-gray-800 dark:text-white truncate">
                          {{ related.name }}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 页脚 -->
      <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div class="container mx-auto px-4 py-8">
          <div class="text-center text-gray-600 dark:text-gray-400">
            {{ t('footer.copyright').replace(/\{\{year\}\}/g, new Date().getFullYear()) }}
          </div>
        </div>
      </footer>
    </div>
    
    <!-- 加载状态 -->
    <div v-else class="container mx-auto px-4 py-20 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">{{ t('detail.loading') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { useLangStore } from '../stores/lang'
import DefaultLogo from '../components/DefaultLogo.vue'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()
const langStore = useLangStore()

const lang = computed(() => langStore.lang)
const t = langStore.t

// 检查是否有静态数据（用于静态生成）
const staticData = inject('staticData', null)

// API 基础路径
const API_BASE = '/api'

const site = ref(null)
const relatedSites = ref([])
const loading = ref(true)
const logoLoadError = ref(false)
const settings = ref({
  siteTitle: '',
  siteDescription: '',
  siteFooter: ''
})

const countdown = ref(0)
const isCountingDown = ref(false)
let countdownInterval = null

const isDark = computed(() => themeStore.isDark)

const isAdmin = computed(() => !!localStorage.getItem('auth_token'))

const toggleTheme = () => {
  themeStore.toggle()
}

const toggleLang = () => {
  langStore.toggle()
}

// 初始化数据
function initializeData() {
  // 首先检查全局静态数据（用于静态生成）
  const globalStaticData = typeof window !== 'undefined' && window.__STATIC_DATA__
  
  if (globalStaticData) {
    console.log('使用静态数据')
    
    // 只使用设置信息，网站数据从API获取
    if (globalStaticData.settings) {
      settings.value = globalStaticData.settings
    }
    
    // 检查是否是静态模板模式
    if (globalStaticData.isStaticTemplate) {
      // 静态模板模式，不加载网站数据，让onMounted从API获取
      console.log('静态模板模式，将从API获取网站数据')
      return false
    }
    
    // 如果有完整的静态数据（currentSite和sites），则使用静态数据
    if (globalStaticData.currentSite && globalStaticData.sites) {
      site.value = globalStaticData.currentSite
      
      // 获取相关网站
      relatedSites.value = globalStaticData.sites
        .filter(s => s.category_id === site.value.category_id && s.id != site.value.id)
        .slice(0, 3)
      
      loading.value = false
      return true
    }
  }
  
  // 检查是否是动态详情页模式
  const isDynamicDetail = typeof window !== 'undefined' && window.__DYNAMIC_DETAIL__
  
  if (isDynamicDetail) {
    console.log('动态详情页模式')
    // 不在这里加载，让onMounted从API加载
    return false
  }
  
  // 然后检查注入的静态数据（用于SSR）
  if (staticData) {
    console.log('使用注入的静态数据')
    
    // 只使用设置信息，网站数据从API获取
    if (staticData.settings) {
      settings.value = staticData.settings
    }
    
    // 如果有完整的静态数据（currentSite和sites），则使用静态数据
    if (staticData.currentSite && staticData.sites) {
      site.value = staticData.currentSite
      
      // 获取相关网站
      relatedSites.value = staticData.sites
        .filter(s => s.category_id === site.value.category_id && s.id != site.value.id)
        .slice(0, 3)
      
      loading.value = false
      return true
    }
  }
  
  return false
}

// 从API获取所有网站
async function fetchSites() {
  try {
    const response = await fetch(`${API_BASE}/sites`)
    const result = await response.json()
    if (result.success) {
      return result.data
    }
    return []
  } catch (error) {
    console.error('获取网站失败:', error)
    return []
  }
}

// 增加访问量 - 通过API
async function incrementVisitsAPI(siteId) {
  try {
    const response = await fetch(`${API_BASE}/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: siteId })
    })
    const result = await response.json()
    if (result.success && site.value) {
      site.value.visits = result.data.visits
    }
  } catch (error) {
    console.error('更新访问量失败:', error)
  }
}

onMounted(async () => {
  const siteId = route.query.id
  console.log('Detail onMounted, siteId:', siteId)
  
  if (!siteId) {
    console.error('缺少网站ID参数')
    site.value = {
      id: null,
      name: t('detail.paramError'),
      url: '#',
      description: t('detail.missingId'),
      category_id: 'all',
      stars: 0,
      visits: 0,
      created_at: new Date().toISOString(),
      is_active: false,
      health_score: 0
    }
    loading.value = false
    return
  }
  
  loading.value = true
  
  // 首先检查是否有静态数据
  if (initializeData()) {
    console.log('使用静态数据加载完成')
    return
  }
  
  console.log('从API加载数据')
  
  // 没有静态数据，从API获取
  try {
    // 并行获取网站数据、分类数据和设置数据
    const [allSites] = await Promise.all([
      fetchSites(),
      fetchCategories(),
      fetchSettings()
    ])
    
    site.value = allSites.find(s => s.id == siteId)
    
    if (!site.value) {
      // 如果找不到，使用默认数据
      site.value = {
        id: siteId,
        name: t('detail.notFound'),
        url: '#',
        description: t('detail.notFoundDesc'),
        category_id: 'all',
        stars: 0,
        visits: 0,
        created_at: new Date().toISOString(),
        is_active: false,
        health_score: 0
      }
    }
    
    // 获取相关网站
    relatedSites.value = allSites
      .filter(s => s.category_id === site.value.category_id && s.id != siteId)
      .slice(0, 3)
    
    // 增加页面浏览量
    incrementPageView()
  } catch (error) {
    console.error('加载网站详情失败:', error)
  } finally {
    loading.value = false
  }
})

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

const getSiteLogo = (site) => {
  if (site.logo) return site.logo
  return null
}

const getDomain = (url) => {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

// 分类映射 - 可从API获取但这里简化处理
const categoryNames = ref({
  all: '全部',
  design: '设计',
  dev: '开发',
  tools: '工具',
  ai: 'AI',
  news: '新闻',
  shop: '购物',
  edu: '学习'
})

// 获取分类数据
async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`)
    const result = await response.json()
    if (result.success) {
      const mapping = {}
      result.data.forEach(cat => {
        mapping[cat.id] = cat.name
      })
      categoryNames.value = mapping
    }
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

async function fetchSettings() {
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

const renderFooterContent = () => {
  const footerText = settings.value.siteFooter || ''
  const year = new Date().getFullYear()
  const content = footerText.replace(/\{\{year\}\}/g, year)
  
  const temp = document.createElement('div')
  temp.textContent = content
  return temp.innerHTML
}

const getCategoryName = (categoryId) => {
  const categoryMap = {
    all: t('category.all'),
    design: t('category.design'),
    dev: t('category.development'),
    tools: t('category.tools'),
    ai: t('category.ai'),
    news: t('category.news'),
    shop: t('category.shopping'),
    edu: t('category.learning')
  }
  return categoryMap[categoryId] || t('detail.uncategorized')
}

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const incrementVisits = () => {
  if (site.value && site.value.id) {
    incrementVisitsAPI(site.value.id)
  }
}

const goToDetail = (siteId) => {
  router.push(`/detail/index.html?id=${siteId}`)
}

const editSite = () => {
  router.push(`/admin?edit=${site.value.id}`)
}

const startQuickAccess = () => {
  if (!site.value || !site.value.url) return
  
  isCountingDown.value = true
  countdown.value = 3
  
  countdownInterval = setInterval(() => {
    countdown.value--
    
    if (countdown.value <= 0) {
      clearInterval(countdownInterval)
      isCountingDown.value = false
      window.open(site.value.url, '_blank')
      incrementVisitsAPI(site.value.id)
    }
  }, 1000)
}
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
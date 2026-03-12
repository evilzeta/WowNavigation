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
          
          <!-- 搜索框 -->
          <div class="hidden md:flex items-center space-x-4 flex-1 max-w-xl mx-8">
            <div class="relative w-full">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('search.placeholder')"
                class="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i class="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
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
              {{ t('nav.admin') }}
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
    
    <!-- 主要内容区域 -->
    <main class="container mx-auto px-4 py-8">
      <div class="flex gap-8">
        <!-- 左侧分类导航 -->
        <aside class="hidden lg:block w-48 flex-shrink-0">
          <div class="sticky top-24 space-y-4">
            <!-- 分类导航 -->
            <div class="bg-amber-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <nav class="space-y-2">
                <a
                  v-for="category in filteredCategories"
                  :key="category.id"
                  :href="`#category-${category.id}`"
                  class="flex items-center px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
                >
                  <i :class="['fas', getCategoryIcon(category.name), 'mr-2', 'w-5', 'text-center']"></i>
                  <span>{{ getCategoryDisplayName(category) }}</span>
                </a>
              </nav>
            </div>
            
            <!-- 快捷链接 -->
            <div class="bg-amber-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <nav class="space-y-2">
                <router-link
                  to="/about"
                  class="flex items-center px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
                >
                  <i :class="['fas', 'fa-info-circle', 'mr-2', 'w-5', 'text-center']"></i>
                  <span>{{ t('about.aboutUs') }}</span>
                </router-link>
                <a
                  href="#"
                  @click.prevent="addBookmark"
                  class="flex items-center px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
                >
                  <i :class="['fas', 'fa-star', 'mr-2', 'w-5', 'text-center']"></i>
                  <span>{{ t('about.favorites') }}</span>
                </a>
                <router-link
                  to="/contact"
                  class="flex items-center px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
                >
                  <i :class="['fas', 'fa-envelope', 'mr-2', 'w-5', 'text-center']"></i>
                  <span>{{ t('about.contactUs') }}</span>
                </router-link>
              </nav>
            </div>
          </div>
        </aside>
        
        <!-- 右侧内容区域 -->
        <div class="flex-1 min-w-0">
          <!-- 搜索框（移动端） -->
          <div class="md:hidden mb-6">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('search.placeholder')"
                class="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i class="fas fa-search absolute left-4 top-3.5 text-gray-400"></i>
            </div>
          </div>
          
          <!-- 搜索结果 -->
          <div v-if="searchQuery" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              搜索结果: "{{ searchQuery }}"
            </h2>
            <div v-if="filteredSites.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              <div
                v-for="site in filteredSites"
                :key="site.id"
                @click="goToDetail(site.id)"
                class="card cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
              >
                <div class="p-5">
                  <!-- 网站Logo -->
                  <div class="flex items-center mb-4">
                    <div class="w-12 h-12 flex-shrink-0 mr-3">
                      <img
                        v-if="getSiteLogo(site) && !site.logoError"
                        :src="getSiteLogo(site)"
                        :alt="site.name"
                        loading="lazy"
                        class="w-full h-full object-cover rounded-xl"
                        @error="site.logoError = true"
                      />
                      <DefaultLogo v-else :name="site.name" :size="48" />
                    </div>
                    <div class="ml-4 flex-1 min-w-0">
                      <h3 class="font-bold text-gray-800 dark:text-white truncate">
                        {{ site.name }}
                      </h3>
                    </div>
                  </div>
                  
                  <!-- 标签 -->
                  <div class="flex items-center space-x-1">
                    <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                      {{ getCategoryName(site.category_id) }}
                    </span>
                    <span
                      v-for="tag in getSiteTags(site)"
                      :key="tag"
                      class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-20">
              <i class="fas fa-search text-gray-400 text-6xl mb-4"></i>
              <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                没有找到相关网站
              </h3>
              <p class="text-gray-500 dark:text-gray-400">
                尝试其他关键词
              </p>
            </div>
          </div>
          
          <!-- 按分类显示网站 -->
          <div v-else>
            <div
              v-for="category in filteredCategories"
              :key="category.id"
              :id="`category-${category.id}`"
              class="mb-12 scroll-mt-24"
            >
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {{ getCategoryDisplayName(category) }}
              </h2>
              
              <div v-if="getSitesByCategory(category.id).length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                <div
                  v-for="site in getSitesByCategory(category.id)"
                  :key="site.id"
                  @click="goToDetail(site.id)"
                  class="card cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <div class="p-5">
                    <!-- 网站Logo -->
                    <div class="flex items-center mb-4">
                      <div class="w-12 h-12 flex-shrink-0 mr-3">
                        <img
                          v-if="getSiteLogo(site) && !site.logoError"
                          :src="getSiteLogo(site)"
                          :alt="site.name"
                          loading="lazy"
                          class="w-full h-full object-cover rounded-xl"
                          @error="site.logoError = true"
                        />
                        <DefaultLogo v-else :name="site.name" :size="48" />
                      </div>
                      <div class="ml-4 flex-1 min-w-0">
                        <h3 class="font-bold text-gray-800 dark:text-white truncate">
                          {{ site.name }}
                        </h3>
                      </div>
                    </div>
                    
                    <!-- 标签 -->
                    <div class="flex items-center space-x-1">
                      <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {{ getCategoryName(site.category_id) }}
                      </span>
                      <span
                        v-for="tag in getSiteTags(site)"
                        :key="tag"
                        class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-10 text-gray-500 dark:text-gray-400">
                该分类暂无网站
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- 页脚 -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center text-gray-600 dark:text-gray-400">
          <div v-html="renderFooterContent()"></div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { useLangStore } from '../stores/lang'
import DefaultLogo from '../components/DefaultLogo.vue'

const router = useRouter()
const themeStore = useThemeStore()
const langStore = useLangStore()

// 检查是否有静态数据（用于静态生成）
const staticData = inject('staticData', null)

// 数据状态
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(20)

// 分类数据 - 从API加载或使用静态数据
const categories = ref([])

// 过滤后的分类（排除"全部"分类）
const filteredCategories = computed(() => {
  return categories.value.filter(category => category.id !== 'all')
})

// 根据分类名称获取对应的图标
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    '磁力资源': 'fa-book',
    '常用网盘': 'fa-cloud',
    'AI类站': 'fa-robot',
    'IT类站': 'fa-desktop',
    '工具类站': 'fa-tools',
    '动漫卡通': 'fa-palette',
    '影视网站': 'fa-video',
    '音乐网站': 'fa-music',
    '其它资源': 'fa-folder',
    '设计': 'fa-palette',
    '开发': 'fa-code',
    '工具': 'fa-tools',
    'AI': 'fa-robot',
    '新闻': 'fa-newspaper',
    '购物': 'fa-shopping-cart',
    '学习': 'fa-book',
    '娱乐': 'fa-gamepad',
    '社交': 'fa-users',
    '视频': 'fa-video',
    '音乐': 'fa-music',
    '图片': 'fa-image',
    '文档': 'fa-file-alt',
    '云服务': 'fa-cloud',
    '安全': 'fa-shield-alt',
    '金融': 'fa-coins',
    '健康': 'fa-heartbeat',
    '旅游': 'fa-plane',
    '美食': 'fa-utensils',
    '体育': 'fa-futbol',
    '汽车': 'fa-car',
    '房产': 'fa-home',
    '教育': 'fa-graduation-cap',
    '科技': 'fa-microchip',
    '生活': 'fa-leaf',
    '其他': 'fa-folder'
  }
  
  return iconMap[categoryName] || 'fa-folder'
}

// 网站数据 - 从API加载或使用静态数据
const sites = ref([])

// 网站设置 - 从API加载或使用静态数据
const settings = ref({
  siteTitle: '',
  siteDescription: '',
  siteFooter: ''
})

// API 基础路径
const API_BASE = '/api'

// 初始化数据
function initializeData() {
  // 首先检查全局静态数据（用于静态生成）
  const globalStaticData = typeof window !== 'undefined' && window.__STATIC_DATA__
  
  if (globalStaticData) {
    console.log('使用静态数据')
    
    // 只使用设置信息，网站和分类从API获取
    settings.value = globalStaticData.settings || settings.value
    
    if (globalStaticData.selectedCategory) {
      selectedCategory.value = globalStaticData.selectedCategory
    }
    
    // 如果有完整的静态数据（sites和categories），则使用静态数据
    // 否则继续从API获取最新的网站和分类数据
    if (globalStaticData.sites && globalStaticData.categories) {
      categories.value = globalStaticData.categories || []
      sites.value = (globalStaticData.sites || []).map(site => ({
        ...site,
        logoError: false
      }))
      loading.value = false
      return true
    }
    
    // 只有设置信息，不返回true，让页面继续从API获取网站和分类数据
    return false
  }
  
  // 然后检查注入的静态数据（用于SSR）
  if (staticData) {
    console.log('使用注入的静态数据')
    categories.value = staticData.categories || []
    sites.value = (staticData.sites || []).map(site => ({
      ...site,
      logoError: false
    }))
    settings.value = staticData.settings || settings.value
    
    if (staticData.selectedCategory) {
      selectedCategory.value = staticData.selectedCategory
    }
    
    loading.value = false
    return true
  }
  return false
}

// 从API获取分类
async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`)
    const result = await response.json()
    if (result.success) {
      categories.value = result.data
    }
  } catch (error) {
    console.error('获取分类失败:', error)
    // 使用默认分类
    categories.value = [
      { id: 'all', name: '全部' },
      { id: 'design', name: '设计' },
      { id: 'dev', name: '开发' },
      { id: 'tools', name: '工具' },
      { id: 'ai', name: 'AI' }
    ]
  }
}

// 从API获取网站
async function fetchSites() {
  try {
    const response = await fetch(`${API_BASE}/sites`)
    const result = await response.json()
    if (result.success) {
      sites.value = result.data.map(site => ({
        ...site,
        logoError: false
      }))
    }
  } catch (error) {
    console.error('获取网站失败:', error)
  }
}

// 从API获取设置
async function fetchSettings() {
  try {
    const response = await fetch(`${API_BASE}/settings`)
    const result = await response.json()
    if (result.success) {
      settings.value = result.data
      itemsPerPage.value = result.data.sitesPerPage || 20
      
      if (result.data.defaultCategory) {
        selectedCategory.value = result.data.defaultCategory
      }
    }
  } catch (error) {
    console.error('获取设置失败:', error)
  }
}

// 计算属性
const isDark = computed(() => themeStore.isDark)
const lang = computed(() => langStore.lang)
const t = langStore.t
const isAdmin = computed(() => !!localStorage.getItem('auth_token'))

const filteredSites = computed(() => {
  let filtered = sites.value
  
  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(site => site.category_id === selectedCategory.value)
  }
  
  // 按搜索词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(site => 
      site.name.toLowerCase().includes(query) ||
      (site.description || '').toLowerCase().includes(query) ||
      site.url.toLowerCase().includes(query)
    )
  }
  
  // 分页
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  // 计算过滤后的总数
  let filtered = sites.value
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(site => site.category_id === selectedCategory.value)
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(site => 
      site.name.toLowerCase().includes(query) ||
      (site.description || '').toLowerCase().includes(query) ||
      site.url.toLowerCase().includes(query)
    )
  }
  return Math.ceil(filtered.length / itemsPerPage.value) || 1
})

// 方法
const toggleTheme = () => themeStore.toggleTheme()
const toggleLang = () => langStore.toggleLang()

const getCategoryCount = (categoryId) => {
  if (categoryId === 'all') return sites.value.length
  return sites.value.filter(site => site.category_id === categoryId).length
}

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
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

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  if (!category) return lang.value === 'zh' ? '未分类' : 'Uncategorized'
  
  const categoryMap = {
    '磁力资源': 'category.magnetResources',
    '常用网盘': 'category.cloudStorage',
    'AI类站': 'category.aiSites',
    'IT类站': 'category.itSites',
    '工具类站': 'category.toolSites',
    '动漫卡通': 'category.anime',
    '影视网站': 'category.videoSites',
    '音乐网站': 'category.musicSites',
    '其它资源': 'category.otherResources',
    '设计': 'category.design',
    '开发': 'category.development',
    '工具': 'category.tools',
    'AI': 'category.ai',
    '新闻': 'category.news',
    '购物': 'category.shopping',
    '学习': 'category.learning',
    '娱乐': 'category.entertainment',
    '社交': 'category.social'
  }
  
  const translationKey = categoryMap[category.name]
  return translationKey ? t(translationKey) : category.name
}

const getCategoryDisplayName = (category) => {
  const categoryMap = {
    '磁力资源': 'category.magnetResources',
    '常用网盘': 'category.cloudStorage',
    'AI类站': 'category.aiSites',
    'IT类站': 'category.itSites',
    '工具类站': 'category.toolSites',
    '动漫卡通': 'category.anime',
    '影视网站': 'category.videoSites',
    '音乐网站': 'category.musicSites',
    '其它资源': 'category.otherResources',
    '设计': 'category.design',
    '开发': 'category.development',
    '工具': 'category.tools',
    'AI': 'category.ai',
    '新闻': 'category.news',
    '购物': 'category.shopping',
    '学习': 'category.learning',
    '娱乐': 'category.entertainment',
    '社交': 'category.social'
  }
  
  const translationKey = categoryMap[category.name]
  return translationKey ? t(translationKey) : category.name
}

const getSiteTags = (site) => {
  if (!site) return []
  const tags = lang.value === 'zh' ? site.tags : (site.tagsEn || site.tags)
  if (!tags) return []
  return tags.split(',').map(tag => tag.trim()).filter(tag => tag)
}

const getSitesByCategory = (categoryId) => {
  return sites.value.filter(site => 
    site.is_visible && site.category_id === categoryId
  )
}

const goToDetail = (siteId) => {
  window.open(`/detail/index.html?id=${siteId}`, '_blank')
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const renderFooterContent = () => {
  const footerText = t('footer.copyright')
  const year = new Date().getFullYear()
  const content = footerText.replace(/\{\{year\}\}/g, year)
  
  const temp = document.createElement('div')
  temp.textContent = content
  return temp.innerHTML
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

onMounted(async () => {
  loading.value = true
  
  // 增加页面浏览量
  incrementPageView()
  
  // 首先检查是否有静态数据
  if (initializeData()) {
    return
  }
  
  // 没有静态数据，从API获取
  try {
    // 并行获取所有数据
    await Promise.all([
      fetchCategories(),
      fetchSites(),
      fetchSettings(),
      fetchLogoCache()
    ])
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
})

// 监听设置变化，更新页面标题
watch(() => settings.value.siteTitle, (newTitle) => {
  if (newTitle) {
    document.title = newTitle
  }
}, { immediate: true })
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
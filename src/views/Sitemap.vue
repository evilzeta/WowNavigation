<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- 顶部导航栏 -->
    <nav class="sticky top-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Logo和标题 -->
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-sitemap text-white text-xl"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-800 dark:text-white">
                网站地图
              </h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                浏览所有网站资源
              </p>
            </div>
          </div>
          
          <!-- 右侧控制按钮 -->
          <div class="flex items-center space-x-3">
            <router-link
              to="/"
              class="px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors"
            >
              <i class="fas fa-home mr-2"></i>
              返回首页
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- 网站地图内容 -->
    <div class="container mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">加载中...</p>
      </div>
      
      <div v-else>
        <!-- 分类列表 -->
        <div v-for="category in categories" :key="category.id" class="mb-12">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-folder text-white"></i>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                {{ category.name }}
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ getCategoryCount(category.id) }} 个网站
              </p>
            </div>
          </div>
          
          <!-- 网站列表 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div
              v-for="site in getSitesByCategory(category.id)"
              :key="site.id"
              @click="goToDetail(site.id)"
              class="card cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
            >
              <div class="p-4">
                <div class="flex items-center mb-3">
                  <div class="w-10 h-10 rounded-lg overflow-hidden">
                    <img
                      v-if="getSiteLogo(site) && !site.logoError"
                      :src="getSiteLogo(site)"
                      :alt="site.name"
                      class="w-full h-full object-cover"
                      @error="site.logoError = true"
                    />
                    <DefaultLogo v-else :name="site.name" :size="40" />
                  </div>
                  <div class="ml-3 flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-800 dark:text-white truncate">
                      {{ site.name }}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 统计信息 -->
        <div class="card mt-12">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <i class="fas fa-chart-bar mr-2 text-green-500"></i>
              网站统计
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-500 dark:text-blue-400">
                  {{ totalSites }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  总网站数
                </div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-green-500 dark:text-green-400">
                  {{ categories.length }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  分类数量
                </div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-purple-500 dark:text-purple-400">
                  {{ totalVisits }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  总访问量
                </div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-orange-500 dark:text-orange-400">
                  {{ today }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  今天
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import DefaultLogo from '../components/DefaultLogo.vue'

const router = useRouter()
const themeStore = useThemeStore()

const sites = ref([])
const categories = ref([])
const loading = ref(true)

const isDark = () => themeStore.isDark

const API_BASE = '/api'

const totalSites = computed(() => sites.value.length)
const totalVisits = computed(() => sites.value.reduce((sum, site) => sum + (site.visits || 0), 0))
const today = computed(() => new Date().toLocaleDateString('zh-CN'))

const getSiteLogo = (site) => {
  if (site.logo) {
    return site.logo
  }
  return null
}

const getSitesByCategory = (categoryId) => {
  return sites.value.filter(site => site.category_id == categoryId)
}

const getCategoryCount = (categoryId) => {
  return getSitesByCategory(categoryId).length
}

const goToDetail = (siteId) => {
  router.push(`/detail/index.html?id=${siteId}`)
}

const fetchSites = async () => {
  try {
    const response = await fetch(`${API_BASE}/sites`)
    const result = await response.json()
    if (result.success && result.data) {
      sites.value = result.data
    }
  } catch (error) {
    console.error('获取网站列表失败:', error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE}/categories`)
    const result = await response.json()
    if (result.success && result.data) {
      categories.value = result.data
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchSites(),
      fetchCategories()
    ])
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

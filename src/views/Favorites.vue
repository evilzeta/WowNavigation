<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- 顶部导航栏 -->
    <nav class="sticky top-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Logo和标题 -->
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-heart text-white text-xl"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-800 dark:text-white">
                收藏本站
              </h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                保存您喜欢的网站
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
    
    <!-- 收藏列表 -->
    <div class="container mx-auto px-4 py-8">
      <div v-if="favoriteSites.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div
          v-for="site in favoriteSites"
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
            
            <!-- 标签和统计 -->
            <div class="flex items-center justify-between">
              <!-- 标签 -->
              <div class="flex items-center space-x-1">
                <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                  {{ getCategoryName(site.category_id) }}
                </span>
              </div>
              
              <!-- 移除收藏按钮 -->
              <button
                @click.stop="removeFavorite(site.id)"
                class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                title="移除收藏"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="text-center py-20">
        <i class="fas fa-heart text-gray-400 text-6xl mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          暂无收藏
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          在网站详情页点击收藏按钮，将网站添加到收藏夹
        </p>
        <router-link
          to="/"
          class="inline-block mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <i class="fas fa-compass mr-2"></i>
          浏览网站
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import DefaultLogo from '../components/DefaultLogo.vue'

const router = useRouter()
const themeStore = useThemeStore()

const favoriteSites = ref([])
const allSites = ref([])
const allCategories = ref([])
const loading = ref(true)

const isDark = () => themeStore.isDark

const API_BASE = '/api'

const getSiteLogo = (site) => {
  if (site.logo) {
    return site.logo
  }
  return null
}

const getCategoryName = (categoryId) => {
  const category = allCategories.value.find(c => c.id == categoryId)
  return category ? category.name : '未知分类'
}

const goToDetail = (siteId) => {
  router.push(`/detail/index.html?id=${siteId}`)
}

const removeFavorite = (siteId) => {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  const updatedFavorites = favorites.filter(id => id !== siteId)
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
  loadFavorites()
}

const loadFavorites = () => {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  favoriteSites.value = allSites.value.filter(site => favorites.includes(site.id))
}

const fetchSites = async () => {
  try {
    const response = await fetch(`${API_BASE}/sites`)
    const result = await response.json()
    if (result.success && result.data) {
      allSites.value = result.data
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
      allCategories.value = result.data
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
    loadFavorites()
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

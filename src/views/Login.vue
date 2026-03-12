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
          </div>
        </div>
      </div>
    </nav>
    
    <!-- 主要内容区域 -->
    <main class="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4">
            <i class="fas fa-compass text-white text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ t('login.title') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {{ t('login.subtitle') }}
          </p>
        </div>
        
        <!-- 登录表单 -->
        <div class="card p-8">
          <form @submit.prevent="handleLogin">
            <div class="space-y-6">
              <!-- 用户名 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('login.username') }}
                </label>
                <div class="relative">
                  <input
                    v-model="form.username"
                    type="text"
                    required
                    class="input pl-10"
                    :placeholder="t('login.usernamePlaceholder')"
                  >
                  <div class="absolute left-3 top-2.5 text-gray-400">
                    <i class="fas fa-user"></i>
                  </div>
                </div>
              </div>
              
              <!-- 密码 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('login.password') }}
                </label>
                <div class="relative">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="input pl-10 pr-10"
                    :placeholder="t('login.passwordPlaceholder')"
                  >
                  <div class="absolute left-3 top-2.5 text-gray-400">
                    <i class="fas fa-lock"></i>
                  </div>
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>
              
              <!-- 记住我 -->
              <div class="flex items-center">
                <input
                  v-model="form.remember"
                  type="checkbox"
                  id="remember"
                  class="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                >
                <label for="remember" class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {{ t('login.remember') }}
                </label>
              </div>
              
              <!-- 错误信息 -->
              <div v-if="errorMessage" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div class="flex items-center text-red-600 dark:text-red-400">
                  <i class="fas fa-exclamation-circle mr-2"></i>
                  {{ errorMessage }}
                </div>
              </div>
              
              <!-- 提交按钮 -->
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full btn btn-primary py-3 text-lg"
              >
                <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-sign-in-alt mr-2"></i>
                {{ isLoading ? t('login.loggingIn') : t('login.loginButton') }}
              </button>
              
              <!-- 返回主页 -->
              <div class="text-center">
                <router-link
                  to="/"
                  class="inline-flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <i class="fas fa-arrow-left mr-2"></i>
                  {{ t('login.backToHome') }}
                </router-link>
              </div>
            </div>
          </form>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { useLangStore } from '../stores/lang'

const router = useRouter()
const themeStore = useThemeStore()
const langStore = useLangStore()

const lang = computed(() => langStore.lang)
const t = langStore.t
const isDark = computed(() => themeStore.isDark)

const toggleTheme = () => {
  themeStore.toggle()
}

const toggleLang = () => {
  langStore.toggle()
}

const form = ref({
  username: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const settings = ref({
  siteTitle: 'WebStack导航',
  siteDescription: '发现优质网站资源'
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

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    errorMessage.value = t('login.error.empty')
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const response = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.value.username,
        password: form.value.password
      })
    })
    
    const result = await response.json()
    
    if (result.success && result.data) {
      localStorage.setItem('auth_token', result.data.token || 'authenticated')
      localStorage.setItem('auth_user', JSON.stringify({
        username: result.data.username,
        role: result.data.role
      }))
      
      router.push('/admin')
    } else {
      errorMessage.value = result.error || t('login.error.invalid')
    }
  } catch (error) {
    console.error('登录失败:', error)
    errorMessage.value = t('login.error.failed')
  }
  
  isLoading.value = false
}

onMounted(() => {
  fetchSettings()
})
</script>
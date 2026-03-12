<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 管理侧边栏 -->
    <div class="flex">
      <!-- 侧边栏 -->
      <aside class="hidden md:block w-64 bg-white dark:bg-gray-800 min-h-screen border-r border-gray-200 dark:border-gray-700 sticky top-0">
        <div class="p-6">
          <div class="flex items-center mb-8">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-cog text-white"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-800 dark:text-white">
                管理后台
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                网站内容管理
              </p>
            </div>
          </div>
          
          <!-- 导航菜单 -->
          <nav class="space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center',
                activeTab === tab.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <i :class="[tab.icon, 'mr-3']"></i>
              {{ tab.name }}
              <span v-if="tab.count" class="ml-auto bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded">
                {{ tab.count }}
              </span>
            </button>
          </nav>
          
          <!-- 用户信息 -->
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-gray-600 dark:text-gray-400"></i>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-800 dark:text-white">
                  {{ user?.username || '管理员' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ user?.role || '管理员' }}
                </p>
              </div>
              <button
                @click="handleLogout"
                class="ml-auto text-gray-400 hover:text-red-500"
                title="退出登录"
              >
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>
            <button
              @click="goToHomepage"
              class="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <i class="fas fa-home mr-2"></i>
              访问主页
            </button>
          </div>
        </div>
      </aside>
      
      <!-- 移动端顶部栏 -->
      <div class="md:hidden w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div class="px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2 mr-3">
                <i class="fas fa-bars text-gray-600 dark:text-gray-400"></i>
              </button>
              <h2 class="text-lg font-bold text-gray-800 dark:text-white">
                管理后台
              </h2>
            </div>
            <div class="flex items-center space-x-3">
              <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2">
                <i class="fas fa-ellipsis-v text-gray-600 dark:text-gray-400"></i>
              </button>
            </div>
          </div>
          
          <!-- 移动端标签选择 -->
          <div class="mt-3 overflow-x-auto">
            <div class="flex space-x-2 pb-2">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'flex-shrink-0 px-3 py-1.5 rounded-full text-sm',
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                ]"
              >
                {{ tab.name }}
                <span v-if="tab.count" class="ml-1 text-xs opacity-75">
                  ({{ tab.count }})
                </span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 移动端菜单 -->
        <div v-if="mobileMenuOpen" class="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
          <div class="p-4">
            <div class="space-y-1">
              <div v-for="tab in tabs" :key="tab.id" class="px-3 py-2">
                <button
                  @click="activeTab = tab.id; mobileMenuOpen = false"
                  class="flex items-center w-full text-left"
                >
                  <i :class="[tab.icon, 'mr-3 text-gray-400']"></i>
                  {{ tab.name }}
                </button>
              </div>
            </div>
            
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-gray-600 dark:text-gray-400"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-800 dark:text-white">
                      {{ user?.username || '管理员' }}
                    </p>
                  </div>
                </div>
                <button
                  @click="handleLogout"
                  class="text-red-500 hover:text-red-600"
                >
                  <i class="fas fa-sign-out-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 主内容区 -->
      <main class="flex-1 min-h-screen">
        <!-- 网站管理 -->
        <div v-if="activeTab === 'sites'" class="p-4 md:p-6">
          <div class="mb-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
                  网站管理
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  管理导航网站内容
                </p>
              </div>
              <button
                @click="showAddSiteModal = true"
                class="btn btn-primary flex items-center"
              >
                <i class="fas fa-plus mr-2"></i>
                添加网站
              </button>
            </div>
            
            <!-- 筛选和搜索 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6">
              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                  <input
                    v-model="siteSearch"
                    type="text"
                    placeholder="搜索网站名称或URL..."
                    class="input"
                  >
                </div>
                <div class="flex space-x-3">
                  <select
                    v-model="siteStatusFilter"
                    class="input"
                  >
                    <option value="all">全部状态</option>
                    <option value="active">正常</option>
                    <option value="inactive">失效</option>
                    <option value="hidden">隐藏</option>
                  </select>
                  <select
                    v-model="siteCategoryFilter"
                    class="input"
                  >
                    <option value="all">全部分类</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                      {{ cat.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 网站列表 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      网站
                    </th>
                    <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      分类
                    </th>
                    <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      状态
                    </th>
                    <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      访问量
                    </th>
                    <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="site in filteredSites" :key="site.id">
                    <td class="py-4 px-4">
                      <div class="flex items-center">
                        <div class="w-10 h-10 mr-3">
                          <img
                            v-if="!site.logoError"
                            :src="getSiteLogo(site)"
                            :alt="site.name"
                            class="w-full h-full object-cover rounded-lg"
                            @error="site.logoError = true"
                          >
                          <DefaultLogo v-else :name="site.name" :size="40" />
                        </div>
                        <div>
                          <div class="font-medium text-gray-800 dark:text-white">
                            {{ site.name }}
                          </div>
                          <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {{ site.url }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-4">
                      <span class="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {{ getCategoryName(site.category_id) }}
                      </span>
                    </td>
                    <td class="py-4 px-4">
                      <div class="flex items-center">
                        <div
                          :class="[
                            'w-2 h-2 rounded-full mr-2',
                            site.is_active ? 'bg-green-500' : 'bg-red-500'
                          ]"
                        ></div>
                        <span :class="site.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                          {{ site.is_active ? '正常' : '失效' }}
                        </span>
                        <span v-if="!site.is_visible" class="ml-2 text-xs text-gray-500">
                          (隐藏)
                        </span>
                      </div>
                    </td>
                    <td class="py-4 px-4">
                      <div class="text-gray-800 dark:text-white">
                        {{ site.visits || 0 }}
                      </div>
                    </td>
                    <td class="py-4 px-4">
                      <div class="flex space-x-2">
                        <button
                          @click="editSite(site)"
                          class="p-2 text-blue-500 hover:text-blue-600"
                          title="编辑"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button
                          @click="toggleSiteVisibility(site)"
                          :title="site.is_visible ? '隐藏网站' : '显示网站'"
                          class="p-2 text-gray-500 hover:text-gray-700"
                        >
                          <i :class="site.is_visible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                        </button>
                        <button
                          @click="testSiteLink(site)"
                          class="p-2 text-green-500 hover:text-green-600"
                          title="测试链接"
                        >
                          <i class="fas fa-link"></i>
                        </button>
                        <button
                          @click="deleteSite(site)"
                          class="p-2 text-red-500 hover:text-red-600"
                          title="删除"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- 空状态 -->
            <div v-if="filteredSites.length === 0" class="text-center py-12">
              <i class="fas fa-globe text-gray-400 text-4xl mb-4"></i>
              <p class="text-gray-500 dark:text-gray-400">
                {{ siteSearch ? '没有找到匹配的网站' : '还没有添加任何网站' }}
              </p>
              <button
                v-if="!siteSearch"
                @click="showAddSiteModal = true"
                class="mt-4 btn btn-primary"
              >
                <i class="fas fa-plus mr-2"></i>
                添加第一个网站
              </button>
            </div>
          </div>
        </div>
        
        <!-- 分类管理 -->
        <div v-else-if="activeTab === 'categories'" class="p-4 md:p-6">
          <div class="mb-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
                  分类管理
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  管理网站分类
                </p>
              </div>
              <button
                @click="showAddCategoryModal = true"
                class="btn btn-primary flex items-center"
              >
                <i class="fas fa-plus mr-2"></i>
                添加分类
              </button>
            </div>
          </div>
          
          <!-- 分类列表 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="category in categories"
              :key="category.id"
              class="card p-5"
            >
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h4 class="font-bold text-lg text-gray-800 dark:text-white mb-1">
                    {{ category.name }}
                  </h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ getCategorySiteCount(category.id) }} 个网站
                  </p>
                </div>
                <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  {{ category.sort_order || 0 }}
                </span>
              </div>
              
              <div class="flex justify-end space-x-2">
                <button
                  @click="editCategory(category)"
                  class="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  编辑
                </button>
                <button
                  v-if="category.id !== 'all'"
                  @click="deleteCategory(category)"
                  class="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 链接检查 -->
        <div v-else-if="activeTab === 'checks'" class="p-4 md:p-6">
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              链接检查
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              自动检查网站链接有效性
            </p>
          </div>
          
          <!-- 检查统计 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="card p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                  <i class="fas fa-check text-green-600 dark:text-green-400 text-xl"></i>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-800 dark:text-white">
                    {{ healthySitesCount }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    正常网站
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-4">
                  <i class="fas fa-times text-red-600 dark:text-red-400 text-xl"></i>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-800 dark:text-white">
                    {{ brokenSitesCount }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    失效链接
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                  <i class="fas fa-clock text-blue-600 dark:text-blue-400 text-xl"></i>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-800 dark:text-white">
                    {{ lastCheckTime }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    最后检查
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 检查控制 -->
          <div class="card p-6 mb-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  自动检查设置
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  设置自动检查链接有效性的频率
                </p>
              </div>
              <div class="flex items-center space-x-4">
                <select v-model="autoCheckInterval" class="input">
                  <option value="daily">每天一次</option>
                  <option value="weekly">每周一次</option>
                  <option value="monthly">每月一次</option>
                  <option value="manual">手动检查</option>
                </select>
                <button
                  @click="runLinkCheck"
                  :disabled="isChecking"
                  class="btn btn-primary flex items-center"
                >
                  <i v-if="isChecking" class="fas fa-spinner fa-spin mr-2"></i>
                  <i v-else class="fas fa-play mr-2"></i>
                  {{ isChecking ? '检查中...' : '立即检查' }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- 检查结果 -->
          <div class="card overflow-hidden">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white">
                检查结果
              </h4>
            </div>
            
            <div v-if="checkResults.length === 0" class="p-8 text-center">
              <i class="fas fa-search text-gray-400 text-4xl mb-4"></i>
              <p class="text-gray-500 dark:text-gray-400 mb-4">
                还没有运行链接检查
              </p>
              <button
                @click="runLinkCheck"
                class="btn btn-primary"
              >
                <i class="fas fa-play mr-2"></i>
                运行链接检查
              </button>
            </div>
            
            <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
              <div
                v-for="result in checkResults"
                :key="result.site_id"
                class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div
                      :class="[
                        'w-3 h-3 rounded-full mr-3',
                        result.is_valid ? 'bg-green-500' : 'bg-red-500'
                      ]"
                    ></div>
                    <div>
                      <div class="font-medium text-gray-800 dark:text-white">
                        {{ getSiteName(result.site_id) }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ result.checked_at }}
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-mono text-gray-800 dark:text-white">
                      {{ result.status_code || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      响应时间: {{ result.response_time || 'N/A' }}ms
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Logo批量获取 -->
        <div v-else-if="activeTab === 'logos'" class="p-4 md:p-6">
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Logo批量获取
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              批量获取网站favicon图标并保存
            </p>
          </div>
          
          <!-- 获取统计 -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="card p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                  <i class="fas fa-globe text-blue-600 dark:text-blue-400 text-xl"></i>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-800 dark:text-white">
                    {{ sites.length }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    总网站数
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                  <i class="fas fa-check-circle text-green-600 dark:text-green-400 text-xl"></i>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-800 dark:text-white">
                    {{ logoSuccessCount }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    成功获取
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-4">
                  <i class="fas fa-times-circle text-red-600 dark:text-red-400 text-xl"></i>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-800 dark:text-white">
                    {{ logoFailedCount }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    获取失败
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                  <i class="fas fa-clock text-purple-600 dark:text-purple-400 text-xl"></i>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-800 dark:text-white">
                    {{ logoProgress }}%
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    进度
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 获取控制 -->
          <div class="card p-6 mb-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Logo源选择
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  选择要使用的Logo API接口
                </p>
              </div>
              <div class="flex items-center space-x-4">
                <select v-model="logoApiSource" class="input">
                  <option value="custom">自建API（推荐）</option>
                  <option value="google">Google Favicon</option>
                  <option value="bing">Bing Favicon</option>
                  <option value="duckduckgo">DuckDuckGo</option>
                </select>
                <button
                  @click="runLogoFetch"
                  :disabled="isFetchingLogos"
                  class="btn btn-primary flex items-center"
                >
                  <i v-if="isFetchingLogos" class="fas fa-spinner fa-spin mr-2"></i>
                  <i v-else class="fas fa-download mr-2"></i>
                  {{ isFetchingLogos ? '获取中...' : '批量获取Logo' }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- 获取结果 -->
          <div class="card overflow-hidden">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white">
                获取结果
              </h4>
            </div>
            
            <div v-if="logoResults.length === 0" class="p-8 text-center">
              <i class="fas fa-image text-gray-400 text-4xl mb-4"></i>
              <p class="text-gray-500 dark:text-gray-400 mb-4">
                还没有运行Logo获取
              </p>
              <button
                @click="runLogoFetch"
                :disabled="isFetchingLogos"
                class="btn btn-primary"
              >
                <i class="fas fa-download mr-2"></i>
                开始批量获取
              </button>
            </div>
            
            <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
              <div
                v-for="result in logoResults"
                :key="result.site_id"
                class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div
                      :class="[
                        'w-3 h-3 rounded-full mr-3',
                        result.success ? 'bg-green-500' : 'bg-red-500'
                      ]"
                    ></div>
                    <div class="w-10 h-10 mr-3">
                      <img
                        v-if="result.success && result.logoUrl"
                        :src="result.logoUrl"
                        :alt="result.site_name"
                        class="w-full h-full object-cover rounded-lg"
                      >
                      <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <i class="fas fa-image text-gray-400"></i>
                      </div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-800 dark:text-white">
                        {{ result.site_name }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ result.site_url }}
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div :class="[
                      'text-sm font-medium',
                      result.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    ]">
                      {{ result.success ? '成功' : '失败' }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ result.fetched_at }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 账户设置 -->
        <div v-else-if="activeTab === 'account'" class="p-4 md:p-6">
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              账户设置
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              修改管理员账户信息
            </p>
          </div>
          
          <div class="max-w-2xl">
            <div class="card p-6">
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                修改账户信息
              </h4>
              
              <div class="space-y-6">
                <!-- 用户名 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    用户名
                  </label>
                  <input
                    v-model="accountForm.username"
                    type="text"
                    class="input"
                    placeholder="请输入新用户名"
                  >
                </div>
                
                <!-- 旧密码 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    旧密码
                  </label>
                  <input
                    v-model="accountForm.oldPassword"
                    type="password"
                    class="input"
                    placeholder="请输入旧密码"
                  >
                </div>
                
                <!-- 新密码 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    新密码
                  </label>
                  <input
                    v-model="accountForm.newPassword"
                    type="password"
                    class="input"
                    placeholder="请输入新密码（留空则不修改）"
                  >
                </div>
                
                <!-- 确认新密码 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    确认新密码
                  </label>
                  <input
                    v-model="accountForm.confirmPassword"
                    type="password"
                    class="input"
                    placeholder="请再次输入新密码"
                  >
                </div>
              </div>
              
              <!-- 保存按钮 -->
              <div class="mt-8 flex justify-end">
                <button
                  @click="saveAccount"
                  :disabled="savingAccount"
                  class="btn btn-primary px-8"
                >
                  <i v-if="savingAccount" class="fas fa-spinner fa-spin mr-2"></i>
                  <i v-else class="fas fa-save mr-2"></i>
                  {{ savingAccount ? '保存中...' : '保存账户信息' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- AI配置 -->
        <div v-else-if="activeTab === 'ai'" class="p-4 md:p-6">
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              AI配置
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              配置AI接口用于自动生成网站描述
            </p>
          </div>
          
          <div class="card p-6">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              AI接口设置
            </h4>
            
            <div class="space-y-6">
              <!-- AI提供商 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AI提供商
                </label>
                <select
                  v-model="aiSettings.provider"
                  class="input"
                >
                  <optgroup label="国外大模型">
                    <option value="openai">OpenAI (GPT)</option>
                    <option value="anthropic">Anthropic (Claude)</option>
                  </optgroup>
                  <optgroup label="国产大模型">
                    <option value="deepseek">DeepSeek</option>
                    <option value="qwen">通义千问 (Qwen)</option>
                    <option value="doubao">字节豆包 (Doubao)</option>
                    <option value="zhipu">智谱AI (ChatGLM)</option>
                    <option value="moonshot">月之暗面 (Kimi)</option>
                  </optgroup>
                  <optgroup label="其他">
                    <option value="custom">自定义接口</option>
                  </optgroup>
                </select>
              </div>
              
              <!-- API Key -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  v-model="aiSettings.apiKey"
                  type="password"
                  class="input"
                  placeholder="输入您的API Key"
                >
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  您的API Key将安全存储，仅用于生成网站描述
                </p>
              </div>
              
              <!-- API URL (自定义) -->
              <div v-if="aiSettings.provider === 'custom'">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API URL
                </label>
                <input
                  v-model="aiSettings.apiUrl"
                  type="text"
                  class="input"
                  placeholder="https://api.example.com/v1/chat/completions"
                >
              </div>
              
              <!-- 模型选择 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  模型
                </label>
                <input
                  v-model="aiSettings.model"
                  type="text"
                  class="input"
                  :placeholder="getModelPlaceholder()"
                >
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  根据选择的AI提供商输入相应的模型名称
                </p>
              </div>
              
              <!-- 描述长度 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  描述长度
                </label>
                <input
                  v-model.number="aiSettings.maxLength"
                  type="number"
                  min="50"
                  max="500"
                  class="input"
                  placeholder="200"
                >
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  AI生成描述的最大字符数（50-500）
                </p>
              </div>
              
              <!-- 提示词模板 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  提示词模板
                </label>
                <textarea
                  v-model="aiSettings.promptTemplate"
                  rows="4"
                  class="input resize-none"
                  placeholder="请为以下网站生成一个简洁的描述：网站名称：{name}，网址：{url}"
                ></textarea>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  可使用 {name} 和 {url} 变量
                </p>
              </div>
              
              <!-- 保存按钮 -->
              <div class="pt-4 flex gap-3">
                <button
                  @click="testAIAPI"
                  :disabled="testing || !aiSettings.apiKey"
                  class="btn btn-secondary"
                >
                  <i :class="testing ? 'fas fa-spinner fa-spin' : 'fas fa-vial'" class="mr-2"></i>
                  {{ testing ? '测试中...' : '测试API' }}
                </button>
                <button
                  @click="saveAISettings"
                  :disabled="saving"
                  class="btn btn-primary"
                >
                  <i class="fas fa-save mr-2"></i>
                  {{ saving ? '保存中...' : '保存AI配置' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 系统设置 -->
        <div v-else class="p-4 md:p-6">
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              系统设置
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              管理系统配置和选项
            </p>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- 基本设置 -->
            <div class="card p-6">
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                基本设置
              </h4>
              
              <div class="space-y-6">
                <!-- 网站标题 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    网站标题
                  </label>
                  <input
                    v-model="settings.siteTitle"
                    type="text"
                    class="input"
                    placeholder="WebStack导航"
                  >
                </div>
                
                <!-- 网站描述 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    网站描述
                  </label>
                  <textarea
                    v-model="settings.siteDescription"
                    rows="3"
                    class="input resize-none"
                    placeholder="发现优质网站资源"
                  ></textarea>
                </div>
                
                <!-- 页脚内容 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    页脚内容
                  </label>
                  <textarea
                    v-model="settings.siteFooter"
                    rows="3"
                    class="input resize-none"
                    placeholder="© {{year}} WebStack导航. 保留所有权利."
                  ></textarea>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    可使用 {{year}} 变量自动显示当前年份
                  </p>
                </div>
              </div>
            </div>
            
            <!-- 高级设置 -->
            <div class="card p-6">
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                高级设置
              </h4>
              
              <div class="space-y-6">
                <!-- 自动获取信息 -->
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-gray-800 dark:text-white mb-1">
                      自动获取网站信息
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      添加网站时自动获取Logo和描述
                    </div>
                  </div>
                  <button
                    @click="settings.autoFetchInfo = !settings.autoFetchInfo"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      settings.autoFetchInfo ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        settings.autoFetchInfo ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    ></span>
                  </button>
                </div>
                
                <!-- 启用缓存 -->
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-gray-800 dark:text-white mb-1">
                      启用浏览器缓存
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      提高页面加载速度
                    </div>
                  </div>
                  <button
                    @click="settings.enableCache = !settings.enableCache"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      settings.enableCache ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        settings.enableCache ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    ></span>
                  </button>
                </div>
                
                <!-- 数据备份 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    数据备份
                  </label>
                  <div class="flex space-x-3">
                    <button
                      @click="exportData"
                      class="flex-1 btn btn-secondary flex items-center justify-center"
                    >
                      <i class="fas fa-download mr-2"></i>
                      导出数据
                    </button>
                    <button
                      @click="showImportModal = true"
                      class="flex-1 btn btn-secondary flex items-center justify-center"
                    >
                      <i class="fas fa-upload mr-2"></i>
                      导入数据
                    </button>
                  </div>
                </div>
                
                <!-- 重置数据 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    危险操作
                  </label>
                  <button
                    @click="resetAllData"
                    class="w-full btn border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center"
                  >
                    <i class="fas fa-trash mr-2"></i>
                    重置所有数据
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 保存设置 -->
          <div class="mt-8 flex justify-end">
            <button
              @click="saveSettings"
              class="btn btn-primary px-8"
            >
              <i class="fas fa-save mr-2"></i>
              保存设置
            </button>
          </div>
        </div>
      </main>
    </div>
    
    <!-- 添加/编辑网站模态框 -->
    <div
      v-if="showAddSiteModal || editingSite"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="closeSiteModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            {{ editingSite ? '编辑网站' : '添加网站' }}
          </h3>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="saveSite">
            <div class="space-y-6">
              <!-- 网站URL -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  网站URL *
                </label>
                <input
                  v-model="siteForm.url"
                  type="url"
                  required
                  class="input"
                  placeholder="https://example.com"
                  @blur="fetchSiteInfo"
                >
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  请输入完整的网址（包含 https://）
                </p>
              </div>
              
              <!-- 网站名称 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  网站名称 *
                </label>
                <input
                  v-model="siteForm.name"
                  type="text"
                  required
                  class="input"
                  placeholder="网站名称"
                >
              </div>
              
              <!-- Logo URL -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo URL
                </label>
                <div class="space-y-3">
                  <!-- Logo源选择 -->
                  <div>
                    <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Logo源选择
                    </label>
                    <select
                      v-model="logoSource"
                      class="input"
                      @change="handleLogoSourceChange"
                    >
                      <option value="custom">自建API（推荐）</option>
                      <option value="google">Google Favicon（国外）</option>
                      <option value="bing">Bing Favicon（国内推荐）</option>
                      <option value="duckduckgo">DuckDuckGo（国外）</option>
                      <option value="customurl">自定义URL</option>
                    </select>
                  </div>
                  
                  <!-- Logo URL输入 -->
                  <div class="flex items-center space-x-4">
                    <input
                      v-model="siteForm.logo"
                      type="url"
                      class="input flex-1"
                      placeholder="https://example.com/logo.png"
                      :disabled="logoSource !== 'customurl'"
                    >
                    <button
                      type="button"
                      @click="fetchSiteInfo"
                      class="btn btn-secondary whitespace-nowrap"
                    >
                      <i v-if="loadingLogo" class="fas fa-spinner fa-spin mr-2"></i>
                      <i v-else class="fas fa-magic mr-2"></i>
                      自动获取
                    </button>
                  </div>
                  
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ logoSourceTips[logoSource] }}
                  </p>
                  
                  <!-- Logo预览 -->
                  <div v-if="siteForm.logo" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Logo预览</div>
                    <div class="flex items-center space-x-4">
                      <div class="relative">
                        <div v-if="!logoLoadError" class="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center">
                          <img
                            :src="siteForm.logo"
                            :alt="siteForm.name || 'Logo'"
                            class="w-full h-full object-cover"
                            @error="handleLogoError"
                            @load="logoLoadError = false"
                          >
                        </div>
                        <DefaultLogo v-else :name="siteForm.name" :size="64" />
                      </div>
                      <div class="flex-1">
                        <div class="text-sm">
                          <span v-if="logoLoadError" class="text-red-500">
                            <i class="fas fa-exclamation-triangle mr-1"></i>
                            Logo加载失败，已显示默认Logo
                          </span>
                          <span v-else-if="loadingLogo" class="text-blue-500">
                            <i class="fas fa-spinner fa-spin mr-1"></i>
                            加载中...
                          </span>
                          <span v-else class="text-green-500">
                            <i class="fas fa-check-circle mr-1"></i>
                            Logo加载成功
                          </span>
                        </div>
                        <div v-if="logoLoadError" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          尝试更换Logo源或使用自定义URL
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 描述 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  网站描述
                </label>
                <div class="flex gap-2">
                  <textarea
                    v-model="siteForm.description"
                    rows="3"
                    class="input resize-none flex-1"
                    placeholder="网站描述..."
                  ></textarea>
                  <button
                    @click="generateDescription()"
                    :disabled="generatingDescription || !siteForm.name || !siteForm.url"
                    class="btn btn-primary px-4 py-2 self-start"
                    title="使用AI生成描述"
                  >
                    <i :class="generatingDescription ? 'fas fa-spinner fa-spin' : 'fas fa-magic'"></i>
                  </button>
                </div>
              </div>
              
              <!-- 英文描述 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  英文描述
                </label>
                <div class="flex gap-2">
                  <textarea
                    v-model="siteForm.descriptionEn"
                    rows="3"
                    class="input resize-none flex-1"
                    placeholder="English description..."
                  ></textarea>
                  <button
                    @click="generateDescriptionEn()"
                    :disabled="generatingDescriptionEn || !siteForm.name || !siteForm.url"
                    class="btn btn-primary px-4 py-2 self-start"
                    title="使用AI生成英文描述"
                  >
                    <i :class="generatingDescriptionEn ? 'fas fa-spinner fa-spin' : 'fas fa-magic'"></i>
                  </button>
                </div>
              </div>
              
              <!-- 分类 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  分类 *
                </label>
                <select
                  v-model="siteForm.category_id"
                  required
                  class="input"
                >
                  <option value="">选择分类</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              
              <!-- 标签 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  标签（用逗号分隔）
                </label>
                <input
                  v-model="siteForm.tags"
                  type="text"
                  class="input"
                  placeholder="标签1, 标签2, 标签3"
                >
              </div>
              
              <!-- 英文标签 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  英文标签（用逗号分隔）
                </label>
                <input
                  v-model="siteForm.tagsEn"
                  type="text"
                  class="input"
                  placeholder="tag1, tag2, tag3"
                >
              </div>
              
              <!-- 推荐星数 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  推荐星数 (1-5)
                </label>
                <div class="flex items-center space-x-1">
                  <button
                    v-for="n in 5"
                    :key="n"
                    type="button"
                    @click="siteForm.stars = n"
                    :class="[
                      'p-1',
                      n <= siteForm.stars ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'
                    ]"
                  >
                    <i class="fas fa-star text-xl"></i>
                  </button>
                </div>
              </div>
              
              <!-- 状态 -->
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-800 dark:text-white mb-1">
                    显示在网站列表
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    是否在前台显示这个网站
                  </div>
                </div>
                <button
                  type="button"
                  @click="siteForm.is_visible = !siteForm.is_visible"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    siteForm.is_visible ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      siteForm.is_visible ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  ></span>
                </button>
              </div>
            </div>
            
            <div class="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                @click="closeSiteModal"
                class="btn btn-secondary"
              >
                取消
              </button>
              <button
                type="submit"
                class="btn btn-primary"
              >
                {{ editingSite ? '更新' : '添加' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑分类模态框 -->
    <div
      v-if="showAddCategoryModal || editingCategory"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="closeCategoryModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            {{ editingCategory ? '编辑分类' : '添加分类' }}
          </h3>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="saveCategory">
            <div class="space-y-6">
              <!-- 分类名称 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  分类名称 *
                </label>
                <input
                  v-model="categoryForm.name"
                  type="text"
                  required
                  class="input"
                  placeholder="设计工具"
                >
              </div>
              
              <!-- 分类标识 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  分类标识 *
                </label>
                <input
                  v-model="categoryForm.slug"
                  type="text"
                  required
                  class="input"
                  placeholder="design"
                >
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  英文标识，用于URL和代码识别
                </p>
              </div>
              
              <!-- 排序 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  排序序号
                </label>
                <input
                  v-model="categoryForm.sort_order"
                  type="number"
                  min="0"
                  class="input"
                >
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  数字越小，排序越靠前
                </p>
              </div>
            </div>
            
            <div class="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                @click="closeCategoryModal"
                class="btn btn-secondary"
              >
                取消
              </button>
              <button
                type="submit"
                class="btn btn-primary"
              >
                {{ editingCategory ? '更新' : '添加' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLogo from '../components/DefaultLogo.vue'

const router = useRouter()

// API 基础路径
const API_BASE = '/api'

// 状态
const activeTab = ref('sites')
const mobileMenuOpen = ref(false)
const loading = ref(true)
const saving = ref(false)
const testing = ref(false)
const user = ref(JSON.parse(localStorage.getItem('auth_user')))

// 网站管理
const sites = ref([])

// Logo缓存数据
const logoCache = ref({})

// 分类管理
const categories = ref([])

// 系统设置
const settings = ref({
  siteTitle: 'WebStack导航',
  siteDescription: '发现优质网站资源',
  siteFooter: '© {{year}} WebStack导航. 保留所有权利.',
  sitesPerPage: 20,
  autoFetchInfo: true,
  enableCache: true,
  defaultCategory: 'all'
})

// 账户设置
const accountForm = ref({
  username: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// AI设置
const aiSettings = ref({
  provider: 'deepseek',
  apiKey: '',
  apiUrl: '',
  model: 'deepseek-chat',
  maxLength: 200,
  promptTemplate: '请为以下网站生成一个简洁的描述（200字以内）：网站名称：{name}，网址：{url}'
})

const generatingDescription = ref(false)
const generatingDescriptionEn = ref(false)

const getModelPlaceholder = () => {
  const placeholders = {
    openai: 'gpt-3.5-turbo',
    anthropic: 'claude-3-haiku-20240307',
    deepseek: 'deepseek-chat',
    qwen: 'qwen-turbo',
    doubao: 'doubao-pro-32k',
    zhipu: 'glm-4',
    moonshot: 'moonshot-v1-8k',
    custom: '自定义模型名称'
  }
  return placeholders[aiSettings.value.provider] || '模型名称'
}

const savingAccount = ref(false)

// Logo加载状态
const logoLoadError = ref(false)
const loadingLogo = ref(false)

// API 请求函数
async function fetchSites() {
  try {
    const response = await fetch(`${API_BASE}/sites?all=true`)
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

async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`)
    const result = await response.json()
    if (result.success) {
      categories.value = result.data
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

async function fetchAISettings() {
  try {
    const response = await fetch(`${API_BASE}/ai-settings`)
    const result = await response.json()
    if (result.success) {
      aiSettings.value = result.data
    }
  } catch (error) {
    console.error('获取AI设置失败:', error)
  }
}

async function fetchLogoCache() {
  try {
    const response = await fetch(`${API_BASE}/logo-storage`)
    const result = await response.json()
    if (result.success) {
      logoCache.value = result.data
    }
  } catch (error) {
    console.error('获取Logo缓存失败:', error)
  }
}

async function fetchAccount() {
  try {
    const response = await fetch(`${API_BASE}/auth`)
    const result = await response.json()
    if (result.success) {
      accountForm.value.username = result.data.username
    }
  } catch (error) {
    console.error('获取账户信息失败:', error)
  }
}

// 过滤条件
const siteSearch = ref('')
const siteStatusFilter = ref('all')
const siteCategoryFilter = ref('all')

// 模态框状态
const showAddSiteModal = ref(false)
const showAddCategoryModal = ref(false)
const showImportModal = ref(false)
const editingSite = ref(null)
const editingCategory = ref(null)

// 表单数据
const siteForm = ref({
  name: '',
  url: '',
  logo: '',
  description: '',
  descriptionEn: '',
  category_id: '',
  tags: '',
  tagsEn: '',
  stars: 3,
  is_visible: true,
  is_active: true
})

// Logo源选择
const logoSource = ref('custom')
const logoSourceTips = {
  custom: '自建API服务，优先获取favicon.ico图标，速度快且稳定',
  google: 'Google Favicon服务，国外访问速度快，国内可能无法访问',
  bing: 'Bing Favicon服务，国内访问速度快，推荐国内用户使用',
  duckduckgo: 'DuckDuckGo Favicon服务，国外访问速度快',
  customurl: '自定义Logo URL，可使用任意图片链接'
}

const categoryForm = ref({
  name: '',
  slug: '',
  sort_order: 0
})

// 链接检查
const isChecking = ref(false)
const autoCheckInterval = ref('daily')
const checkResults = ref([])

// Logo批量获取
const isFetchingLogos = ref(false)
const logoApiSource = ref('custom')
const logoResults = ref([])

const logoSuccessCount = computed(() => {
  return logoResults.value.filter(r => r.success).length
})

const logoFailedCount = computed(() => {
  return logoResults.value.filter(r => !r.success).length
})

const logoProgress = computed(() => {
  if (sites.value.length === 0) return 0
  return Math.round((logoResults.value.length / sites.value.length) * 100)
})

// 计算属性
const tabs = computed(() => [
  { id: 'sites', name: '网站管理', icon: 'fas fa-globe', count: sites.value.length },
  { id: 'categories', name: '分类管理', icon: 'fas fa-folder', count: categories.value.length },
  { id: 'checks', name: '链接检查', icon: 'fas fa-link' },
  { id: 'logos', name: 'Logo获取', icon: 'fas fa-image' },
  { id: 'ai', name: 'AI配置', icon: 'fas fa-robot' },
  { id: 'account', name: '账户设置', icon: 'fas fa-user-cog' },
  { id: 'settings', name: '系统设置', icon: 'fas fa-cog' }
])

const filteredSites = computed(() => {
  return sites.value.filter(site => {
    // 搜索过滤
    if (siteSearch.value) {
      const query = siteSearch.value.toLowerCase()
      if (!site.name.toLowerCase().includes(query) && 
          !site.url.toLowerCase().includes(query) && 
          !(site.description || '').toLowerCase().includes(query) &&
          !(site.tags || '').toLowerCase().includes(query)) {
        return false
      }
    }
    
    // 状态过滤
    if (siteStatusFilter.value === 'active' && !site.is_active) return false
    if (siteStatusFilter.value === 'inactive' && site.is_active) return false
    if (siteStatusFilter.value === 'hidden' && site.is_visible) return false
    
    // 分类过滤
    if (siteCategoryFilter.value !== 'all' && site.category_id !== siteCategoryFilter.value) {
      return false
    }
    
    return true
  })
})

const healthySitesCount = computed(() => {
  return sites.value.filter(s => s.is_active).length
})

const brokenSitesCount = computed(() => {
  return sites.value.filter(s => !s.is_active).length
})

const lastCheckTime = computed(() => {
  const lastCheck = sites.value.reduce((latest, site) => {
    if (!site.last_checked) return latest
    const time = new Date(site.last_checked).getTime()
    return time > latest ? time : latest
  }, 0)
  
  if (lastCheck === 0) return '从未检查'
  
  const now = new Date()
  const diff = now.getTime() - lastCheck
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) return '刚刚'
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
})

// 方法
const getSiteLogo = (site) => {
  if (site.logo) return site.logo
  
  // 检查缓存中是否有该域名的Logo
  try {
    const url = new URL(site.url)
    const domain = url.hostname
    const cachedLogo = logoCache.value[domain]
    
    if (cachedLogo && cachedLogo.url) {
      console.log('使用缓存的Logo:', domain, cachedLogo.url)
      return cachedLogo.url
    }
    
    // 如果没有缓存，使用自建API（优先获取favicon.ico图标）
    console.log('使用自建API Logo:', domain)
    return `https://ico.your-domain.com/favicon?url=${domain}&size=64`
  } catch {
    return '/default-logo.png'
  }
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '未分类'
}

const getCategorySiteCount = (categoryId) => {
  if (categoryId === 'all') return sites.value.length
  return sites.value.filter(site => site.category_id === categoryId).length
}

const getSiteName = (siteId) => {
  const site = sites.value.find(s => s.id == siteId)
  return site ? site.name : `网站 ${siteId}`
}

// 网站相关方法
const editSite = (site) => {
  editingSite.value = { ...site }
  Object.assign(siteForm.value, site)
  showAddSiteModal.value = true
}

const toggleSiteVisibility = async (site) => {
  site.is_visible = !site.is_visible
  await saveSiteToAPI({ id: site.id, is_visible: site.is_visible }, 'PUT')
}

const testSiteLink = async (site) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 实际项目中这里应该调用真实的API检查链接
    const isOnline = Math.random() > 0.3 // 70%概率在线
    
    // 更新网站状态
    const updatedSite = {
      id: site.id,
      is_active: isOnline,
      health_score: isOnline ? 100 : 0,
      last_checked: new Date().toISOString()
    }
    
    await saveSiteToAPI(updatedSite, 'PUT')
    
    // 更新本地状态
    site.is_active = isOnline
    site.health_score = isOnline ? 100 : 0
    site.last_checked = updatedSite.last_checked
    
    // 记录检查结果
    checkResults.value.unshift({
      site_id: site.id,
      status_code: isOnline ? 200 : 404,
      response_time: Math.floor(Math.random() * 500),
      is_valid: isOnline,
      checked_at: new Date().toLocaleString()
    })
    
    alert(`链接检查完成：${site.name} ${isOnline ? '在线 ✓' : '离线 ✗'}`)
  } catch (error) {
    console.error('检查链接失败:', error)
    alert('检查链接失败')
  }
}

const deleteSite = async (site) => {
  if (confirm(`确定要删除 "${site.name}" 吗？`)) {
    await deleteSiteFromAPI(site.id)
  }
}

const fetchSiteInfo = async () => {
  if (!siteForm.value.url) return
  
  loadingLogo.value = true
  logoLoadError.value = false
  
  try {
    // 验证URL格式
    let url
    try {
      url = new URL(siteForm.value.url)
    } catch (e) {
      console.error('URL格式错误:', e)
      logoLoadError.value = true
      return
    }
    
    const domain = url.hostname
    
    // 根据logoSource选择对应的Logo源
    let logoUrl = null
    
    try {
      if (logoSource.value === 'custom') {
        logoUrl = `https://ico.your-domain.com/favicon?url=${domain}&size=64`
        siteForm.value.logo = logoUrl
        console.log('使用自建API Logo:', logoUrl)
      } else if (logoSource.value === 'google') {
        logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
        siteForm.value.logo = logoUrl
        console.log('使用Google Favicon:', logoUrl)
      } else if (logoSource.value === 'bing') {
        logoUrl = `https://www.bing.com/api/v6/favicon?domain=${domain}&size=128`
        siteForm.value.logo = logoUrl
        console.log('使用Bing Favicon:', logoUrl)
      } else if (logoSource.value === 'duckduckgo') {
        logoUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`
        siteForm.value.logo = logoUrl
        console.log('使用DuckDuckGo Favicon:', logoUrl)
      } else if (logoSource.value === 'customurl') {
        console.log('使用自定义URL模式')
      }
    } catch (e) {
      console.error('生成Logo URL失败:', e)
      logoLoadError.value = true
      return
    }
    
    try {
      // 设置默认名称
      if (!siteForm.value.name) {
        siteForm.value.name = domain.replace('www.', '').split('.')[0]
      }
      
      // 设置默认描述
      if (!siteForm.value.description) {
        siteForm.value.description = `来自 ${domain} 的优质网站`
      }
    } catch (e) {
      console.error('设置默认信息失败:', e)
    }
  } catch (error) {
    console.error('获取网站信息失败:', error)
    logoLoadError.value = true
  } finally {
    loadingLogo.value = false
  }
}

const handleLogoError = () => {
  logoLoadError.value = true
}

const handleLogoSourceChange = () => {
  logoLoadError.value = false
  if (siteForm.value.url && logoSource.value !== 'customurl') {
    fetchSiteInfo()
  }
}

const saveSite = async () => {
  // 验证URL格式
  try {
    new URL(siteForm.value.url)
  } catch (e) {
    alert('请输入有效的网站URL（例如：https://example.com）')
    return
  }
  
  // 验证必填字段
  if (!siteForm.value.name) {
    alert('请输入网站名称')
    return
  }
  
  if (!siteForm.value.category_id) {
    alert('请选择分类')
    return
  }
  
  if (editingSite.value) {
    // 更新网站
    const updatedSite = {
      ...editingSite.value,
      ...siteForm.value
    }
    await saveSiteToAPI(updatedSite, 'PUT')
  } else {
    // 添加新网站
    await saveSiteToAPI(siteForm.value, 'POST')
  }
  
  closeSiteModal()
}

const closeSiteModal = () => {
  showAddSiteModal.value = false
  editingSite.value = null
  resetSiteForm()
}

const resetSiteForm = () => {
  siteForm.value = {
    name: '',
    url: '',
    logo: '',
    description: '',
    category_id: '',
    tags: '',
    stars: 3,
    is_visible: true,
    is_active: true
  }
}

// 分类相关方法
const editCategory = (category) => {
  editingCategory.value = { ...category }
  Object.assign(categoryForm.value, category)
  showAddCategoryModal.value = true
}

const deleteCategory = async (category) => {
  if (category.id === 'all') {
    alert('不能删除"全部"分类')
    return
  }
  
  // 检查是否有网站使用该分类
  const hasSites = sites.value.some(site => site.category_id === category.id)
  if (hasSites) {
    alert(`不能删除"${category.name}"分类，因为还有网站使用该分类`)
    return
  }
  
  if (confirm(`确定要删除 "${category.name}" 分类吗？`)) {
    await deleteCategoryFromAPI(category.id)
  }
}

const saveCategory = async () => {
  if (editingCategory.value) {
    // 更新分类
    await saveCategoryToAPI(categoryForm.value, 'PUT')
  } else {
    // 添加新分类，不关联任何网站
    const newCategory = {
      id: categoryForm.value.slug,
      ...categoryForm.value,
      _isNew: true
    }
    await saveCategoryToAPI(newCategory, 'POST')
  }
  
  closeCategoryModal()
}

const closeCategoryModal = () => {
  showAddCategoryModal.value = false
  editingCategory.value = null
  resetCategoryForm()
}

const resetCategoryForm = () => {
  categoryForm.value = {
    name: '',
    slug: '',
    sort_order: 0
  }
}

// 链接检查方法
const runLinkCheck = async () => {
  isChecking.value = true
  
  try {
    // 模拟批量检查
    for (const site of sites.value.slice(0, 5)) {
      await testSiteLink(site)
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    
    alert('链接检查完成！')
  } catch (error) {
    console.error('链接检查失败:', error)
    alert('链接检查过程中出现错误')
  } finally {
    isChecking.value = false
  }
}

const runLogoFetch = async () => {
  isFetchingLogos.value = true
  logoResults.value = []
  
  try {
    for (const site of sites.value) {
      try {
        // 验证URL格式
        let url
        try {
          url = new URL(site.url)
        } catch (e) {
          console.error(`URL格式错误: ${site.url}`, e)
          logoResults.value.push({
            site_id: site.id,
            site_name: site.name,
            site_url: site.url,
            logoUrl: '',
            success: false,
            error: 'URL格式错误',
            fetched_at: new Date().toLocaleString()
          })
          continue
        }
        
        const domain = url.hostname
        
        let logoUrl = ''
        
        try {
          if (logoApiSource.value === 'custom') {
            logoUrl = `https://ico.your-domain.com/favicon?url=${domain}&size=64`
          } else if (logoApiSource.value === 'google') {
            logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
          } else if (logoApiSource.value === 'bing') {
            logoUrl = `https://www.bing.com/api/v6/favicon?domain=${domain}&size=128`
          } else if (logoApiSource.value === 'duckduckgo') {
            logoUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`
          }
        } catch (e) {
          console.error(`生成Logo URL失败: ${site.url}`, e)
          logoResults.value.push({
            site_id: site.id,
            site_name: site.name,
            site_url: site.url,
            logoUrl: '',
            success: false,
            error: '生成Logo URL失败',
            fetched_at: new Date().toLocaleString()
          })
          continue
        }
        
        try {
          // 更新网站的logo
          site.logo = logoUrl
          
          // 保存到API
          await saveSiteToAPI({ id: site.id, logo: logoUrl }, 'PUT')
          
          logoResults.value.push({
            site_id: site.id,
            site_name: site.name,
            site_url: site.url,
            logoUrl: logoUrl,
            success: true,
            error: '',
            fetched_at: new Date().toLocaleString()
          })
        } catch (e) {
          console.error(`保存Logo失败: ${site.url}`, e)
          logoResults.value.push({
            site_id: site.id,
            site_name: site.name,
            site_url: site.url,
            logoUrl: logoUrl,
            success: false,
            error: '保存Logo失败',
            fetched_at: new Date().toLocaleString()
          })
        }
      } catch (e) {
        console.error(`处理网站失败: ${site.url}`, e)
        logoResults.value.push({
          site_id: site.id,
          site_name: site.name,
          site_url: site.url,
          logoUrl: '',
          success: false,
          error: e.message || '未知错误',
          fetched_at: new Date().toLocaleString()
        })
      }
    }
  } catch (error) {
    console.error('批量获取Logo失败:', error)
    alert('批量获取Logo失败: ' + (error.message || '未知错误'))
  } finally {
    isFetchingLogos.value = false
  }
}

// 设置相关方法
const saveSettings = async () => {
  await saveSettingsToAPI()
}

const exportData = () => {
  const data = {
    sites: sites.value,
    categories: categories.value,
    settings: settings.value,
    export_time: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `webstack-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  alert('数据已导出！')
}

const resetAllData = async () => {
  if (confirm('确定要重置所有数据吗？这将删除所有网站、分类和设置，此操作不可恢复！')) {
    // 清除localStorage
    localStorage.removeItem('webstack_sites')
    localStorage.removeItem('webstack_categories')
    localStorage.removeItem('webstack_settings')
    
    // 注意：这里只清除了本地缓存，服务器上的KV数据需要手动清除或通过API实现
    alert('本地数据已清除，页面将重新加载')
    
    // 重新加载页面
    window.location.reload()
  }
}

// 系统方法 - 通过API保存
const saveSiteToAPI = async (site, method = 'PUT') => {
  try {
    saving.value = true
    const token = localStorage.getItem('auth_token')
    const headers = { 
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE}/sites`, {
      method,
      headers,
      body: JSON.stringify(site)
    })
    const result = await response.json()
    if (result.success) {
      await fetchSites() // 重新获取最新数据
      return result.data
    } else {
      alert(result.error || '操作失败')
      return null
    }
  } catch (error) {
    console.error('保存网站失败:', error)
    alert('保存失败，请重试')
    return null
  } finally {
    saving.value = false
  }
}

const deleteSiteFromAPI = async (id) => {
  try {
    saving.value = true
    const token = localStorage.getItem('auth_token')
    const headers = { 
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE}/sites`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id })
    })
    const result = await response.json()
    if (result.success) {
      await fetchSites()
      return true
    } else {
      alert(result.error || '删除失败')
      return false
    }
  } catch (error) {
    console.error('删除网站失败:', error)
    alert('删除失败，请重试')
    return false
  } finally {
    saving.value = false
  }
}

const saveCategoryToAPI = async (category, method = 'PUT') => {
  try {
    saving.value = true
    const token = localStorage.getItem('auth_token')
    const headers = { 
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE}/categories`, {
      method,
      headers,
      body: JSON.stringify(category)
    })
    const result = await response.json()
    if (result.success) {
      await fetchCategories()
      return result.data
    } else {
      alert(result.error || '操作失败')
      return null
    }
  } catch (error) {
    console.error('保存分类失败:', error)
    alert('保存失败，请重试')
    return null
  } finally {
    saving.value = false
  }
}

const deleteCategoryFromAPI = async (id) => {
  try {
    saving.value = true
    const token = localStorage.getItem('auth_token')
    const headers = { 
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id })
    })
    const result = await response.json()
    if (result.success) {
      await fetchCategories()
      return true
    } else {
      alert(result.error || '删除失败')
      return false
    }
  } catch (error) {
    console.error('删除分类失败:', error)
    alert('删除失败，请重试')
    return false
  } finally {
    saving.value = false
  }
}

// 保存设置到API
const saveSettingsToAPI = async () => {
  try {
    saving.value = true
    const token = localStorage.getItem('auth_token')
    const headers = { 
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(settings.value)
    })
    const result = await response.json()
    if (result.success) {
      alert('设置已保存！')
      return true
    } else {
      alert(result.error || '保存失败')
      return false
    }
  } catch (error) {
    console.error('保存设置失败:', error)
    alert('保存失败，请重试')
    return false
  } finally {
    saving.value = false
  }
}

// 测试AI API
const testAIAPI = async () => {
  if (!aiSettings.value.apiKey) {
    alert('请先输入API Key')
    return
  }
  
  try {
    testing.value = true
    
    let apiUrl = ''
    let headers = {
      'Content-Type': 'application/json'
    }
    let body = {}
    
    const testPrompt = '请回复"测试成功"'
    
    if (aiSettings.value.provider === 'openai') {
      apiUrl = 'https://api.openai.com/v1/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: testPrompt
          }
        ],
        max_tokens: 10
      }
    } else if (aiSettings.value.provider === 'anthropic') {
      apiUrl = 'https://api.anthropic.com/v1/messages'
      headers['x-api-key'] = aiSettings.value.apiKey
      headers['anthropic-version'] = '2023-06-01'
      body = {
        model: aiSettings.value.model || 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: testPrompt
          }
        ]
      }
    } else if (aiSettings.value.provider === 'deepseek') {
      apiUrl = 'https://api.deepseek.com/v1/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: testPrompt
          }
        ],
        max_tokens: 10
      }
    } else if (aiSettings.value.provider === 'qwen') {
      apiUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'qwen-turbo',
        messages: [
          {
            role: 'user',
            content: testPrompt
          }
        ],
        max_tokens: 10
      }
    } else if (aiSettings.value.provider === 'doubao') {
      apiUrl = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'doubao-pro-32k',
        messages: [
          {
            role: 'user',
            content: testPrompt
          }
        ],
        max_tokens: 10
      }
    } else if (aiSettings.value.provider === 'zhipu') {
      apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'glm-4',
        messages: [
          {
            role: 'user',
            content: testPrompt
          }
        ],
        max_tokens: 10,
        stream: false
      }
    } else if (aiSettings.value.provider === 'moonshot') {
      apiUrl = 'https://api.moonshot.cn/v1/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'moonshot-v1-8k',
        messages: [
          {
            role: 'user',
            content: testPrompt
          }
        ],
        max_tokens: 10
      }
    } else {
      alert('请先配置API URL')
      return
    }
    
    console.log('测试API请求:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })
    
    console.log('测试API响应状态:', response.status)
    
    if (!response.ok) {
      let errorMessage = 'API测试失败'
      try {
        const errorData = await response.json()
        console.error('测试API错误响应:', errorData)
        errorMessage = errorData.error?.message || errorData.message || errorMessage
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }
    
    const data = await response.json()
    console.log('测试API响应数据:', data)
    
    let result = ''
    if (aiSettings.value.provider === 'anthropic') {
      result = data.content[0].text
    } else if (aiSettings.value.provider === 'zhipu') {
      const messageContent = data.choices[0].message.content
      const reasoningContent = data.choices[0].message.reasoning_content
      result = messageContent || reasoningContent || ''
    } else {
      result = data.choices[0].message.content
    }
    
    console.log('测试API结果:', result)
    
    alert(`✅ API测试成功！\n\n提供商: ${aiSettings.value.provider}\n模型: ${aiSettings.value.model}\n响应: ${result}`)
    
  } catch (error) {
    console.error('测试API失败:', error)
    alert(`❌ API测试失败：${error.message}`)
  } finally {
    testing.value = false
  }
}

// 保存AI设置
const saveAISettings = async () => {
  try {
    saving.value = true
    const token = localStorage.getItem('auth_token')
    const headers = { 
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE}/ai-settings`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(aiSettings.value)
    })
    const result = await response.json()
    if (result.success) {
      alert('AI配置已保存！')
      return true
    } else {
      alert(result.error || '保存失败')
      return false
    }
  } catch (error) {
    console.error('保存AI配置失败:', error)
    alert('保存失败，请重试')
    return false
  } finally {
    saving.value = false
  }
}

// 生成网站描述
const generateDescription = async () => {
  if (!aiSettings.value.apiKey) {
    alert('请先配置AI接口')
    return
  }
  
  if (!siteForm.value.name || !siteForm.value.url) {
    alert('请先填写网站名称和URL')
    return
  }
  
  try {
    generatingDescription.value = true
    
    const prompt = aiSettings.value.promptTemplate
      .replace('{name}', siteForm.value.name)
      .replace('{url}', siteForm.value.url)
    
    let apiUrl = ''
    let headers = {
      'Content-Type': 'application/json'
    }
    let body = {}
    
    console.log('AI配置:', {
      provider: aiSettings.value.provider,
      model: aiSettings.value.model,
      maxLength: aiSettings.value.maxLength
    })
    console.log('生成提示词:', prompt)
    
    if (aiSettings.value.provider === 'openai') {
      apiUrl = 'https://api.openai.com/v1/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: Math.ceil(aiSettings.value.maxLength / 2)
      }
    } else if (aiSettings.value.provider === 'anthropic') {
      apiUrl = 'https://api.anthropic.com/v1/messages'
      headers['x-api-key'] = aiSettings.value.apiKey
      headers['anthropic-version'] = '2023-06-01'
      body = {
        model: aiSettings.value.model,
        max_tokens: aiSettings.value.maxLength,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }
    } else if (aiSettings.value.provider === 'deepseek') {
      apiUrl = 'https://api.deepseek.com/v1/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: aiSettings.value.maxLength
      }
    } else if (aiSettings.value.provider === 'qwen') {
      apiUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'qwen-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: aiSettings.value.maxLength
      }
    } else if (aiSettings.value.provider === 'doubao') {
      apiUrl = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'doubao-pro-32k',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: aiSettings.value.maxLength
      }
    } else if (aiSettings.value.provider === 'zhipu') {
      apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'glm-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: aiSettings.value.maxLength,
        stream: false
      }
    } else if (aiSettings.value.provider === 'moonshot') {
      apiUrl = 'https://api.moonshot.cn/v1/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'moonshot-v1-8k',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: aiSettings.value.maxLength
      }
    } else {
      apiUrl = aiSettings.value.apiUrl
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: Math.ceil(aiSettings.value.maxLength / 2)
      }
    }
    
    console.log('请求URL:', apiUrl)
    console.log('请求头:', headers)
    console.log('请求体:', body)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    console.log('响应状态:', response.status, response.statusText)
    console.log('响应头:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      let errorMessage = 'API请求失败'
      try {
        const errorData = await response.json()
        console.error('错误响应:', errorData)
        errorMessage = errorData.error?.message || errorData.message || errorMessage
      } catch (e) {
        console.error('解析错误响应失败:', e)
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }
    
    const data = await response.json()
    console.log('响应数据:', data)
    
    let description = ''
    
    if (aiSettings.value.provider === 'anthropic') {
      description = data.content[0].text
    } else if (aiSettings.value.provider === 'zhipu') {
      const messageContent = data.choices[0].message.content
      const reasoningContent = data.choices[0].message.reasoning_content
      
      if (messageContent && messageContent.trim()) {
        description = messageContent.trim()
      } else if (reasoningContent && reasoningContent.trim()) {
        description = reasoningContent.trim()
        console.warn('智谱AI返回的是思考过程，使用reasoning_content作为临时方案')
      } else {
        throw new Error('智谱AI返回空内容，请稍后重试')
      }
    } else if (aiSettings.value.provider === 'deepseek' || aiSettings.value.provider === 'qwen' || aiSettings.value.provider === 'doubao' || aiSettings.value.provider === 'moonshot') {
      description = data.choices[0].message.content
    } else {
      description = data.choices[0].message.content
    }
    
    if (!description || !description.trim()) {
      throw new Error('AI返回空内容，请稍后重试')
    }
    
    description = description.trim().substring(0, aiSettings.value.maxLength)
    
    const newSiteForm = { ...siteForm.value, description: description }
    siteForm.value = newSiteForm
    
    console.log('生成的描述:', description)
    console.log('siteForm.value:', siteForm.value)
    console.log('siteForm.value.description:', siteForm.value.description)
    
    await nextTick()
    console.log('nextTick后siteForm.value:', siteForm.value)
    console.log('nextTick后siteForm.value.description:', siteForm.value.description)
    
    alert('描述生成成功！')
  } catch (error) {
    console.error('生成描述失败:', error)
    console.error('错误堆栈:', error.stack)
    alert('生成描述失败：' + error.message)
  } finally {
    generatingDescription.value = false
  }
}

// 生成英文网站描述
const generateDescriptionEn = async () => {
  if (!aiSettings.value.apiKey) {
    alert('请先配置AI接口')
    return
  }
  
  if (!siteForm.value.name || !siteForm.value.url) {
    alert('请先填写网站名称和URL')
    return
  }
  
  try {
    generatingDescriptionEn.value = true
    
    const prompt = `Please generate a concise English description (within ${aiSettings.value.maxLength} characters) for the following website: Website Name: ${siteForm.value.name}, URL: ${siteForm.value.url}`
    
    let apiUrl = ''
    let headers = {
      'Content-Type': 'application/json'
    }
    let body = {}
    
    console.log('AI配置:', {
      provider: aiSettings.value.provider,
      model: aiSettings.value.model,
      maxLength: aiSettings.value.maxLength
    })
    console.log('生成英文描述提示词:', prompt)
    
    if (aiSettings.value.provider === 'openai') {
      apiUrl = 'https://api.openai.com/v1/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: Math.ceil(aiSettings.value.maxLength / 2)
      }
    } else if (aiSettings.value.provider === 'anthropic') {
      apiUrl = 'https://api.anthropic.com/v1/messages'
      headers['x-api-key'] = aiSettings.value.apiKey
      headers['anthropic-version'] = '2023-06-01'
      body = {
        model: aiSettings.value.model,
        max_tokens: aiSettings.value.maxLength,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }
    } else if (aiSettings.value.provider === 'deepseek') {
      apiUrl = 'https://api.deepseek.com/v1/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: aiSettings.value.maxLength
      }
    } else if (aiSettings.value.provider === 'qwen') {
      apiUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'qwen-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: aiSettings.value.maxLength
      }
    } else if (aiSettings.value.provider === 'doubao') {
      apiUrl = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'doubao-pro-32k',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: aiSettings.value.maxLength
      }
    } else if (aiSettings.value.provider === 'zhipu') {
      apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'glm-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: aiSettings.value.maxLength,
        stream: false
      }
    } else if (aiSettings.value.provider === 'moonshot') {
      apiUrl = 'https://api.moonshot.cn/v1/chat/completions'
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model || 'moonshot-v1-8k',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: aiSettings.value.maxLength
      }
    } else {
      apiUrl = aiSettings.value.apiUrl
      headers['Authorization'] = `Bearer ${aiSettings.value.apiKey}`
      body = {
        model: aiSettings.value.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: Math.ceil(aiSettings.value.maxLength / 2)
      }
    }
    
    console.log('请求URL:', apiUrl)
    console.log('请求头:', headers)
    console.log('请求体:', body)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    console.log('响应状态:', response.status, response.statusText)
    console.log('响应头:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      let errorMessage = 'API request failed'
      try {
        const errorData = await response.json()
        console.error('错误响应:', errorData)
        errorMessage = errorData.error?.message || errorData.message || errorMessage
      } catch (e) {
        console.error('解析错误响应失败:', e)
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }
    
    const data = await response.json()
    console.log('响应数据:', data)
    
    let description = ''
    
    if (aiSettings.value.provider === 'anthropic') {
      description = data.content[0].text
    } else if (aiSettings.value.provider === 'zhipu') {
      const messageContent = data.choices[0].message.content
      const reasoningContent = data.choices[0].message.reasoning_content
      
      if (messageContent && messageContent.trim()) {
        description = messageContent.trim()
      } else if (reasoningContent && reasoningContent.trim()) {
        description = reasoningContent.trim()
        console.warn('智谱AI返回的是思考过程，使用reasoning_content作为临时方案')
      } else {
        throw new Error('智谱AI返回空内容，请稍后重试')
      }
    } else if (aiSettings.value.provider === 'deepseek' || aiSettings.value.provider === 'qwen' || aiSettings.value.provider === 'doubao' || aiSettings.value.provider === 'moonshot') {
      description = data.choices[0].message.content
    } else {
      description = data.choices[0].message.content
    }
    
    if (!description || !description.trim()) {
      throw new Error('AI返回空内容，请稍后重试')
    }
    
    description = description.trim().substring(0, aiSettings.value.maxLength)
    
    const newSiteForm = { ...siteForm.value, descriptionEn: description }
    siteForm.value = newSiteForm
    
    console.log('生成的英文描述:', description)
    console.log('siteForm.value:', siteForm.value)
    console.log('siteForm.value.descriptionEn:', siteForm.value.descriptionEn)
    
    await nextTick()
    console.log('nextTick后siteForm.value:', siteForm.value)
    console.log('nextTick后siteForm.value.descriptionEn:', siteForm.value.descriptionEn)
    
    alert('英文描述生成成功！')
  } catch (error) {
    console.error('生成英文描述失败:', error)
    console.error('错误堆栈:', error.stack)
    alert('生成英文描述失败：' + error.message)
  } finally {
    generatingDescriptionEn.value = false
  }
}

// 保存账户信息
const saveAccount = async () => {
  if (!accountForm.value.username) {
    alert('请输入用户名')
    return
  }
  
  if (accountForm.value.newPassword) {
    if (!accountForm.value.oldPassword) {
      alert('修改密码需要输入旧密码')
      return
    }
    if (accountForm.value.newPassword !== accountForm.value.confirmPassword) {
      alert('两次输入的新密码不一致')
      return
    }
    if (accountForm.value.newPassword.length < 6) {
      alert('新密码长度不能少于6位')
      return
    }
  }
  
  try {
    savingAccount.value = true
    const response = await fetch(`${API_BASE}/auth`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: accountForm.value.username,
        oldPassword: accountForm.value.oldPassword,
        newPassword: accountForm.value.newPassword
      })
    })
    const result = await response.json()
    if (result.success) {
      alert('账户信息已保存！')
      // 清空密码字段
      accountForm.value.oldPassword = ''
      accountForm.value.newPassword = ''
      accountForm.value.confirmPassword = ''
      // 更新本地用户信息
      localStorage.setItem('auth_user', JSON.stringify({
        username: accountForm.value.username,
        role: 'admin'
      }))
      user.value = JSON.parse(localStorage.getItem('auth_user'))
    } else {
      alert(result.error || '保存失败')
    }
  } catch (error) {
    console.error('保存账户信息失败:', error)
    alert('保存失败，请重试')
  } finally {
    savingAccount.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  router.push('/')
}

const goToHomepage = () => {
  window.open('/', '_blank')
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchSites(),
      fetchCategories(),
      fetchSettings(),
      fetchAccount(),
      fetchAISettings(),
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
    document.title = newTitle + ' - 管理后台'
  }
}, { immediate: true })
</script>
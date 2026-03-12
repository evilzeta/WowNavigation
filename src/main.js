import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// 创建应用
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)

// 挂载
app.mount('#app')
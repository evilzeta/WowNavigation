import { defineStore } from 'pinia'
import { ref } from 'vue'

const translations = {
  zh: {
    site: {
      title: 'WebStack导航',
      subtitle: '发现优质网站资源'
    },
    nav: {
      home: '首页',
      categories: '分类',
      admin: '管理',
      adminPanel: '管理面板',
      login: '登录',
      logout: '退出'
    },
    search: {
      placeholder: '搜索网站...',
      button: '搜索'
    },
    theme: {
      light: '浅色模式',
      dark: '深色模式'
    },
    detail: {
      visit: '访问网站',
      broken: '链接失效',
      stars: '推荐指数',
      visits: '访问次数',
      description: '网站描述',
      relatedSites: '相关网站',
      editInfo: '编辑信息',
      loading: '加载中...',
      paramError: '参数错误',
      missingId: '缺少网站ID参数',
      notFound: '未找到网站',
      notFoundDesc: '该网站不存在或已被删除',
      uncategorized: '未分类',
      unknown: '未知'
    },
    disclaimer: {
      line1: '本站仅提供网站导航服务，不存储任何内容',
      line2: '访问外部网站请注意网络安全，谨防诈骗',
      line3: '因访问第三方网站所产生的一切后果，由用户自行承担'
    },
    footer: {
      copyright: '©{{year}} 磁力搜索、BT种子下载、发现收集优质网站资源®'
    },
    login: {
      title: '管理员登录',
      subtitle: '管理员登录',
      username: '用户名',
      password: '密码',
      usernamePlaceholder: '请输入用户名',
      passwordPlaceholder: '请输入密码',
      remember: '记住登录状态',
      loggingIn: '登录中...',
      loginButton: '登录',
      error: {
        empty: '请输入用户名和密码',
        invalid: '用户名或密码错误',
        failed: '登录失败，请稍后重试'
      },
      backToHome: '返回主页'
    },
    about: {
      aboutUs: '关于我们',
      favorites: '收藏本站',
      contactUs: '联系我们',
      siteStats: '网站统计',
      totalVisitors: '累计访问人数',
      pageViews: '页面浏览量',
      runningDays: '网站运行时间',
      visitorDesc: '独立IP访问计数，实时统计',
      pvDesc: 'PV页面浏览量统计',
      runningDesc: '自 2026年1月1日起',
      subtitle: '了解我们的网站和使命',
      intro: '网站介绍',
      introText: '是一个现代化的导航网站，致力于为用户提供优质的网站资源导航服务。我们精心收集和整理各类实用网站，帮助用户快速找到所需的工具和资源。',
      mission: '我们的使命',
      mission1: '提供高质量、分类清晰的网站导航服务',
      mission2: '持续更新和优化网站资源',
      mission3: '为用户提供便捷的访问体验',
      mission4: '支持深色模式和国际化',
      disclaimer: '互联网免责声明',
      disclaimerIntro: '本网站作为导航服务平台，特此声明如下：',
      disclaimerAccuracy: '内容准确性：我们努力确保网站信息的准确性，但不保证所有信息都是最新、完整或无误的。对于因使用本网站信息而导致的任何损失，我们不承担责任。',
      disclaimerCopyright: '版权声明：本网站收录的网站资源版权归原作者所有。如涉及版权问题，请联系我们，我们将及时处理。',
      disclaimerSecurity: '安全提示：请勿在本网站发布违法违规、色情、暴力等不良信息。我们保留删除违规内容的权利。',
      disclaimerUpdate: '本免责声明可能会根据法律法规和业务发展进行更新，请定期查看最新版本。'
    },
    contact: {
      title: '联系我们',
      subtitle: '如有任何问题或建议，欢迎与我们联系',
      emailContact: '邮箱联系',
      emailDesc: '您可以通过以下邮箱地址与我们取得联系：',
      emailClick: '点击邮箱地址可直接发送邮件',
      contactNote: '联系说明',
      note1: '我们非常重视您的反馈和建议，无论是关于网站功能、内容改进，还是其他任何问题，我们都将认真对待并及时回复。',
      note2: '通常情况下，我们会在收到邮件后的24小时内回复您。如果遇到特殊情况，回复时间可能会有所延长，敬请谅解。',
      note3: '感谢您对我们网站的关注和支持！'
    },
    category: {
      magnetResources: '磁力资源',
      cloudStorage: '常用网盘',
      aiSites: 'AI类站',
      itSites: 'IT类站',
      toolSites: '工具类站',
      anime: '动漫卡通',
      videoSites: '影视网站',
      musicSites: '音乐网站',
      otherResources: '其它资源',
      design: '设计',
      development: '开发',
      tools: '工具',
      ai: 'AI',
      news: '新闻',
      shopping: '购物',
      learning: '学习',
      entertainment: '娱乐',
      social: '社交'
    }
  },
  en: {
    site: {
      title: 'WebStack Navigation',
      subtitle: 'Discover Quality Web Resources'
    },
    nav: {
      home: 'Home',
      categories: 'Categories',
      admin: 'Admin',
      adminPanel: 'Admin Panel',
      login: 'Login',
      logout: 'Logout'
    },
    search: {
      placeholder: 'Search websites...',
      button: 'Search'
    },
    theme: {
      light: 'Light Mode',
      dark: 'Dark Mode'
    },
    detail: {
      visit: 'Visit Site',
      broken: 'Broken Link',
      stars: 'Rating',
      visits: 'Visits',
      description: 'Description',
      relatedSites: 'Related Sites',
      editInfo: 'Edit Info',
      loading: 'Loading...',
      paramError: 'Parameter Error',
      missingId: 'Missing Site ID',
      notFound: 'Site Not Found',
      notFoundDesc: 'This site does not exist or has been deleted',
      uncategorized: 'Uncategorized',
      unknown: 'Unknown'
    },
    disclaimer: {
      line1: 'This site only provides navigation services and does not store any content',
      line2: 'Please be cautious when visiting external websites and beware of scams',
      line3: 'Users are responsible for any consequences of visiting third-party websites'
    },
    footer: {
      copyright: '©{{year}} Magnet Search, BT Download, Discover Quality Web Resources®'
    },
    about: {
      aboutUs: 'About Us',
      favorites: 'Add to Favorites',
      contactUs: 'Contact Us',
      siteStats: 'Site Statistics',
      totalVisitors: 'Total Visitors',
      pageViews: 'Page Views',
      runningDays: 'Running Days',
      visitorDesc: 'Unique IP visits, real-time statistics',
      pvDesc: 'PV page view statistics',
      runningDesc: 'Since January 1, 2026',
      subtitle: 'Learn about our website and mission',
      intro: 'Website Introduction',
      introText: 'is a modern navigation website dedicated to providing users with high-quality web resource navigation services. We carefully collect and organize various practical websites to help users quickly find the tools and resources they need.',
      mission: 'Our Mission',
      mission1: 'Provide high-quality, clearly categorized website navigation services',
      mission2: 'Continuously update and optimize website resources',
      mission3: 'Provide users with convenient access experience',
      mission4: 'Support dark mode and internationalization',
      disclaimer: 'Internet Disclaimer',
      disclaimerIntro: 'As a navigation service platform, this website hereby declares the following:',
      disclaimerAccuracy: 'Content Accuracy: We strive to ensure the accuracy of website information, but do not guarantee that all information is up-to-date, complete, or error-free. We are not responsible for any losses caused by using the information on this website.',
      disclaimerCopyright: 'Copyright Notice: The web resources included in this website are owned by their respective copyright holders. If there are any copyright issues, please contact us and we will handle them promptly.',
      disclaimerSecurity: 'Security Notice: Do not publish illegal, pornographic, violent, or other inappropriate information on this website. We reserve the right to delete violating content.',
      disclaimerUpdate: 'This disclaimer may be updated according to laws and business development, please check the latest version regularly.'
    },
    login: {
      title: 'Admin Login',
      subtitle: 'Admin Login',
      username: 'Username',
      password: 'Password',
      usernamePlaceholder: 'Please enter username',
      passwordPlaceholder: 'Please enter password',
      remember: 'Remember me',
      loggingIn: 'Logging in...',
      loginButton: 'Login',
      error: {
        empty: 'Please enter username and password',
        invalid: 'Invalid username or password',
        failed: 'Login failed, please try again later'
      },
      backToHome: 'Back to Home'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'If you have any questions or suggestions, please feel free to contact us',
      emailContact: 'Email Contact',
      emailDesc: 'You can contact us via the following email address:',
      emailClick: 'Click the email address to send an email directly',
      contactNote: 'Contact Information',
      note1: 'We highly value your feedback and suggestions. Whether it is about website features, content improvements, or any other issues, we will take them seriously and respond promptly.',
      note2: 'Under normal circumstances, we will reply to you within 24 hours of receiving your email. If there are special circumstances, the response time may be extended, please understand.',
      note3: 'Thank you for your attention and support to our website!'
    },
    category: {
      magnetResources: 'Magnet Resources',
      cloudStorage: 'Cloud Storage',
      aiSites: 'AI Sites',
      itSites: 'IT Sites',
      toolSites: 'Tool Sites',
      anime: 'Anime',
      videoSites: 'Video Sites',
      musicSites: 'Music Sites',
      otherResources: 'Other Resources',
      design: 'Design',
      development: 'Development',
      tools: 'Tools',
      ai: 'AI',
      news: 'News',
      shopping: 'Shopping',
      learning: 'Learning',
      entertainment: 'Entertainment',
      social: 'Social'
    }
  }
}

export const useLangStore = defineStore('lang', () => {
  const lang = ref(localStorage.getItem('language') || 'zh')
  
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[lang.value]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }
  
  const toggleLang = () => {
    lang.value = lang.value === 'zh' ? 'en' : 'zh'
    localStorage.setItem('language', lang.value)
  }
  
  return { lang, t, toggleLang }
})
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import "vue/jsx";
// 支持SVG
import "virtual:svg-icons-register";
// 导入全局scss主文件
import "@/styles/index.scss";
const app = createApp(App)

app.use(createPinia())

app.mount('#app')

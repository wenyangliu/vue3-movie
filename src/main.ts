import {createApp} from 'vue'
import 'element-plus/lib/theme-chalk/index.css'
import App from './App.vue'
import './index.css'
import router from './router'

createApp(App)
// .component(ElAutocomplete.name, ElAutocomplete)
// .component(ElPagination.name, ElPagination)
.use(router)
.mount('#app')

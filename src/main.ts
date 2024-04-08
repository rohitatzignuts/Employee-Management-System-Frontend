/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'    
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './axios.ts'
import VueSweetalert2 from 'vue-sweetalert2';   
import 'sweetalert2/dist/sweetalert2.min.css';
loadFonts()

const options = {
    confirmButtonColor: '#7367F0',
    cancelButtonColor: '#D0D4F1SD',
};
// Create vue app
const app = createApp(App)

// Use plugins
app.use(VueSweetalert2,options)
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)

// Mount vue app
app.mount('#app')

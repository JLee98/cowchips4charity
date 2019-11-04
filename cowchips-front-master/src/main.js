import store from './store'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify/lib'
import Vue from 'vue'
import Vuex from 'vuex'
import VueTheMask from 'vue-the-mask'
import localStorage from '@/helpers/localStorage'
import axios from 'axios'
import ToggleButton from 'vue-js-toggle-button'
import VueLocalStorage from 'vue-localstorage'
import { authTokenName } from '@/config/auth'

axios.defaults.baseURL = process.env.VUE_APP_BACKEND_URL
axios.defaults.headers['Authorization'] = localStorage.getCookie(authTokenName)

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueTheMask)
Vue.use(ToggleButton)
Vue.use(VueLocalStorage)

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.isUserLoggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

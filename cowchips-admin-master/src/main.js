// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './polyfill'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router/index'
import localStorage from './helpers/localStorage'
import { authTokenName } from '@/config/auth'
import axios from 'axios'
import VueTheMask from 'vue-the-mask'
import datePicker from 'vue-bootstrap-datetimepicker'
import 'bootstrap/dist/css/bootstrap.css'
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css'
import Vuelidate from 'vuelidate'
import JsonExcel from 'vue-json-excel'

Vue.use(BootstrapVue)
Vue.use(VueTheMask)
Vue.use(datePicker)
Vue.use(Vuelidate)

axios.defaults.baseURL = process.env.VUE_APP_BACKEND_URL
axios.defaults.headers['Authorization'] = localStorage.getCookie(authTokenName)

Vue.component('downloadExcel', JsonExcel)

router.beforeEach((to, from, next) => {
  if (to.fullPath !== '/login') {
    // this route requires auth, check if logged in
    const jwt = localStorage.getCookie(authTokenName)
    if (!jwt) {
      next({
        path: '/login',
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})

import { mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import * as chai from 'chai'
import Vuex from 'vuex'
import Vue from 'vue'
import Login from '@/views/Login'
import axios from 'axios'
import localStorage from '@/helpers/localStorage'
import flushPromises from "flush-promises"
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(VueRouter)

Vue.config.silent = true

Vue.use(Vuex)
Vue.use(Vuetify)

const jestExpect = global.expect
const expect = chai.expect

describe('Login screen', () => {

  let store
  
  beforeEach(() => {
    axios.post = jest.fn()
    localStorage.setCookie = jest.fn()
  })
  
  it('Login shows the login form', () => {
    const wrapper = mount(Login, {
      store
    })
    expect(wrapper.text()).to.include('Login')
    expect(wrapper.find('#email').exists()).to.eql(true)
    expect(wrapper.find('#password').exists()).to.eql(true)
  })
  
  it('Submit calls the submit method', () => {

    Login.methods.submit = jest.fn()
    const wrapper = mount(Login)
    
    const loginInfo = {
      email: 'a@b.com',
      password: 'password',
    }
    wrapper.setData([{email: loginInfo.email}, {password: loginInfo.password}])
    
    const submitButton = wrapper.find('#submit')

    submitButton.trigger('click')
    jestExpect(Login.methods.submit).toHaveBeenCalled()

  })

  it('set the cookie and route on successful login', ()  => {
    const mockRes = {
      data: {
       token: 'blah'
      }
    }

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const routes = [
      {
        path: '/home',
        component: Login
      }
    ]
    const router = new VueRouter({
      routes
    })

    router.push = jest.fn()

    const wrapper = mount(Login, { localVue, router })


    axios.post.mockResolvedValue(mockRes)



    const loginInfo = {
      email: 'a@b.com',
      password: 'password',
    }

    const cookieInfo = {
      authTokenName: 'authToken',
      value: mockRes.data.token,

    }
    wrapper.setData(loginInfo)

    const submitButton = wrapper.find('#submit')
    submitButton.trigger('click')
    setTimeout(async () => {
      jestExpect(axios.post).toHaveBeenCalledWith('/login', loginInfo)
      await flushPromises()
      jestExpect(localStorage.setCookie).toHaveBeenCalledWith(cookieInfo.authTokenName,cookieInfo.value)
      // expect(wrapper.vm.$route).to.be.an('object')
      jestExpect(router.push).toHaveBeenCalledWith('/home')

    },100)

  })

})

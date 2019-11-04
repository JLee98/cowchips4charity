import { mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import * as chai from 'chai'
import Vuex from 'vuex'
import Vue from 'vue'
import Register from '@/views/Register'
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

describe('Register', () => {

  beforeEach(() => {
    axios.post = jest.fn()
    localStorage.setCookie = jest.fn()
  })

  it('Register shows the Register form', () => {
    const wrapper = mount(Register)
    expect(wrapper.text()).to.include('Register')
    expect(wrapper.find('#email').exists()).to.eql(true)
    expect(wrapper.find('#password').exists()).to.eql(true)
    expect(wrapper.find('#name').exists()).to.eql(false)
    expect(wrapper.find('#phone').exists()).to.eql(true)
  })

  it('Register calls the Register method', () => {

    Register.methods.register = jest.fn()
    const wrapper = mount(Register)

    const registerInfo = {
      email: 'a@b.com',
      password: 'password',
      name: 'dlev',
      phone:'651-353-4788',
    }
    wrapper.setData([{email: registerInfo.email}, {password: registerInfo.password},{name: registerInfo.name},{phone: registerInfo.phone}])

    const registerButton = wrapper.find('#Register')

    registerButton.trigger('click')
    jestExpect(Register.methods.register).toHaveBeenCalled()

  })

  it('set the cookie and route on successful Register', ()  => {
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
        component: Register
      }
    ]
    const router = new VueRouter({
      routes
    })

    router.push = jest.fn()

    const wrapper = mount(Register, { localVue, router })


    axios.post.mockResolvedValue(mockRes)



    const registerInfo = {
      email: 'a@b.com',
      password: 'password',
      name: 'dlev',
      phone:'651-353-4788',
    }

    const cookieInfo = {
      authTokenName: 'authToken',
      value: mockRes.data.token,

    }
    wrapper.setData(registerInfo)

    const registerButton = wrapper.find('#Register')
    registerButton.trigger('click')
    setTimeout(async () => {
      jestExpect(axios.post).toHaveBeenCalledWith('/register', registerInfo)
      await flushPromises()
      jestExpect(localStorage.setCookie).toHaveBeenCalledWith(cookieInfo.authTokenName,cookieInfo.value)
      // expect(wrapper.vm.$route).to.be.an('object')
      jestExpect(router.push).toHaveBeenCalledWith('/home')

    },100)

    // wrapper.vm.$nextTick(() => {
    //
    // })


  })

})
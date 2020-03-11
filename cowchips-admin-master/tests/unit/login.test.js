import {mount} from "@vue/test-utils"
import Login from '@/views/pages/Login'
import * as chai from 'chai'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
const chance = require('chance').Chance();
import axios from 'axios'
import localStorage from '@/helpers/localStorage'
import { authTokenName } from '@/config/auth'
import flushPromises from 'flush-promises'

Vue.use(BootstrapVue)

const $router = {
  push: jest.fn()
}

describe('login', function () {
  
  const $v = {
    $invalid: false,
    email: {
      $error: false,
      required: true
    },
    password: {
      $error: false,
      required: true
    }
  }
  
  beforeEach(() => {
    localStorage.setCookie = jest.fn()
    axios.post = jest.fn()
    $router.push = jest.fn()
  })
  
  beforeAll(() => {
    axios.get = jest.fn()
    axios.get.mockResolvedValue('anything')
  })
  
  it('login renders correctly', () => {
    const wrapper = mount(Login, {
      mocks: {
        $v
      }
    })
    chai.expect(wrapper.text()).to.include('Login')
  })
  
  it('submit calls the backend', async () => {
    const wrapper = mount(Login, {
      mocks: {
        $router,
        $v
      }
    })
    const mockData = {
      email: chance.email(),
      password: chance.string()
    }
    wrapper.setData(mockData)
    
    const mockToken = chance.string()
    axios.post.mockResolvedValue({
      data: {
        token: mockToken
      }
    })
    
    const submitButton = wrapper.find('#submit')
    expect(submitButton.html().includes('disable')).toBe(false)
    submitButton.trigger('click')
  
    expect(axios.post).toHaveBeenCalledWith('/admin/login', mockData)
    
    await flushPromises()
    expect(localStorage.setCookie).toHaveBeenCalledWith(authTokenName, mockToken)
    expect($router.push).toHaveBeenCalledWith('/dashboard')
  })
  
  it('Login Failed shows error', async () => {
    const wrapper = mount(Login, {
      mocks: {
        $v
      }
    })
    const mockData = {
      email: chance.email(),
      password: chance.string()
    }
    wrapper.setData(mockData)
    
    const errMsg = chance.string()
    axios.post.mockRejectedValue({
      response: {
        data: {
          error: errMsg
        }
      }
    })
  
    expect(wrapper.text().includes(errMsg)).toBe(false)
    
    const submitButton = wrapper.find('#submit')
    submitButton.trigger('click')
    
    expect(axios.post).toHaveBeenCalledWith('/admin/login', mockData)
    
    await flushPromises()
    
    expect(wrapper.text().includes(errMsg)).toBe(true)
  })
  
  it('Login Failed shows default error message', async () => {
    const wrapper = mount(Login, {
      mocks: {
        $v
      }
    })
    const mockData = {
      email: chance.email(),
      password: chance.string()
    }
    wrapper.setData(mockData)
    
    const errMsg = "Login Failed"
    axios.post.mockRejectedValue({})
    
    expect(wrapper.text().includes(errMsg)).toBe(false)
    
    const submitButton = wrapper.find('#submit')
    submitButton.trigger('click')
    
    expect(axios.post).toHaveBeenCalledWith('/admin/login', mockData)
    
    await flushPromises()
    
    expect(wrapper.text().includes(errMsg)).toBe(true)
  })
  
  it('Empty login form login button is disabled', () => {
    const $v = {
      $invalid: true,
      email: {
        $model: '',
        $error: true,
        required: false
      },
      password: {
        $model: '',
        $error: true,
        required: false
      }
    }
    const wrapper = mount(Login, {
      mocks: {
        $v
      }
    })
  
    const submitButton = wrapper.find('#submit')
    submitButton.trigger('click')
    expect(axios.post).toHaveBeenCalledTimes(0)
  })
  
});

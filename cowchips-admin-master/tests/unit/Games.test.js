import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Games from '@/views/games/Games'
import axios from 'axios'

Vue.use(BootstrapVue)
Vue.config.silent = true

describe('Games', () => {
  
  describe('instance', () => {
    
    beforeEach(() => {
      axios.get = jest.fn()
      axios.put = jest.fn()
      axios.post = jest.fn()
      axios.delete = jest.fn()
      axios.get.mockResolvedValue({
        data: []
      })
    })
    
    it('is Games Component', () => {
      const wrapper = shallowMount(Games)
      expect(wrapper.is(Games)).toBe(true)
    })
    
  })
  
})

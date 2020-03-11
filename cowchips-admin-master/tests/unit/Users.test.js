import Vue from 'vue'
import { shallowMount, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Users from '@/views/users/Users'
import axios from 'axios'
import flushPromises from 'flush-promises'
const chance = require('chance').Chance()

Vue.use(BootstrapVue)
Vue.config.silent = true

describe('Users CRUD Table', () => {

  const $v = {
    createRecord: {},
    updateRecord: {}
  }

  beforeEach(() => {
    axios.get = jest.fn()
    axios.put = jest.fn()
    axios.post = jest.fn()
    axios.delete = jest.fn()

    axios.get.mockResolvedValueOnce({
      data: []
    })
  })

  describe('instance', () => {

    it('is Users', () => {
      const wrapper = shallowMount(Users, {
        mocks: {
          $v
        }
      })
      expect(wrapper.is(Users)).toBe(true)
    })
  })

  describe('Functionality', () => {

    let consoleError
    beforeAll(() => {
      consoleError = console.error
    })
    afterEach(() => {
      console.error = consoleError
    })

    it('Table has the correct column headers', async () => {
      axios.get = jest.fn()
      const userRecord = {
        _id: chance.guid(),
        name: chance.name(),
        phone: chance.integer({min: 111111111, max: 9999999999}),
        email: chance.string()
      }

      axios.get.mockResolvedValueOnce({
        data: [userRecord]
      })
      axios.get.mockResolvedValueOnce({
        data: userRecord
      })
      axios.get.mockResolvedValue({
        data: [userRecord]
      })

      axios.put.mockResolvedValue({})

      const $v = {
        createRecord: {},
        updateRecord: {
          $invalid: false
        }
      }

      const url = chance.string()
      const wrapper = mount(Users, {
        mocks: {
          $v
        },
        propsData: {
          fields: [
            {key: 'Name'},
            {key: 'Email'},
            {key: 'Phone'},
            {key: 'Actions'}
          ],
          url: url,
        }
      })

      await flushPromises()
      expect(wrapper.find('.table-striped').html()).toContain('Name')
      expect(wrapper.find('.table-striped').html()).toContain('Email')
      expect(wrapper.find('.table-striped').html()).toContain('Phone')
      expect(wrapper.find('.table-striped').html()).toContain('Actions')
    })
  })

})

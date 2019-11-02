import Vue from 'vue'
import { shallowMount, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Donations from '@/views/donations/Donations'
import axios from 'axios'
import flushPromises from 'flush-promises'
const chance = require('chance').Chance()

Vue.use(BootstrapVue)
Vue.config.silent = true

describe('Donations CRUD Table', () => {

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

    it('is Donations', () => {
      const wrapper = shallowMount(Donations, {
        mocks: {
          $v
        }
      })
      expect(wrapper.is(Donations)).toBe(true)
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
      const donationRecord = {
        _id: chance.guid(),
        name: chance.name(),
        amount: chance.integer(),
        date: chance.date(),
      }

      axios.get.mockResolvedValueOnce({
        data: [donationRecord]
      })
      axios.get.mockResolvedValueOnce({
        data: donationRecord
      })
      axios.get.mockResolvedValue({
        data: [donationRecord]
      })

      axios.put.mockResolvedValue({})

      const $v = {
        createRecord: {},
        updateRecord: {
          $invalid: false
        }
      }

      const url = chance.string()
      const wrapper = mount(Donations, {
        mocks: {
          $v
        },
        propsData: {
          fields: [
            {
              key: 'userID.name',
              label: "Name"
            },
            {
              key: 'userID._id',
              sortable: true,
              label: "User ID"
            },
            {
              key: 'amount',
              label: "Amount ($)",
              formatter: value => {
                return value / 100;
              }
            },
            {
              key: 'tiles',
              label: 'Selected Tiles',
              formatter: tilesArray => {
                return tilesArray.toString()
              }
            },
            {
              key: 'date',
              sortable: true,
              formatter: date => {
                let dateObject = new Date(Date.parse(date));
                return dateObject.toLocaleString();
              }
            },
          ],
          url: url,
        }
      })

      await flushPromises()
      expect(wrapper.find('.table-striped').html()).toContain('Name')
      expect(wrapper.find('.table-striped').html()).toContain('User ID')
      expect(wrapper.find('.table-striped').html()).toContain('Amount ($)')
      expect(wrapper.find('.table-striped').html()).toContain('Selected Tiles')
      expect(wrapper.find('.table-striped').html()).toContain('Date')
    })

    it('Page does not have the edit, delete, or add buttons', async () => {
      axios.get = jest.fn()
      const donationRecord = {
        _id: chance.guid(),
        name: chance.name(),
        amount: chance.integer(),
        date: chance.date(),
      }

      axios.get.mockResolvedValueOnce({
        data: [donationRecord]
      })
      axios.get.mockResolvedValueOnce({
        data: donationRecord
      })
      axios.get.mockResolvedValue({
        data: [donationRecord]
      })

      axios.put.mockResolvedValue({})

      const $v = {
        createRecord: {},
        updateRecord: {
          $invalid: false
        }
      }

      const url = chance.string()
      const wrapper = mount(Donations, {
        mocks: {
          $v
        },
        propsData: {
          fields: [
            {
              key: 'userID.name',
              label: "Name"
            },
            {
              key: 'userID._id',
              sortable: true,
              label: "User ID"
            },
            {
              key: 'amount',
              label: "Amount ($)",
              formatter: value => {
                return value / 100;
              }
            },          {
              key: 'tiles',
              label: 'Selected Tiles',
              formatter: tilesArray => {
                return tilesArray.toString()
              }
            },
            {
              key: 'date',
              sortable: true,
              formatter: date => {
                let dateObject = new Date(Date.parse(date));
                return dateObject.toLocaleString();
              }
            },
          ],
          url: url,
        }
      })

      await flushPromises()
      expect(wrapper.html()).not.toContain('btn-success')
      expect(wrapper.html()).not.toContain('fa-edit')
      expect(wrapper.html()).not.toContain('fa-trash')
    })

  })

})

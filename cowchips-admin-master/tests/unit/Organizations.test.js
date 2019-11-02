import Vue from 'vue'
import { shallowMount, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Organizations from '@/views/organizations/Organizations'
import axios from 'axios'
import flushPromises from 'flush-promises'
import path from 'path'
const chance = require('chance').Chance()

Vue.use(BootstrapVue)
Vue.config.silent = true

describe('Organizations CRUD Table', () => {

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

    it('is Organizations', () => {
      const wrapper = shallowMount(Organizations, {
        mocks: {
          $v
        }
      })
      expect(wrapper.is(Organizations)).toBe(true)
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
      const organizationRecord = {
        _id: chance.guid(),
        name: chance.name(),
        abbreviation: chance.string(),
        email: chance.string(),
        photo: chance.string(),
      }

      axios.get.mockResolvedValueOnce({
        data: [organizationRecord]
      })
      axios.get.mockResolvedValueOnce({
        data: organizationRecord
      })
      axios.get.mockResolvedValue({
        data: [organizationRecord]
      })

      axios.put.mockResolvedValue({})

      const $v = {
        createRecord: {},
        updateRecord: {
          $invalid: false
        }
      }

      const url = chance.string()
      const wrapper = mount(Organizations, {
        mocks: {
          $v
        },
        propsData: {
          fields: [
            {key: 'Name'},
            {key: 'Email'},
            {key: 'Abbreviation'},
            {key: 'Photo'},
            {key: 'Actions'}
          ],
          url: url,
        }
      })

      await flushPromises()
      expect(wrapper.find('.table-striped').html()).toContain('Name')
      expect(wrapper.find('.table-striped').html()).toContain('Email')
      expect(wrapper.find('.table-striped').html()).toContain('Abbreviation')
      expect(wrapper.find('.table-striped').html()).toContain('Photo')
      expect(wrapper.find('.table-striped').html()).toContain('Actions')
    })

    it('Proper data appears in the update modal', async () => {
      axios.get = jest.fn()
      console.error = jest.fn()
      const organizationRecord = {
        _id: chance.guid(),
        name: chance.name(),
        abbreviation: chance.string(),
        email: chance.string(),
        photo: chance.string(),
      }

      axios.get.mockResolvedValueOnce({
        data: [organizationRecord]
      })
      axios.get.mockResolvedValueOnce({
        data: organizationRecord
      })
      axios.get.mockResolvedValue({
        data: [organizationRecord]
      })

      axios.put.mockResolvedValue({})

      const $v = {
        createRecord: {},
        updateRecord: {
          $invalid: false
        }
      }

      const url = chance.string()
      const wrapper = mount(Organizations, {
        mocks: {
          $v
        },
        propsData: {
          fields: [
            {key: 'Name'},
            {key: 'Email'},
            {key: 'Abbreviation'},
            {key: 'Photo'},
            {key: 'Actions'}
          ],
          url: url,
          updateTransform: Organizations.methods.updateTransform
        }
      })

      await flushPromises()

      const editButton = wrapper.find('.fa-edit')
      editButton.trigger('click')

      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$children[0].$data.updateRecord).toEqual(organizationRecord)
    })


    it('Edit transformer works properly', async () => {
      console.error = jest.fn()
      axios.get = jest.fn()
      const organizationRecord = {
        _id: chance.guid(),
        name: chance.name(),
        abbreviation: chance.string(),
        email: chance.string(),
        photo: chance.string(),
      }
      const expectedRecord = {
        name: organizationRecord.name,
        email: organizationRecord.email,
        photo: organizationRecord.photo,
        abbreviation: organizationRecord.abbreviation
      }
      axios.get.mockResolvedValueOnce({
        data: [organizationRecord]
      })
      axios.get.mockResolvedValueOnce({
        data: organizationRecord
      })
      axios.get.mockResolvedValue({
        data: [organizationRecord]
      })

      axios.put.mockResolvedValue({})

      const $v = {
        createRecord: {},
        updateRecord: {
          $invalid: false
        }
      }

      const url = '/admin/organizations'
      const wrapper = mount(Organizations, {
        mocks: {
          $v
        },
        propsData: {
          fields: [
            {key: 'Name'},
            {key: 'Email'},
            {key: 'Abbreviation'},
            {key: 'Photo'},
            {key: 'Actions'}
          ],
          url: url,
          updateTransform: Organizations.methods.updateTransform
        }
      })

      await flushPromises()

      const editButton = wrapper.find('.fa-edit')
      editButton.trigger('click')

      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$children[0].$data.updateRecord).toEqual(organizationRecord)

      const saveButton = wrapper.find('#updateModal').find('.btn-primary')
      saveButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(axios.put).toHaveBeenCalledWith(path.join(url, organizationRecord._id), expectedRecord)
    })

    // TODO add unit tests for photo upload
  })

})

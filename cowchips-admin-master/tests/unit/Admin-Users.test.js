import Vue from 'vue'
import { shallowMount, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import AdminUsers from '@/views/users/Admin-users'
import axios from 'axios'
import flushPromises from 'flush-promises'
import path from 'path'
const chance = require('chance').Chance()

Vue.use(BootstrapVue)
Vue.config.silent = true

describe('Admin CRUD Table', () => {

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

    it('is Admin-Users', () => {
      const wrapper = shallowMount(AdminUsers, {
        mocks: {
          $v
        }
      })
      expect(wrapper.is(AdminUsers)).toBe(true)
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
        permissions: chance.integer({min: 0, max: 15}),
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
      const wrapper = mount(AdminUsers, {
        mocks: {
          $v
        },
        propsData: {
          fields: [
            {key: 'Name'},
            {key: 'Email'},
            {key: 'Actions'}
          ],
          url: url,
        }
      })

      await flushPromises()
      expect(wrapper.find('.table-striped').html()).toContain('Name')
      expect(wrapper.find('.table-striped').html()).toContain('Email')
      expect(wrapper.find('.table-striped').html()).toContain('Actions')
    })

    it('Proper data appears in the update modal', async () => {
      axios.get = jest.fn()
      console.error = jest.fn()
      const userRecord = {
        _id: chance.guid(),
        name: chance.name(),
        permissions: chance.integer({min: 0, max: 15}),
        email: 'testEmail@gmail.com',
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
      const wrapper = mount(AdminUsers, {
        mocks: {
          $v
        },
        propsData: {
          fields: [
            {key: 'Name'},
            {key: 'Email'},
            {key: 'Actions'}
          ],
          url: url,
          updateTransform: AdminUsers.methods.updateTransform,
          createTransform: AdminUsers.methods.createTransform
        }
      })

      await flushPromises()

      const editButton = wrapper.find('.fa-edit')
      editButton.trigger('click')

      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$children[0].$data.updateRecord).toEqual(userRecord)
    })


    it('Edit transformer works properly with same password', async () => {
      console.error = jest.fn()
      axios.get = jest.fn()
      const userRecord = {
        _id: chance.guid(),
        name: chance.name(),
        email: 'testEmail@gmail.com',
      }
      const expectedRecord = {
        name: userRecord.name,
        permissions: userRecord.permissions,
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

      const url = '/admin/admins'
      const wrapper = mount(AdminUsers, {
        mocks: {
          $v
        },
        propsData: {
          fields: [
            {key: 'Name'},
            {key: 'Email'},
            {key: 'Actions'}
          ],
          url: url,
          updateTransform: AdminUsers.methods.updateTransform,
          createTransform: AdminUsers.methods.createTransform
        }
      })

      await flushPromises()

      const editButton = wrapper.find('.fa-edit')
      editButton.trigger('click')

      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$children[0].$data.updateRecord).toEqual(userRecord)

      const saveButton = wrapper.find('#updateModal').find('.btn-primary')
      saveButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(axios.put).toHaveBeenCalledWith(path.join(url, userRecord._id), expectedRecord)
    })

    it('Edit transformer works properly with new password', async () => {
      console.error = jest.fn()
      axios.get = jest.fn()
      const userRecord = {
        _id: chance.guid(),
        name: chance.name(),
        email: 'testEmail@gmail.com',
      }
      const expectedRecord = {
        name: userRecord.name,
        permissions: userRecord.permissions,
        password: chance.string()
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

      const url = '/admin/admins'
      const wrapper = mount(AdminUsers, {
        mocks: {
          $v
        },
        propsData: {
          fields: [
            {key: 'Name'},
            {key: 'Email'},
            {key: 'Actions'}
          ],
          url: url,
          updateTransform: AdminUsers.methods.updateTransform,
          createTransform: AdminUsers.methods.createTransform
        }
      })

      await flushPromises()

      const editButton = wrapper.find('.fa-edit')
      editButton.trigger('click')

      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$children[0].$data.updateRecord).toEqual(userRecord)

      wrapper.find('#update-password').setValue(expectedRecord.password)

      const saveButton = wrapper.find('#updateModal').find('.btn-primary')
      saveButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(axios.put).toHaveBeenCalledWith(path.join(url, userRecord._id), expectedRecord)
    })

    it('Create transformer works properly', async () => {
      console.error = jest.fn()
      axios.get = jest.fn()
      axios.post = jest.fn()
      const userRecord = {
        _id: chance.guid(),
        name: chance.name(),
        permissions: chance.integer({min: 0, max: 15}),
        email: 'testEmail@gmail.com',
      }
      const expectedRecord = {
        name: chance.name(),
        email: 'testtestEmail@gmail.com',
        permissions: 1,
        password: chance.string()
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
        createRecord: {
          $invalid: false
        },
        updateRecord: {
          $invalid: false
        }
      }

      const url = '/admin/admins'
      const wrapper = mount(AdminUsers, {
        mocks: {
          $v
        },
        propsData: {
          fields: [
            {key: 'Name'},
            {key: 'Email'},
            {key: 'Actions'}
          ],
          url: url,
          updateTransform: AdminUsers.methods.updateTransform,
          createTransform: AdminUsers.methods.createTransform
        }
      })

      await flushPromises()

      const editButton = wrapper.find('.btn-success')
      editButton.trigger('click')

      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$children[0].$data.createRecord).toEqual({})

      wrapper.find('#create-name').setValue(expectedRecord.name)
      wrapper.find('#create-email').setValue(expectedRecord.email)
      wrapper.find('#create-password').setValue(expectedRecord.password)

      const saveButton = wrapper.find('#createModal').find('.btn-primary')
      saveButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(axios.post).toHaveBeenCalledWith(url, expectedRecord)
    })
  })

})

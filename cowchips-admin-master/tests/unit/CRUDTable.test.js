import Vue from 'vue'
import { shallowMount, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import CRUDTable from '@/views/crud/CRUDTable'
import axios from 'axios'
import flushPromises from 'flush-promises'
import path from 'path'
const chance = require('chance').Chance()

Vue.use(BootstrapVue)
Vue.config.silent = true

async function openCreateModal(wrapper) {
  const createUserButton = wrapper.find('#add-new')
  createUserButton.trigger('click')
  
  await wrapper.vm.$nextTick()
}

describe('CRUD Table', () => {
  
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
  
    it('is CRUDTable', () => {
      const wrapper = shallowMount(CRUDTable, {
        mocks: {
          $v
        }
      })
      expect(wrapper.is(CRUDTable)).toBe(true)
    })
    
  })
  
  it('gets all records from backend on create', async () => {
    axios.get = jest.fn()
    const items = [
      { str: chance.string() },
      { str: chance.string() },
      { str: chance.string() }
    ]
    axios.get.mockResolvedValue({
      data: items
    })
    const route = '/' + chance.string()
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      },
      propsData: {
        url: route
      }
    })
    expect(wrapper.props().url).toBe(route)
    
    expect(axios.get).toHaveBeenCalledWith(route, {params: {'populate' : true, page : 1}})
    await flushPromises()
    expect(wrapper.vm.$data.items).toEqual(items)
  })
  
  it('updateError shows up on updateModal', () => {
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      }
    })
    
    const errMsg = chance.string()
    wrapper.setData({
      updateError: errMsg
    })
    
    expect(wrapper.find('#updateModal').text().includes(errMsg)).toBe(true)
  })
  
  it('createError shows up on createModal', () => {
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      }
    })
    
    const errMsg = chance.string()
    wrapper.setData({
      createError: errMsg
    })
    
    expect(wrapper.find('#createModal').text().includes(errMsg)).toBe(true)
  })
  
  it('deleteError shows up on deleteModal', () => {
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      }
    })
    
    const errMsg = chance.string()
    wrapper.setData({
      deleteError: errMsg
    })
    
    expect(wrapper.find('#deleteModal').text().includes(errMsg)).toBe(true)
  })
  
  it('delete buttons calls clearRecords and sets deleteId', async () => {
    axios.get = jest.fn()
    const userRecord = {
      _id: chance.guid(),
      name: chance.name(),
      startTime: chance.date({string: true}),
      endTime: chance.date({string: true})
    }
    axios.get.mockResolvedValueOnce({
      data: [userRecord]
    })
    
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      },
      propsData: {
        fields: [
          {key: 'name', sortable: true},
          {key: 'startTime'},
          {key: 'endTime'},
          {key: 'actions'}
        ],
      }
    })
    
    await flushPromises()
    
    expect(wrapper.vm.$data.items).toEqual([userRecord])
    
    const clearRecordsMock = jest.fn()
    wrapper.setMethods({
      clearRecords: clearRecordsMock
    })
    
    const deleteButton = wrapper.find('.fa-trash')
    deleteButton.trigger('click')
    
    expect(clearRecordsMock).toHaveBeenCalled()
    expect(wrapper.vm.$data.deleteId).toEqual(userRecord._id)
  })
  
  it('edit button calls clearRecords and sets deleteId', async () => {
    axios.get = jest.fn()
    const userRecord = {
      _id: chance.guid(),
      name: chance.name(),
      startTime: chance.date({string: true}),
      endTime: chance.date({string: true})
    }
    axios.get.mockResolvedValueOnce({
      data: [userRecord]
    })
    axios.get.mockResolvedValueOnce({
      data: userRecord
    })
    
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      },
      propsData: {
        fields: [
          {key: 'name'},
          {key: 'startTime'},
          {key: 'endTime'},
          {key: 'actions'}
        ],
        url: chance.string()
      }
    })
    
    await flushPromises()
    
    expect(wrapper.vm.$data.items).toEqual([userRecord])
    
    const clearRecordsMock = jest.fn()
    const showUpdateModalMock = jest.fn()
    wrapper.setMethods({
      clearRecords: clearRecordsMock,
      showUpdateModal: showUpdateModalMock
    })
    
    const deleteButton = wrapper.find('.fa-edit')
    deleteButton.trigger('click')
    
    expect(clearRecordsMock).toHaveBeenCalled()
    expect(showUpdateModalMock).toHaveBeenCalled()
    
    await flushPromises()
    
    expect(wrapper.vm.$data.updateRecord).toEqual(userRecord)
  })
  
  it('Invalid update record, disables the save button', () => {
    const $v = {
      updateRecord: {
        $invalid: true
      },
      createRecord: {}
    }
    
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      }
    })
    
    const saveButton = wrapper.find('#updateModal').find('.btn-primary')
    expect(saveButton.element.classList.contains('disabled')).toBe(true)
  })
  
  it('Invalid create record, disables the save button', () => {
    const $v = {
      updateRecord: {},
      createRecord: {
        $invalid: true
      }
    }
    
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      }
    })
    
    const saveButton = wrapper.find('#createModal').find('.btn-primary')
    expect(saveButton.element.classList.contains('disabled')).toBe(true)
  })
  
  it('Valid update record, enables the save button', () => {
    const $v = {
      updateRecord: {
        $invalid: false
      },
      createRecord: {}
    }
    
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      }
    })
    
    const saveButton = wrapper.find('#updateModal').find('.btn-primary')
    expect(saveButton.element.classList.contains('disabled')).toBe(false)
  })
  
  it('Valid create record, enables the save button', () => {
    const $v = {
      updateRecord: {},
      createRecord: {
        $invalid: false
      }
    }
    
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      }
    })
    
    const saveButton = wrapper.find('#createModal').find('.btn-primary')
    expect(saveButton.element.classList.contains('disabled')).toBe(false)
  })
  
  it('Create modal submit calls correct route', async () => {
    const userRecord = {
      _id: chance.guid(),
      name: chance.name(),
      startTime: chance.date({string: true}),
      endTime: chance.date({string: true})
    }
    
    axios.post.mockResolvedValue({})
    
    const $v = {
      createRecord: {
        $invalid: false
      },
      updateRecord: {}
    }
    
    const url = chance.string()
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      },
      propsData: {
        url: url
      }
    })
    
    wrapper.setData({
      createRecord: userRecord
    })
    const hideCreateModalMock = jest.fn()
    const clearRecordsMock = jest.fn()
    wrapper.setMethods({
      hideCreateModal: hideCreateModalMock,
      clearRecords: clearRecordsMock
    })
    
    axios.get.mockResolvedValue({
      data: [userRecord]
    })
    
    await openCreateModal(wrapper)
    
    const saveButton = wrapper.find('#createModal').find('.btn-primary')
    saveButton.trigger('click')
    
    await wrapper.vm.$nextTick()
    
    expect(axios.post).toHaveBeenCalledWith(url, userRecord)
    
    await flushPromises()
    
    expect(hideCreateModalMock).toHaveBeenCalled()
    expect(clearRecordsMock).toHaveBeenCalled()
    
    await flushPromises()
    
    expect(axios.get).toHaveBeenCalledTimes(2)
  })
  
  it('Create error appears in an alert', async () => {
    const userRecord = {
      _id: chance.guid(),
      name: chance.name(),
      startTime: chance.date({string: true}),
      endTime: chance.date({string: true})
    }
    
    const errMsg = chance.string()
    const mockRes = {
      response: {
        data: {
          error: [
            {message: errMsg}
          ]
        }
      }
    }
    axios.post.mockRejectedValue(mockRes)
    
    const $v = {
      createRecord: {
        $invalid: false
      },
      updateRecord: {}
    }
    
    const url = chance.string()
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      },
      propsData: {
        url: url
      }
    })
    
    await openCreateModal(wrapper)
    
    const saveButton = wrapper.find('#createModal').find('.btn-primary')
    saveButton.trigger('click')
    
    await wrapper.vm.$nextTick()
  
    wrapper.setData({
      createRecord: userRecord
    })
    
    expect(axios.post).toHaveBeenCalledWith(url, userRecord)
    expect(wrapper.find('#createModal').text().includes(errMsg)).toBe(true)
  })
  
  it('Create transform sets createRecord', async () => {
    const userRecord = {
      _id: chance.guid(),
      name: chance.name(),
      startTime: chance.date({string: true}),
      endTime: chance.date({string: true})
    }
    
    axios.post.mockResolvedValue({})
    
    const $v = {
      createRecord: {
        $invalid: false
      },
      updateRecord: {}
    }
    
    const url = chance.string()
    const createTransform = obj => {
      obj.name = 'test'
    }
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      },
      propsData: {
        url: url,
        createTransform: createTransform
      }
    })
    
    wrapper.setData({
      createRecord: userRecord
    })
    const hideCreateModalMock = jest.fn()
    const clearRecordsMock = jest.fn()
    wrapper.setMethods({
      hideCreateModal: hideCreateModalMock,
      clearRecords: clearRecordsMock
    })
    
    axios.get.mockResolvedValue({
      data: [userRecord]
    })
    
    await openCreateModal(wrapper)
    
    const saveButton = wrapper.find('#createModal').find('.btn-primary')
    saveButton.trigger('click')
    
    await wrapper.vm.$nextTick()
    
    expect(axios.post).toHaveBeenCalledWith(url, createTransform(userRecord))
  })
  
  it('Create button shows the create modal', () => {
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      }
    })
    
    const showCreateModalMock = jest.fn()
    wrapper.setMethods({
      showCreateModal: showCreateModalMock
    })
    const createButton = wrapper.find('#add-new')
    createButton.trigger('click')
    expect(showCreateModalMock).toHaveBeenCalled()
  })
  
  it('Update button shows the edit modal', async () => {
    axios.get = jest.fn()
    const userRecord = {
      _id: chance.guid(),
      name: chance.name(),
      startTime: chance.date({string: true}),
      endTime: chance.date({string: true})
    }
    axios.get.mockResolvedValue({
      data: [userRecord]
    })
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      },
      propsData: {
        fields: [
          {key: 'name'},
          {key: 'startTime'},
          {key: 'endTime'},
          {key: 'actions'}
        ],
        url: chance.string()
      }
    })
    
    const showUpdateModalMock = jest.fn()
    wrapper.setMethods({
      showUpdateModal: showUpdateModalMock
    })
    
    await flushPromises()
    
    const editButton = wrapper.find('.fa-edit')
    editButton.trigger('click')
    
    await wrapper.vm.$nextTick()
    
    expect(showUpdateModalMock).toHaveBeenCalled()
  })
  
  it('Update modal submit calls correct route', async () => {
    axios.get = jest.fn()
    const userRecord = {
      _id: chance.guid(),
      name: chance.name(),
      startTime: chance.date({string: true}),
      endTime: chance.date({string: true})
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
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      },
      propsData: {
        fields: [
          {key: 'name'},
          {key: 'startTime'},
          {key: 'endTime'},
          {key: 'actions'}
        ],
        url: url
      }
    })
    
    await flushPromises()
    
    const editButton = wrapper.find('.fa-edit')
    editButton.trigger('click')
    
    await wrapper.vm.$nextTick()
    
    const saveButton = wrapper.find('#updateModal').find('.btn-primary')
    saveButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    expect(axios.put).toHaveBeenCalledWith(path.join(url, userRecord._id), userRecord)
  })
  
  it('Update modal error appears in an alert', async () => {
    axios.get = jest.fn()
    const userRecord = {
      _id: chance.guid(),
      name: chance.name(),
      startTime: chance.date({string: true}),
      endTime: chance.date({string: true})
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
    
    const errMsg = chance.string()
    axios.put.mockRejectedValue({
      response: {
        data: {
          error: [{message: errMsg}]
        }
      }
    })
    
    const $v = {
      createRecord: {},
      updateRecord: {
        $invalid: false
      }
    }
    
    const url = chance.string()
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      },
      propsData: {
        fields: [
          {key: 'name'},
          {key: 'startTime'},
          {key: 'endTime'},
          {key: 'actions'}
        ],
        url: url
      }
    })
    
    await flushPromises()
    
    const editButton = wrapper.find('.fa-edit')
    editButton.trigger('click')
    
    await wrapper.vm.$nextTick()
    
    const saveButton = wrapper.find('#updateModal').find('.btn-primary')
    saveButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('#updateModal').text().includes(errMsg)).toBe(true)
  })
  
  it('Update transform sets updateRecord', async () => {
    axios.get = jest.fn()
    const userRecord = {
      _id: chance.guid(),
      name: chance.name(),
      startTime: chance.date({string: true}),
      endTime: chance.date({string: true})
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
    
    const updateTransform = obj => {
      obj.name = "update!"
      return obj
    }
    const url = chance.string()
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      },
      propsData: {
        fields: [
          {key: 'name'},
          {key: 'startTime'},
          {key: 'endTime'},
          {key: 'actions'}
        ],
        url: url,
        updateTransform: updateTransform
      }
    })
    
    await flushPromises()
    
    const editButton = wrapper.find('.fa-edit')
    editButton.trigger('click')
    
    await wrapper.vm.$nextTick()
    
    const saveButton = wrapper.find('#updateModal').find('.btn-primary')
    saveButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    expect(axios.put).toHaveBeenCalledWith(path.join(url, userRecord._id), updateTransform(userRecord))
  })
  
  it('Delete button shows the delete modal', async () => {
    axios.get = jest.fn()
    const userRecord = {
      _id: chance.guid(),
      name: chance.name(),
      startTime: chance.date({string: true}),
      endTime: chance.date({string: true})
    }
    axios.get.mockResolvedValue({
      data: [userRecord]
    })
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      },
      propsData: {
        fields: [
          {key: 'name'},
          {key: 'startTime'},
          {key: 'endTime'},
          {key: 'actions'}
        ],
        url: chance.string()
      }
    })
    
    const showDeleteModalMock = jest.fn()
    const deleteRecordMock = jest.fn()
    wrapper.setMethods({
      showDeleteModal: showDeleteModalMock,
      deleteRecord: deleteRecordMock
    })
    
    await flushPromises()
    
    const deleteButton = wrapper.find('.fa-trash')
    deleteButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    expect(showDeleteModalMock).toHaveBeenCalled()
  })
  
  it('Delete modal submit call correct route', async () => {
    axios.get = jest.fn()
    const userRecord = {
      _id: chance.guid(),
      name: chance.name(),
      startTime: chance.date({string: true}),
      endTime: chance.date({string: true})
    }
    axios.get.mockResolvedValue({
      data: [userRecord]
    })
    axios.delete.mockResolvedValue({})
    
    const url = chance.string()
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      },
      propsData: {
        fields: [
          {key: 'name'},
          {key: 'startTime'},
          {key: 'endTime'},
          {key: 'actions'}
        ],
        url: url
      }
    })
    const hideDeleteModalMock = jest.fn()
    wrapper.setMethods({
      hideDeleteModal: hideDeleteModalMock,
    })
    
    await flushPromises()
    
    const deleteButton = wrapper.find('.fa-trash')
    deleteButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    const yesButton = wrapper.find('#deleteModal').find('.btn-primary')
    yesButton.trigger('click')
    
    await wrapper.vm.$nextTick()
    
    expect(axios.delete).toHaveBeenCalledWith(path.join(url, userRecord._id))
    
    await flushPromises()
    
    expect(hideDeleteModalMock).toHaveBeenCalled()
    expect(axios.get).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.$data.createRecord).toEqual({})
    expect(wrapper.vm.$data.deleteId).toEqual(null)
    expect(wrapper.vm.$data.updateRecord).toEqual({})
  })
  
  it('Delete modal shows error message', async () => {
    axios.get = jest.fn()
    const userRecord = {
      _id: chance.guid(),
      name: chance.name(),
      startTime: chance.date({string: true}),
      endTime: chance.date({string: true})
    }
    axios.get.mockResolvedValue({
      data: [userRecord]
    })
    
    const errMsg = chance.string()
    axios.delete.mockRejectedValue({
      response: {
        data: {
          error: errMsg
        }
      }
    })
    
    const wrapper = mount(CRUDTable, {
      mocks: {
        $v
      },
      propsData: {
        fields: [
          {key: 'name'},
          {key: 'startTime'},
          {key: 'endTime'},
          {key: 'actions'}
        ],
        url: chance.string()
      }
    })
    const hideDeleteModalMock = jest.fn()
    wrapper.setMethods({
      hideDeleteModal: hideDeleteModalMock,
    })
    
    await flushPromises()
    
    const deleteButton = wrapper.find('.fa-trash')
    deleteButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    const yesButton = wrapper.find('#deleteModal').find('.btn-primary')
    yesButton.trigger('click')
    
    await wrapper.vm.$nextTick()
    
    expect(axios.delete).toHaveBeenCalled()
    
    await flushPromises()
    
    expect(wrapper.text().includes(errMsg)).toBe(true)
  })
  
})

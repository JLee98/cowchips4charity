import { mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import * as chai from 'chai'
import Vue from 'vue'
import Vuex from 'vuex'
import Organizations from '@/views/Organizations'
import axios from 'axios'
import flushPromises from 'flush-promises'

Vue.config.silent = true

Vue.use(Vuetify)
Vue.use(Vuex)

const jestExpect = global.expect
const expect = chai.expect

describe('Organizations', () => {
  
  let mutations
  let store
  const organization = {
    name: 'TEST ORGANIzATION',
    abbreviation: 'TO'
  }
  
  beforeEach(() => {
    mutations = {
      setGameId: jest.fn(),
      setOrgId: jest.fn()
    }
    store = new Vuex.Store({
      mutations
    })
  
    axios.get = jest.fn()
    axios.get.mockResolvedValue({
      data: [{
        organizations: []
      }]
    })
  })
  
  it('emit next event when tile is clicked', () => {
    const wrapper = mount(Organizations)
    expect(wrapper.find(Organizations).isEmpty()).to.eql(false)
  })
  
  it('Organizations appear', async () => {
    axios.get.mockResolvedValue({
      data: [{
        organizations: [
          organization
        ]
      }]
    })
  
    const wrapper = mount(Organizations)
    
    await flushPromises()
    
    expect(wrapper.findAll('div[role=listitem]').length).to.eql(1)
  })
  
  it('Click emits next event', async () => {
    axios.get.mockResolvedValue({
      data: [{
        organizations: [
          organization
        ]
      }]
    })
    const wrapper = mount(Organizations, {
      store
    })
    
    await flushPromises()
    
    const tile = wrapper.find('.v-list__tile')
    tile.trigger('click')
    expect(wrapper.emitted().next).to.be.ok
  })
  
  it('Click calls the correct store methods', async () => {
    axios.get.mockResolvedValue({
      data: [{
        organizations: [
          organization
        ]
      }]
    })
    const wrapper = mount(Organizations, {
      store
    })
    
    await flushPromises()
    
    const tile = wrapper.find('.v-list__tile')
    tile.trigger('click')
    jestExpect(mutations.setGameId).toHaveBeenCalled()
    jestExpect(mutations.setOrgId).toHaveBeenCalled()
  })
  
  it('Loads the games from the backend', async () => {
    axios.get.mockResolvedValue({
      data: [{
        organizations: [
          organization
        ]
      }]
    })
    
    const wrapper = mount(Organizations, {
      store
    })
    
    wrapper.setMethods({
      hasImgError: () => true
    })
    
    await flushPromises()
  
    jestExpect(axios.get).toHaveBeenCalledWith('/game/active')
    expect(wrapper.text().includes(organization.name)).to.eql(true)
    expect(wrapper.text().includes(organization.abbreviation)).to.eql(true)
  })
  
})

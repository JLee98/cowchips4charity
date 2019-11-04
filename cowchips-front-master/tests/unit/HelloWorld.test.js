import { shallowMount } from '@vue/test-utils'
import HomePage from '@/components/HomePage.vue'
import Vuetify from 'vuetify'
import * as chai from 'chai'
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
Vue.use(Vuetify)

const jestExpect = global.expect
const expect = chai.expect

describe('HomePage.vue', () => {
  
  let state
  let store
  
  beforeEach(() => {
    state = {
      user: {
        email: 'a@b.com',
        password: 'test'
      }
    }
    let actions = {
    
    }
    store = new Vuex.Store({
      state,
      actions
    })
  })
  
  it('renders props.msg when passed', () => {
    const wrapper = shallowMount(HomePage, {
      store
    })
    expect(wrapper.text()).to.include(`Welcome ${state.user.email} to the CowChips4Charity event page`)
  })
})

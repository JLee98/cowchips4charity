import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    orgId: '',
    gameId: ''
  },
  mutations: {
    increment (state) {
      state.count++
    },
    setOrgId(state, orgId) {
      state.orgId = orgId
    },
    setGameId(state, gameId) {
      state.gameId = gameId
    }
  }
})

export default store

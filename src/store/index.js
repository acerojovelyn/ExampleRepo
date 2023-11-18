import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins:[createPersistedState()],
  state: {
    accounts:
     [{username:'admin',password:'admin',rights:'admin'},
      {username:'user',password:'user',rights:'user'}],
    userInfo: null,
    printreceived: []
  },
  mutations: {
    'STORE_ACCOUNTS' : (state , newState)=>{
      state.accounts = newState
    },
    'STORE_USERINFO' : (state , newState)=>{
      state.userInfo = newState
    },
    'STORE_PRINTRECEIVED' : (state , newState)=>{
      state.printreceived = newState
    },
  },
  actions: {
  },
  modules: {
  }
})

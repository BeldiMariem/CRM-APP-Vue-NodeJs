import Vue from 'vue'
import Vuex from 'vuex'
import authStore from './auth.store'
import userStore from './user.store'

Vue.use(Vuex)

export default new Vuex.Store({

  modules: {
    authStore,
    userStore
  }
})
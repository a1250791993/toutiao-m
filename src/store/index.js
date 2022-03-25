import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)

// 存储token等数据的变量
const TOKEN_KEY = 'TOKEN_USER'

export default new Vuex.Store({
  state: {
    // 一个对象，存储当前登录的用户信息
    user: getItem(TOKEN_KEY)
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    // user: null
  },
  getters: {
  },
  mutations: {
    setUser: (state, data) => {
      state.user = data

      // 将token等数据存储到本地
      setItem(TOKEN_KEY, state.user)
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(status.user))
    }
  },
  actions: {
  },
  modules: {
  }
})

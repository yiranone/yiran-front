import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

import getters from "./modules/getters";


Vue.use(Vuex)
const store = new Vuex.Store({modules,getters})

export default store

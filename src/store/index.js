import Vue from 'vue'
import Vuex from 'vuex'
import root from './root'
import { addFirstUpperCaseToPrototype, addFlatToPrototype } from '../utils/index'

Vue.use(Vuex)

addFirstUpperCaseToPrototype()
addFlatToPrototype()

export default new Vuex.Store({
  ...root(),
  modules: {}
})

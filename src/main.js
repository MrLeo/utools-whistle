import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  notification,
  message,
  Row,
  Col,
  Card,
  Icon,
  Button,
  Affix,
  Switch,
  List,
  Steps,
  Tooltip
} from 'ant-design-vue'

// import devtools from '@vue/devtools'
// devtools.connect('localhost', 8098)

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Card.name, Card)
Vue.component(Card.Meta.name, Card.Meta)
Vue.component(Icon.name, Icon)
Vue.component(Button.name, Button)
Vue.component(Affix.name, Affix)
Vue.component(Switch.name, Switch)
Vue.component(List.name, List)
Vue.component(List.Item.name, List.Item)
Vue.component(Steps.name, Steps)
Vue.component(Steps.Step.name, Steps.Step)
Vue.component(Tooltip.name, Tooltip)

Vue.prototype.$notification = notification
Vue.prototype.$message = message

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

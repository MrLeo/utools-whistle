import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Row, Col, Card, Icon, Button, Affix } from 'ant-design-vue'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Card.name, Card)
Vue.component(Card.Meta.name, Card.Meta)
Vue.component(Icon.name, Icon)
Vue.component(Button.name, Button)
Vue.component(Affix.name, Affix)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

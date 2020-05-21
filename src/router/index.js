import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    redirect: '/rules'
  },
  {
    path: '/network',
    redirect: '/rules'
  },
  {
    path: '/rules',
    name: 'rules',
    meta: {
      title: 'rules'
    },
    component: () => import(/* webpackChunkName: "rules" */ '../views/rules/index.vue')
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      title: 'About'
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router

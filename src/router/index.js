import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/qrcode",
    name: "qrcode",
    meta: {
      title: "qrcode"
    },
    component: () =>
      import(/* webpackChunkName: "qr-code" */ "../views/qr-code/index.vue")
  },
  {
    path: "/whistle",
    name: "whistle",
    meta: {
      title: "whistle"
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/whistle/index.vue")
  },
  {
    path: "/about",
    name: "About",
    meta: {
      title: "About"
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

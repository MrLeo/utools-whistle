<template>
  <keep-alive>
    <router-view />
  </keep-alive>
</template>

<script>
import { open } from './utils/utools'
export default {
  beforeCreate() {
    window.utools.onPluginEnter(async ({ code, type, payload }) => {
      console.log('用户进入插件', { code, type, payload })
      switch (code) {
        case 'whistle':
          this.$router.push({ path: `/` })
          break

        case 'network':
          open(process.env.VUE_APP_WHISTLE_API + '#network')
          window.utools.outPlugin()
          break

        case 'rules':
          open(process.env.VUE_APP_WHISTLE_API + '#rules')
          window.utools.outPlugin()
          break

        default:
          this.$router.push({ path: `/${code}` })
          break
      }
    })
  }
}
</script>

<style lang="scss">
@import './assets/scss/base.scss';
</style>

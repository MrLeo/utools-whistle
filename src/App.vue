<template>
  <keep-alive>
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  beforeCreate() {
    window.utools &&
      window.utools.onPluginEnter(({ code, type, payload }) => {
        console.log('用户进入插件', code, type, payload)
        this.$router.push({ path: `/${code}` })
      })
  }
}
</script>

<style lang="scss">
@import './assets/scss/base.scss';
</style>

<template>
  <div style="width:100%;height:100%;">
    <iframe :src="url" frameborder="0" class="frame" id="frame"></iframe>
    <!-- <div id="container" class="main"></div> -->
    <a-affix
      :offsetTop="50"
      :offsetBottom="50"
      :style="{ position: 'absolute', right: '50px', bottom: '50px' }"
    >
      <router-link to="/qrcode" style="position:fix;right:50px;bottom:50px;">
        <a-button type="primary">查看二维码</a-button>
      </router-link>
    </a-affix>
  </div>
</template>

<script>
// import $ from 'jquery'
// import { remoteLoad } from '../../utils/index'
export default {
  data() {
    return {
      url: process.env.VUE_APP_WHISTLE_API
    }
  }
  // mounted() {
  //   $.ajaxSetup({
  //     beforeSend: function(xhr, options) {
  //       options.url = this.url + options.url
  //     }
  //   })
  //   remoteLoad(`http://local.whistlejs.com/js/index.js`)
  // }
}
</script>

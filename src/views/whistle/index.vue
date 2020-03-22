<template>
  <div style="width:100%;height:100%;">
    <iframe src="http://127.0.0.1:8899/#network" frameborder="0" class="frame" id="frame"></iframe>
    <a-affix
      :offsetTop="50"
      :offsetBottom="50"
      :style="{ position: 'absolute', right: '50px', bottom: '50px' }"
    >
      <router-link to="/qrcode">
        <a-button type="primary">查看二维码</a-button>
      </router-link>
    </a-affix>
  </div>
</template>

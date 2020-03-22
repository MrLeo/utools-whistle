<template>
  <div class="wrapper">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card hoverable>
          <img slot="cover" :src="qrcode" :alt="ss" />

          <a-card-meta :title="address" :description="ss"> </a-card-meta>

          <template slot="actions" class="ant-card-actions">
            <router-link to="/whistle"
              ><a-icon type="ellipsis" key="ellipsis" />&nbsp;查看Whistle控制台</router-link
            >
          </template>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      address: '',
      ss: '',
      qrcode: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const { address, ss, qrcode } = await window.getQrCode()
      this.address = address
      this.ss = ss
      this.qrcode = qrcode
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  .ant-row {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

<template>
  <a-card hoverable>
    <img slot="cover" :src="qrcode" :alt="ss" />

    <a-card-meta class="card-meta">
      <a-tooltip slot="title" title="点击复制IP" placement="right">
        <div class="card-meta__text" @click="setClipboard(ip)">{{ address }}</div>
      </a-tooltip>
      <a-tooltip slot="description" title="点击复制SS地址" placement="right">
        <div class="card-meta__text" @click="setClipboard(ss)">{{ ss }}</div>
      </a-tooltip>
    </a-card-meta>

    <template slot="actions" class="ant-card-actions">
      <!-- <router-link to="/whistle"
        ><a-icon type="ellipsis" key="ellipsis" />&nbsp;查看Whistle控制台</router-link
      > -->
      <div @click="openWhistle">
        <a-icon type="ellipsis" key="ellipsis" />&nbsp;查看Whistle控制台
      </div>
    </template>
  </a-card>
</template>

<script>
import { open } from '../../../utils/utools'
export default {
  data() {
    return {
      ip: '',
      port: '',
      address: '',
      ss: '',
      qrcode: ''
    }
  },
  created() {
    try {
      this.getQrCode()
    } catch (err) {
      console.error(`[LOG]: WhistleQrcode -> created -> err`, err)
      this.$notification['error']({
        message: `error in qrcode created`,
        description: err.message
      })
    }
  },
  methods: {
    async getQrCode() {
      try {
        const { ip, port, address, ss, qrcode } = await window.getQrCode()
        this.ip = ip
        this.port = port
        this.address = address
        this.ss = ss
        this.qrcode = qrcode
      } catch (err) {
        console.error(`[LOG]: getQrCode -> err`, err)
      }
    },
    setClipboard(text) {
      try {
        window.setClipboard(text)
        this.$message.success(`复制成功:${text}`)
      } catch (err) {
        console.log(`[LOG]: setClipboard -> err`, err)
      }
    },
    openWhistle() {
      open(process.env.VUE_APP_WHISTLE_API + '#network')
    }
  }
}
</script>

<style lang="scss" scoped></style>

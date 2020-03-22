<template>
  <div class="wrapper">
    <p style="margin:20px;">{{ address }}</p>
    <p style="margin:20px;">{{ ss }}</p>
    <img :src="qrcode" :alt="ss" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      address: "",
      ss: "",
      qrcode: ""
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const { address, ss, qrcode } = await window.getQrCode();
      this.address = address;
      this.ss = ss;
      this.qrcode = qrcode;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <div ref="loading" class="loading" />
</template>

<script>
import lottie from "lottie-web";

export default {
  name: "Loading",
  mounted() {
    lottie.loadAnimation({
      wrapper: this.$refs.loading,
      animType: "svg",
      loop: true,
      animationData: require("../../assets/animation/hourglass.json")
    });
  }
};
</script>

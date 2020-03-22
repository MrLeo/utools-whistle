<!--
 * @Company: 智联招聘
 * @Author: xuebin.me
 * @LastEditors: Leo
 * @version: 0.0.0
 * @Description: Lottie动画
 * @Date: 2019-04-02 11:04:23
 * @LastEditTime: 2019-04-02 12:01:41
 * 参考链接
 *  - https://lottiefiles.com/
 *  - https://lottiefiles.com/popular
 *  - http://airbnb.io/lottie/#/web
 -->
<template>
  <div ref="lavContainer" class="index lottie" :style="style" />
</template>

<script>
import lottie from "lottie-web";

export default {
  props: {
    // lottie动画实例
    value: {
      type: Object,
      default: null
    },
    // Lottie动画配置信息
    options: {
      type: Object,
      required: true
    },
    // Lottie动画高度
    height: {
      type: Number,
      default: 100
    },
    // Lottie动画宽度
    width: {
      type: Number,
      default: 100
    }
  },

  data() {
    return {
      style: {
        width: this.width ? `${this.width}px` : "100%",
        height: this.height ? `${this.height}px` : "100%",
        overflow: "hidden",
        margin: "0 auto"
      }
    };
  },

  mounted() {
    if (!this.value) {
      const option = {
        container: this.$refs.lavContainer,
        renderer: "svg",
        loop: this.options.loop !== false,
        autoplay: this.options.autoplay !== false,
        animationData: this.options.animationData
      };
      if (this.options.rendererSettings) {
        option.rendererSettings = this.options.rendererSettings;
      }
      this.$emit("input", lottie.loadAnimation(option));
    }
  }
};
</script>

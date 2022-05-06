<template>
  <div class="page">
    <span
      class="rem_time"
      style="
        color: orange;
        border-width: 1px;
        border-style: solid;
        border-color: orange;
      "
      @click="goPay"
      >{{ remaining }}</span
    >
    <alertTip
      :alertText="alertText"
      v-if="showAlert"
      @closeTip="showAlert = false"
    ></alertTip>
  </div>
</template>

<script>
import alertTip from "@/components/common/alertTip";
export default {
  components: {
    alertTip,
  },
  data() {
    return {
      showAlert: false,
      timer: null,
      countNum: 900,
    };
  },
  props: {
      time: {
        default: '2'
      }
  },
  mounted() {
    this.countNum -= this.numTime;
    this.remainingTime();
  },
  computed: {
    remaining() {
      let minute = parseInt(this.countNum / 60);
      if (minute < 10) {
        minute = "0" + minute;
      }
      let second = parseInt(this.countNum % 60);
      if (second < 10) {
        second = "0" + second;
      }
      return "去支付(还剩" + minute + "分" + second + "秒)";
    },
     //订单返回时间秒分分别处理
    numTime: function () {
      if (this.time.toString().indexOf("分钟") !== -1) {
        return parseInt(this.time) * 60;
      } else {
        return parseInt(this.time);
      }
    },
  },
  methods: {
    goPay() {
      this.showAlert = true;
      this.alertText = "暂不开放支付接口";
    },
    remainingTime() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.countNum--;
        if (this.countNum == 0) {
          clearInterval(this.timer);
          this.showAlert = true;
          this.alertText = "支付超时";
        }
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
.page {
  display: inline-block;
  .rem_time {
    @include sc(0.55rem, orange);
    padding: 0.1rem 0.2rem;
    border-radius: 0.15rem;
  }
}
</style>

<template>
  <div class="validation_page">
    <headTop head-title="用户手机验证" :goBack="true"></headTop>
    <section class="validation_container">
      <div class="voice_tip" v-if="showVoiceTip">
        <p>电话拨打中...</p>
        <p>
          请留意来自<span>10105757</span> 或者 <span>021-315754XX</span> 的电话
        </p>
      </div>
      <header class="validation_header">
        <span>收不到短信？使用</span>
        <span @click="sendVoice">语音验证码</span>
      </header>
      <form class="input_form">
        <input
          type="text"
          name="validate"
          v-model="validate"
          placeholder="验证码"
          maxlength="6"
        />
        <span class="disable" v-if="countDown">{{ countDown }}</span>
        <span class="repost" @click="recall" v-else>重新发送</span>
      </form>
    </section>
    <div class="determine" @click="confirmOrder">确定</div>
    <alertTip
      v-if="showAlert"
      :alertText="alertText"
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
      validate: "",
      showAlert: false,
      alertText: "",
      countDown: 60,
      timer: null,
      showVoiceTip: false,
      reg: "",
    };
  },
  created() {
    this.initData();
    this.count();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    initData() {
      this.reg = Math.floor(Math.random() * (9999 - 999)) + 999;
      this.validate = this.reg;
    },
    count() {
      this.countDown = 60;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.countDown--;
        if (this.countDown == 0) {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    recall() {
      this.count();
      this.initData();
    },
    confirmOrder() {
      if (this.reg != this.validate) {
        this.alertText = "验证码错误";
        this.showAlert = true;
      }
      this.$router.push("/confirmOrder/payment");
    },
    sendVoice() {
      this.showVoiceTip = true;
      this.count();
      this.initData();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
.validation_page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 204;
  padding-top: 1.95rem;
  p,
  span,
  input {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}
.determine {
  background-color: #4cd964;
  @include sc(0.7rem, #fff);
  text-align: center;
  margin: 0 0.7rem;
  line-height: 1.8rem;
  border-radius: 0.2rem;
  margin-top: 0.5rem;
}
.validation_container {
  background-color: #fff;
  padding: 0.7rem;
  .validation_header {
    span {
      @include sc(0.7rem, #333);
    }
    span:nth-of-type(2) {
      color: #ff6000;
    }
  }
}
.input_form {
  display: flex;
  padding: 0.7rem 0;
  * {
    @include sc(0.65rem, #666);
    border-radius: 0.15rem;
  }
  input {
    flex: 3;
    height: 1.5rem;
    background-color: #eee;
    margin-right: 0.8rem;
    padding: 0 0.6rem;
  }
  span {
    flex: 1;
    height: 1.5rem;
    display: inline-block;
    text-align: center;
    line-height: 1.5rem;
    font-size: 0.6rem;
  }
  .repost {
    background-color: $blue;
    color: #fff;
  }
  .disable {
    background-color: #eee;
    color: #999;
  }
}
.voice_tip {
  margin-bottom: 0.4rem;
  p {
    @include sc(0.65rem, #333);
    line-height: 1rem;
    span {
      color: #ff6000;
    }
  }
}
</style>

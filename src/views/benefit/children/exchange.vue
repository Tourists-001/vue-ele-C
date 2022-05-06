<template>
  <div class="page">
    <headTop head-title="兑换红包" goBack="true"></headTop>
    <form action="" class="exchange_code">
      <input
        type="text"
        placeholder="请输入兑换码"
        class="exchange_input"
        v-model="exchangeCode"
      />
      <section class="input_container captcha_code_container">
        <input
          type="text"
          placeholder="验证码"
          maxlength="4"
          v-model="codeNumber"
        />
        <div class="img_change_img">
          <img :src="captchaCodeImg" alt="" />
          <div class="change_img">
            <p>看不清</p>
            <p>换一种</p>
          </div>
        </div>
      </section>
    </form>
    <div class="determine" @click="exchange" :class="{ active: status }">
      兑换
    </div>
    <alertTip
      v-if="showAlert"
      @closeTip="showAlert = false"
      :alertText="alertText"
    ></alertTip>
  </div>
</template>

<script>
import alertTip from "@/components/common/alertTip";
import { getCaptchas, exChangeHongbao } from "@/api/user";
import { mapState } from "vuex";
export default {
  components: {
    alertTip,
  },
  data() {
    return {
      showAlert: false,
      alertText: null,
      exchangeCode: "",
      codeNumber: "",
      captchaCodeImg: "",
    };
  },
  created() {
    this.getCaptchaCode();
  },
  computed: {
    ...mapState(["userInfo"]),
    status() {
      let status =
        /^\d+$/gi.test(this.exchangeCode) && /^\w{4}$/gi.test(this.codeNumber);
      return status;
    },
  },
  methods: {
    async getCaptchaCode() {
      let res = await getCaptchas();
      this.captchaCodeImg = res.code;
    },
    async exchange() {
      if (this.status) {
        const res = await exChangeHongbao(
          this.userInfo.user_id,
          this.exchangeCode,
          this.codeNumber
        );
        if (res.message) {
          this.getCaptchaCode();
          this.showAlert = true;
          this.alertText = res.message;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
.page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  padding-top: 1.95rem;
  z-index: 203;
  background-color: #f1f1f1;
  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}
.determine {
  background-color: #ccc;
  @include sc(0.7rem, #fff);
  text-align: center;
  margin: 0 0.7rem;
  line-height: 1.8rem;
  border-radius: 0.2rem;
  margin-top: 0.7rem;
}
.active {
  background-color: #4cd964;
}
.exchange_code {
  margin-top: 0.7rem;
  padding: 0 0.5rem;
  .exchange_input {
    width: 100%;
    @include sc(0.7rem, #666);
    padding: 0.6rem 0.4rem;
    border-radius: 0.15rem;
  }
}
.captcha_code_container {
  height: 2.2rem;
  display: flex;
  margin-top: 0.7rem;
  input {
    @include sc(0.7rem, #666);
    padding: 0.4rem;
    border-radius: 0.15rem;
    flex: 3;
  }
  .img_change_img {
    display: flex;
    align-items: center;
    flex: 2;
    margin-left: 0.3rem;
    background-color: #fff;
    padding-left: 0.2rem;
    border-radius: 0.15rem;
    img {
      @include wh(3.5rem, 1.5rem);
      margin-right: 0.2rem;
    }
    .change_img {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      width: 2rem;
      justify-content: center;
      p {
        @include sc(0.55rem, #666);
      }
      p:nth-of-type(2) {
        color: #3b95e9;
        margin-top: 0.2rem;
      }
    }
  }
}
</style>

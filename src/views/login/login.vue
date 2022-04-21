<template>
  <div class="loginContainer">
    <!-- 头部 -->
    <headTop :head-title="loginWay ? '登录' : '密码登录'" :goBack="true">
      <div slot="changeLogin" class="change_login" @click="changeLoginWay">
        {{ loginWay ? "密码登录" : "短信登录" }}
      </div>
    </headTop>
    <!-- 登录验证框 -->
    <form class="loginForm" v-if="loginWay">
      <section class="input_container phone_number">
        <input
          type="text"
          placeholder="请输入手机号"
          name="phone"
          maxlength="11"
          v-model="phoneNumber"
        />
        <button
          @click.prevent="getVerifyCode"
          :class="{ right_phone_number: rightPhoneNumber }"
          v-show="!computedTime"
        >
          获取验证码
        </button>
        <button @click.prevent v-show="computedTime">
          (已发送{{ computedTime }}s)
        </button>
      </section>
      <section class="input_container">
        <input
          type="text"
          placeholder="输入验证码"
          name="mobileCode"
          maxlength="6"
          v-model="mobileCode"
        />
      </section>
    </form>
    <!-- 账号密码登录 -->
    <form v-else class="loginForm">
      <section class="input_container">
        <input type="text" placeholder="账号" v-model.lazy="userAccount" />
      </section>
      <section class="input_container">
        <input
          v-if="!showPassword"
          type="password"
          placeholder="密码"
          v-model="passWord"
        />
        <input v-else type="text" placeholder="密码" v-model="passWord" />
        <div class="button_switch" :class="{ change_to_text: showPassword }">
          <div
            class="circle_button"
            :class="{ trans_to_right: showPassword }"
            @click="changePassWordType"
          ></div>
          <span>ab</span>
          <span>...</span>
        </div>
      </section>
      <!-- 验证码 -->
      <section class="input_container captcha_code_container">
        <input
          type="text"
          placeholder="验证码"
          maxlength="4"
          v-model="codeNumber"
        />
        <div class="img_change_img">
          <img :src="captchaCodeImg" v-show="captchaCodeImg" />
          <div class="change_img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <p class="login_tips">温馨提示：未注册过的账号，登录时将自动注册</p>
    <p class="login_tips">注册过的用户可凭账号密码登录</p>
    <div class="login_container" @click="mobileLogin">登录</div>
    <router-link to="/forget" class="to_forget" v-if="!loginWay">忘记密码？</router-link>
    <alertTip
      v-show="showAlert"
      @closeTip="closeTip"
      :alertText="alertText"
    ></alertTip>
  </div>
</template>

<script>
import alertTip from "@/components/common/alertTip";
import { getCaptchas, accountLogin, checkExsis } from "@/api/user";
import { mapMutations } from "vuex";
export default {
  components: {
    alertTip,
  },
  data() {
    return {
      loginWay: false,
      phoneNumber: "",
      mobileCode: "",
      userAccount: "", // 用户名
      passWord: "", // 密码
      codeNumber: "", // 图片验证码
      showPassword: false, // 是否显示密码
      captchaCodeImg: null, // 图片验证码
      alertText: "账号不正确", // 错误信息提示
      showAlert: false, // 是否显示提示框
      userInfo: {}, // 用户信息
      computedTime: 0, // 验证码倒计时
      timer: null, // 定时器
    };
  },
  created() {
    // 获取验证码
    this.getCaptchaCode();
  },
  computed: {
    //  判断手机号
    rightPhoneNumber() {
      return /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(
        this.phoneNumber
      );
    },
  },
  methods: {
    ...mapMutations(["RECORD_USERINFO"]),
    // 倒计时
    async getVerifyCode() {
      if (this.rightPhoneNumber) {
        this, (computedTime = 30);
        this.timer = setInterval(() => {
          this.computedTime--;
          if (this.computedTime === 0) {
            clearInterval(timer);
          }
        }, 1000);
        // 判断用户是否存在
        try {
          let exsis = await checkExsis(this.phoneNumber, "mobile");
          if (exsis.message) {
            this.showAlert = true;
            this.alertText = exsis.message;
            return;
          } else if (!exsis.is_exists) {
            this.showAlert = true;
            this.alertText = "您输入的手机号尚未绑定";
            return;
          }
          //发送短信验证码
          let res = await mobileCode(this.phoneNumber);
          if (res.message) {
            this.showAlert = true;
            this.alertText = res.message;
            return;
          }
          this.validate_token = res.validate_token;
        } catch (err) {
          this.showAlert = true;
          this.alertText = "没接口做不了";
        }
      }
    },
    // 切换到短信验证
    changeLoginWay() {
      this.loginWay = !this.loginWay;
    },
    // 获取图片验证码
    async getCaptchaCode() {
      const res = await getCaptchas();
      this.captchaCodeImg = res.code;
    },
    // 是否显示密码
    changePassWordType() {
      this.showPassword = !this.showPassword;
    },
    // 关闭弹窗
    closeTip() {
      this.showAlert = false;
    },
    // 登录
    async mobileLogin() {
      if (this.loginWay) {
        // 短信登录
        if (!this.rightPhoneNumber) {
          this.showAlert = true;
          this.alertText = "手机号码不正确";
          return;
        } else if (!/^\d{6}$/gi.test(this.mobileCode)) {
          this.showAlert = true;
          this.alertText = "短信验证码不正确";
          return;
        }
        //手机号登录
      } else {
        // 账号密码登录
        const { userAccount, codeNumber, passWord } = this;
        // console.log(userAccount, codeNumber, passWord);
        if (!userAccount.trim()) {
          this.showAlert = true;
          this.alertText = "请输入手机号/邮箱/用户名";
        } else if (!passWord.trim()) {
          this.showAlert = true;
          this.alertText = "请输入密码";
        } else if (!codeNumber.trim()) {
          this.showAlert = true;
          this.alertText = "请输入验证码";
          return;
        }
        // 用户名登录
        this.userInfo = await accountLogin(
          this.userAccount,
          this.passWord,
          this.codeNumber
        );
        console.log(this.userInfo, "====");
      }
      // 如果返回的信息不正确，则弹出弹窗
      if (!this.userInfo.user_id) {
        this.showAlert = true;
        this.alertText = this.userInfo.message;
        // 在账号密码登录时，登录错误，修改验证码
        if (!this.loginWay) this.getCaptchaCode();
      } else {
        this.$router.go(-1);
        // 在vuex中存储用户信息
        this.RECORD_USERINFO(this.userInfo);
        console.log(this.userInfo, "000");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
.loginContainer {
  padding-top: 1.95rem;
  p,
  span,
  input {
    font-family: Arial, Helvetica, sans-serif;
  }
}
.change_login {
  position: absolute;
  @include ct;
  right: 0.75rem;
  @include sc(0.7rem, #fff);
}
.loginForm {
  background-color: #fff;
  margin-top: 0.6rem;
  .input_container {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid #f1f1f1;
    input {
      @include sc(0.7rem, #666);
    }
    button {
      @include sc(0.65rem, #fff);
      font-family: Arial, Helvetica, sans-serif;
      padding: 0.28rem 0.4rem;
      border: 1px;
      border-radius: 0.15rem;
    }
    .right_phone_number {
      background-color: #4cd964;
    }
  }
  .phone_number {
    padding: 0.3rem 0.8rem;
  }
  .captcha_code_container {
    height: 2.2rem;
    .img_change_img {
      display: flex;
      align-items: center;
      img {
        @include wh(3.3rem, 1.5rem);
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
}
.login_tips {
  @include sc(0.5rem, red);
  padding: 0.4rem 0.6rem;
  line-height: 0.5rem;
  a {
    color: #3b95e9;
  }
}
.login_container {
  margin: 0 0.5rem 1rem;
  @include sc(0.7rem, #fff);
  background-color: #4cd964;
  padding: 0.5rem 0;
  border: 1px;
  border-radius: 0.15rem;
  text-align: center;
}
.button_switch {
  background-color: #ccc;
  display: flex;
  justify-content: center;
  @include wh(2rem, 0.7rem);
  padding: 0 0.2rem;
  border: 1px;
  border-radius: 0.5rem;
  position: relative;
  .circle_button {
    transition: all 0.3s;
    position: absolute;
    top: -0.2rem;
    z-index: 1;
    left: -0.3rem;
    @include wh(1.2rem, 1.2rem);
    box-shadow: 0 0.026667rem 0.053333rem 0 rgba(0, 0, 0, 0.1);
    background-color: #f1f1f1;
    border-radius: 50%;
  }
  .trans_to_right {
    transform: translateX(1.3rem);
  }
  span {
    @include sc(0.45rem, #fff);
    transform: translateY(0.05rem);
    line-height: 0.6rem;
  }
  span:nth-of-type(2) {
    transform: translateY(-0.08rem);
  }
}
.change_to_text {
  background-color: #4cd964;
}
.to_forget {
  float: right;
  @include sc(0.6rem, #3b95e9);
  margin-right: 0.3rem;
}
</style>

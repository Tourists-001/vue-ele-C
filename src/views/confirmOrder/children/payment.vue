<template>
  <div class="rating_page">
    <headTop head-title="在线支付" :goBack="true"></headTop>
    <section class="show_time_amount">
      <section>
        <header class="time_last">剩余支付时间</header>
        <p class="time">{{ remaining }}</p>
        <footer class="order_detail">
          <span>详情</span>
          <span>{{ totalPrice }}</span>
        </footer>
      </section>
    </section>
    <div class="pay_way">选择支付方式</div>
    <section class="pay_way_list">
      <section class="pay_item">
        <div class="pay_icon_container">
          <div class="zhifubao"></div>
          <span>支付宝</span>
        </div>
        <svg
          class="choose_icon"
          @click="payWay = 1"
          :class="{ choosed_way: payWay == 1 }"
        >
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#select"
          ></use>
        </svg>
      </section>
      <section class="pay_item">
        <div class="pay_icon_container">
          <svg>
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#weixin"
            ></use>
          </svg>
          <span>微信</span>
        </div>
        <svg
          class="choose_icon"
          @click="payWay = 2"
          :class="{ choosed_way: payWay == 2 }"
        >
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#select"
          ></use>
        </svg>
      </section>
    </section>
    <p class="determine" @click="confirmPay">确认支付</p>
    <alertTip
      v-if="showAlert"
      :alertText="alertText"
      @closeTip="closeTipFun"
    ></alertTip>
  </div>
</template>

<script>
import alertTip from "@/components/common/alertTip";
import { mapMutations, mapState } from "vuex";
import { payRequest } from "@/api/shop";
export default {
  components: {
    alertTip,
  },
  data() {
    return {
      countNum: 900, //倒计时15分钟
      timer: null,
      showAlert: false,
      alertText: "",
      gotoOrders: false,
      payWay: 1
    };
  },
  created() {
    this.initData();
    // 订单提交，清除购物车的数据
    if (this.shopid) {
      this.CLEAR_CART(this.shopid);
    }
  },
  mounted() {
    this.remainingTime();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {
    ...mapState(["orderMessage", "userInfo", "shopid", "cartPrice"]),
    remaining() {
      let minute = parseInt(this.countNum / 60);
      if (minute < 10) {
        minute = "0" + minute;
      }
      let second = parseInt(this.countNum % 60);
      if (second < 10) {
        second = "0" + second;
      }
      return "00 : " + minute + " : " + second;
    },
    totalPrice() {
      return this.payDetail
        ? (this.cartPrice && this.cartPrice.toFixed(2)) ||
            (this.payDetail.resultData.orderInfo.orderAmount &&
              (this.payDetail.resultData.orderInfo.orderAmount / 100).toFixed(
                2
              ))
        : "";
    },
  },
  methods: {
    ...mapMutations(["CONFIRM_INVOICE", "CLEAR_CART"]),
    // 初始化信息
    async initData() {
      if (!this.orderMessage) {
        return;
      }
      this.payDetail = await payRequest(
        this.orderMessage.order_id,
        this.userInfo.user_id
      );
      if (this.payDetail.message) {
        this.showAlert = true;
        this.alertText = this.payDetail.message;
        return;
      }
    },
    // 倒计时
    remainingTime() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.countNum--;
        if (this.countNum == 0) {
          clearInterval(this.timer);
          this.showAlert = true;
          this.alertText = "订单超时";
        }
      }, 1000);
    },
    //确认付款
    confirmPay() {
      this.showAlert = true;
      this.alertText = "当前环境无法支付，请打开官方APP进行付款";
      this.gotoOrders = true;
    },
    //关闭提示框，跳转到订单列表页
    closeTipFun() {
      this.showAlert = false;
      if (this.gotoOrders) {
        this.$router.push("/order");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
.rating_page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 204;
  padding-top: 1.95rem;
  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}
.show_time_amount {
  background-color: #fff;
  padding: 0.7rem;
  text-align: center;
  .time_last {
    @include sc(0.6rem, #666);
    margin-top: 1rem;
  }
  .time {
    @include sc(1.5rem, #333);
    margin: 0.3rem 0 1rem;
  }
  .order_detail {
    @include fj;
    span {
      @include sc(0.65rem, #666);
    }
    span:nth-of-type(2) {
      color: #ff6000;
      font-weight: bold;
    }
  }
}
.pay_way {
  background-color: #f1f1f1;
  padding: 0 0.7rem;
  @include sc(0.7rem, #666);
  line-height: 1.8rem;
}
.pay_way_list {
  background-color: #fff;
  .pay_item {
    padding: 0.4rem 0.7rem;
    @include fj;
    align-items: center;
    line-height: 2.6rem;
    border-bottom: 0.025rem solid #f5f5f5;
    .pay_icon_container {
      @include fj;
      align-items: center;
      .zhifubao {
        @include wh(2rem, 2rem);
        background: url(../../../images/zhifubao.png) no-repeat;
        background-size: 100% 100%;
        margin-right: 0.2rem;
      }
      svg {
        @include wh(2rem, 2rem);
        margin-right: 0.3rem;
      }
      span {
        @include sc(0.7rem, #666);
      }
    }
    .choose_icon {
      @include wh(1rem, 1rem);
      fill: #ccc;
    }
    .choosed_way {
      fill: #4cd964;
    }
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
  font-weight: bold;
}
</style>

<template>
  <div class="order_detail_page">
    <headTop head-title="订单详情" :goBack="true"></headTop>
    <section v-if="!showLoading" id="scroll_section" class="scroll_container">
      <section class="scroll_insert">
        <section class="order_title">
          <img :src="imgBaseUrl + orderDetail.restaurant_image_url" />
          <p>{{ orderDetail.status_bar.title }}</p>
          <p>{{ orderDetail.timeline_node.description }}</p>
          <router-link
            :to="{
              path: '/shop',
              query: { geohash, id: orderDetail.restaurant_id },
            }"
            class="order_again"
            >再来一单</router-link
          >
        </section>
        <section class="food_list">
          <router-link
            class="food_list_header"
            :to="{
              path: '/shop',
              query: { geohash, id: orderDetail.restaurant_id },
            }"
          >
            <div class="shop_name">
              <img :src="imgBaseUrl + orderDetail.restaurant_image_url" />
              <span>{{ orderDetail.restaurant_name }}</span>
            </div>
            <svg fill="#333" class="arrow_right">
              <use
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xlink:href="#arrow-right"
              ></use>
            </svg>
          </router-link>
          <ul class="food_list_ul">
            <li
              v-for="(item, index) in orderDetail.basket.group[0]"
              :key="index"
            >
              <p class="food_name ellipsis">{{ item.name }}</p>
              <div class="quantity_price">
                <span>X{{ item.quantity }}</span>
                <span>¥{{ item.price }}</span>
              </div>
            </li>
          </ul>
          <div class="deliver_fee">
            <span>配送费</span>
            <span>{{
              (orderDetail.basket.deliver_fee &&
                orderDetail.basket.deliver_fee.price) ||
              0
            }}</span>
          </div>
          <div class="pay_ment">
            实付{{ orderDetail.total_amount.toFixed(2) }}
          </div>
        </section>
        <section class="order_detail_style">
          <header>配送信息</header>
          <section class="item_style">
            <p class="item_left">送达时间:</p>
            <div class="item_right">
              <p>{{ orderData.deliver_time }}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">送货地址</p>
            <div class="item_right">
              <p>{{ orderData.consignee }}</p>
              <p>{{ orderData.phone }}</p>
              <p>{{ orderData.address }}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">配送方式</p>
            <div class="item_right">
              <p>蜂鸟配送</p>
            </div>
          </section>
        </section>
        <section class="order_detail_style">
          <header>订单信息</header>
          <section class="item_style">
            <p class="item_left">订单号:</p>
            <div class="item_right">
              <p>{{ orderDetail.id }}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">支付方式:</p>
            <div class="item_right">
              <p>在线支付</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">下单时间:</p>
            <div class="item_right">
              <p>{{ orderDetail.formatted_created_at }}</p>
            </div>
          </section>
        </section>
      </section>
    </section>
    <transition name="loading">
      <loading v-if="showLoading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getOrderDetail } from "@/api/shop";
import loading from "@/components/common/loading";
import BScroll from "better-scroll";
import { imgBaseUrl } from "@/config/env";
export default {
  components: {
    loading,
  },
  data() {
    return {
      orderData: [],
      showLoading: true,
      imgBaseUrl,
    };
  },
  watch: {
    userInfo: function (value) {
      if (value && value.user_id) {
        this.initData();
      }
    },
  },
  mounted() {
    this.initData();
  },
  computed: {
    ...mapState(["orderDetail", "geohash", "userInfo"]),
  },
  methods: {
    async initData() {
      if (this.userInfo && this.userInfo.user_id) {
        this.orderData = await getOrderDetail(
          this.userInfo.user_id,
          this.orderDetail.unique_id
        );
        this.showLoading = false;
        this.$nextTick(() => {
          new BScroll("#scroll_section", {
            deceleration: 0.001,
            bounce: true,
            swipeTime: 1800,
            click: true,
          });
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";

.order_detail_page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f1f1f1;
  z-index: 202;
  padding-top: 1.95rem;
  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}
.scroll_container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 1.95rem;
}
.scroll_insert {
  padding-bottom: 3rem;
}
.order_title {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.7rem;
  background-color: #fff;
  margin-bottom: 0.5rem;
  img {
    border: 0.05rem solid $blue;
    border-radius: 50%;
    @include wh(3rem, 3rem);
  }
  p:nth-of-type(1) {
    @include sc(0.9rem, #333);
    font-weight: bold;
    margin-top: 0.4rem;
  }
  p:nth-of-type(2) {
    @include sc(0.55rem, #999);
    width: 10rem;
    margin-top: 0.3rem;
    text-align: center;
  }
  .order_again {
    @include sc(0.6rem, $blue);
    margin-top: 0.5rem;
    border: 0.025rem solid $blue;
    padding: 0.15rem 0.4rem;
    border-radius: 0.1rem;
  }
}
.food_list {
  background-color: #fff;
  .food_list_header {
    @include fj;
    align-items: center;
    padding: 0.2rem 0.5rem;
    border-bottom: 1px solid #f5f5f5;
    .shop_name {
      img {
        @include wh(1.2rem, 1.2rem);
        vertical-align: middle;
        margin-right: 0.2rem;
      }
      span {
        @include sc(0.75rem, #333);
        font-weight: bold;
      }
    }
    svg {
      @include wh(0.6rem, 0.6rem);
      fill: #666;
    }
  }
  .food_list_ul {
    li {
      @include fj;
      align-items: center;
      padding: 0 0.5rem;
      line-height: 2rem;
      .food_name {
        @include sc(0.6rem, #666);
        flex: 4;
      }
      .quantity_price {
        flex: 1;
        @include fj;
        align-items: center;
        span:nth-of-type(1) {
          @include sc(0.6rem, #ccc);
        }
        span:nth-of-type(2) {
          @include sc(0.6rem, #666);
        }
      }
    }
  }
  .deliver_fee {
    @include fj;
    align-items: center;
    padding: 0 0.5rem;
    line-height: 2rem;
    border-top: 1px solid #f5f5f5;
    span {
      @include sc(0.6rem, #666);
    }
  }
  .pay_ment {
    @include sc(0.6rem, #fb6b23);
    border-top: 1px solid #f5f5f5;
    font-weight: bold;
    line-height: 2rem;
    text-align: right;
    padding-right: 0.5rem;
  }
}
.order_detail_style {
  background-color: #fff;
  margin-top: 0.5rem;
  header {
    @include sc(0.75rem, #333);
    padding: 0.5rem;
    border-bottom: 1px solid #f5f5f5;
  }
  .item_style {
    display: flex;
    padding: 0.5rem;
    p {
      @include sc(0.65rem, #666);
      line-height: 1rem;
    }
  }
}
.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.7s;
}
.loading-enter,
.loading-leave-active {
  opacity: 0;
}
</style>

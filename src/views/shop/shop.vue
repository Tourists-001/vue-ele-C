<template>
  <div>
    <section v-if="!showLoading" class="shop_container">
      <!-- 头部公告 -->
      <nav class="goBack" @click.stop="goBack">
        <svg
          width="4rem"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <polyline
            points="12,18 4,9 12,0"
            style="fill: none; stroke: rgb(255, 255, 255); stroke-width: 3"
          />
        </svg>
      </nav>
      <header
        class="shop_detail_header"
        ref="shopHeader"
        :style="{ zIndex: showActivities ? '14' : '10' }"
      >
        <div class="header_cover_img_icon">
          <img
            :src="imgBaseUrl + this.shopDetailData.image_path"
            class="header_cover_img"
          />
        </div>
        <section class="description_header">
          <router-link to="/shop/shopDetail" class="description_top">
            <section class="description_left">
              <img :src="imgBaseUrl + this.shopDetailData.image_path" />
            </section>
            <section class="description_right">
              <h4 class="description_title ellipsis">
                {{ shopDetailData.name }}
              </h4>
              <p class="description_text">
                商家配送／{{
                  shopDetailData.order_lead_time
                }}分钟送达／配送费¥{{ shopDetailData.float_delivery_fee }}
              </p>
              <p
                class="description_promotion ellipsis"
                @click.prevent="showMasker = true"
              >
                公告：{{ promotionInfo }}
              </p>
            </section>
            <svg
              width="14"
              height="14"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              class="description_arrow"
            >
              <path
                d="M0 0 L8 7 L0 14"
                stroke="#fff"
                stroke-width="1"
                fill="none"
              />
            </svg>
          </router-link>
        </section>
      </header>
      <section class="change_show_type" ref="chooseType">
        <div>
          <span
            :class="{ activity_show: changeShowType == 'food' }"
            @click="changeShowType = 'food'"
            >商品</span
          >
        </div>
        <div>
          <span
            :class="{ activity_show: changeShowType == 'rating' }"
            @click="changeShowType = 'rating'"
            >评价</span
          >
        </div>
        <div>
          <span
            :class="{ activity_show: changeShowType == 'shopping' }"
            @click="changeShowType = 'shopping'"
            >店铺</span
          >
        </div>
      </section>
      <transition name="fade">
        <shopList
          v-if="changeShowType == 'food'"
          :menuList="menuList"
          :showLoading="showLoading"
          :shopId="shopId"
        ></shopList>
      </transition>
    </section>
    <transition name="fade-choose">
      <rating v-show="changeShowType == 'rating'" :shopid="shopId"></rating>
    </transition>
    <transition name="fade">
      <mantle
        :isShowMask="showMasker"
        @closeClick="showMasker = $event"
      ></mantle>
    </transition>
    <loading v-show="showLoading || loadRatings"></loading>
    <section
      class="animation_opactiy shop_back_svg_container"
      v-if="showLoading"
    >
      <img src="../../images/shop_back_svg.svg" />
    </section>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { shopDetails, foodMenu } from "@/api/shop.js";
import { imgBaseUrl } from "@/config/env";
import { msiteAddress } from "@/api/city";
import mantle from "@/components/common/mantle";
import shopList from "./components/shopList.vue";
import loading from "@/components/common/loading.vue";
import Rating from "@/views/shop/components/Rating";
export default {
  components: {
    mantle,
    shopList,
    loading,
    Rating,
  },
  data() {
    return {
      geohash: "", //geohash位置信息
      shopId: "", // 商铺ID
      imgBaseUrl, // 图片域名
      showLoading: true, // 加载蒙层
      showActivities: true,
      shopDetailData: null, //商铺详情
      showMasker: false, // 头部蒙层显示
      changeShowType: "food", // 导航栏的显示
      menuList: [], // 左侧分类
      loadRatings: false, //加载更多评论是显示加载组件
    };
  },
  computed: {
    ...mapState(["latitude", "longitude"]),
    promotionInfo: function () {
      return (
        this.shopDetailData.promotion_info ||
        "欢迎光临，用餐高峰期请提前下单，谢谢。"
      );
    },
  },
  created() {
    this.geohash = this.$route.query.geohash;
    this.shopId = this.$route.query.id;
  },
  mounted() {
    // 获取初始化数据
    this.initData();
  },
  methods: {
    ...mapMutations(["RECORD_ADDRESS", "RECORD_SHOPDETAIL"]),
    async initData() {
      // 初始化获取基本数据
      if (!this.latitude) {
        //获取位置信息
        let res = await msiteAddress(this.geohash);
        // 记录当前经度纬度进入vuex
        this.RECORD_ADDRESS(res);
      }
      // 获取商铺信息
      this.shopDetailData = await shopDetails(
        this.shopId,
        this.latitude,
        this.longitude
      );
      // 获取商铺食品列表
      this.menuList = await foodMenu(this.shopId);
    //   console.log(this.menuList);
      this.RECORD_SHOPDETAIL(this.shopDetailData);
      this.hideLoading();
    },
    goBack() {
      this.$router.go(-1);
    },
    //隐藏动画
    hideLoading() {
      this.showLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
@keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
@-moz-keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
@-webkit-keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
@-o-keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
.shop_back_svg_container {
  position: fixed;
  @include wh(100%, 100%);
  img {
    @include wh(100%, 100%);
  }
}
.shop_container {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  left: 0;
  height: 100%;
}
.goBack {
  position: fixed;
  top: 0;
  left: 0;
  width: 2rem;
  height: 2rem;
  z-index: 15;
  padding-top: 0.2rem;
  padding-left: 0.2rem;
}
.shop_detail_header {
  position: relative;
  .header_cover_img_icon {
    height: 100%;
    overflow: hidden;
    position: absolute;
    width: 100%;
    .header_cover_img {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
      filter: blur(10px);
    }
  }
  .description_header {
    position: relative;
    z-index: 10;
    background-color: rgba(119, 103, 137, 0.43);
    padding: 0.4rem 0 0.4rem 0.4rem;
    width: 100%;
    overflow: hidden;
    .description_top {
      display: flex;
      .description_left {
        margin-right: 0.3rem;
        img {
          @include wh(2.9rem, 2.9rem);
          display: block;
          border-radius: 0.15rem;
        }
      }
      .description_right {
        flex: 1;
        .description_title {
          @include sc(0.8rem, #fff);
          font-weight: bold;
          width: 100%;
          margin-bottom: 0.3rem;
        }
        .description_text {
          @include sc(0.5rem, #fff);
          margin-bottom: 0.3rem;
        }
        .description_promotion {
          @include sc(0.5rem, #fff);
          width: 11.5rem;
        }
      }
      .description_arrow {
        @include ct;
        right: 0.3rem;
        z-index: 11;
      }
    }
    .description_footer {
      @include fj;
      margin-top: 0.5rem;
      padding-right: 1rem;
      p {
        @include sc(0.5rem, #fff);
        span {
          color: #fff;
        }
        .tip_icon {
          padding: 0 0.04rem;
          border: 0.025rem solid #fff;
          border-radius: 0.1rem;
          font-size: 0.4rem;
          display: inline-block;
        }
      }
      .ellipsis {
        width: 84%;
      }
      .footer_arrow {
        @include wh(0.45rem, 0.45rem);
        position: absolute;
        right: 0.3rem;
      }
    }
  }
}
.change_show_type {
  user-select: none;
  display: flex;
  background-color: #fff;
  padding: 0.3rem 0 0.6rem;
  border-bottom: 1px solid #ebebeb;
  div {
    flex: 1;
    text-align: center;
    span {
      @include sc(0.65rem, #666);
      padding: 0.2rem 0.1rem;
      border-bottom: 0.12rem solid #fff;
    }
    .activity_show {
      color: #3190e8;
      border-color: #3190e8;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.fade-choose-enter-active,
.fade-choose-leave-active {
  transition: opacity 0.5s;
}
.fade-choose-leave,
.fade-choose-leave-active {
  display: none;
}
.fade-choose-enter,
.fade-choose-leave-active {
  opacity: 0;
}
.router-slid-enter-active,
.router-slid-leave-active {
  transition: all 0.4s;
}
.router-slid-enter,
.router-slid-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
.toggle-cart-enter-active,
.toggle-cart-leave-active {
  transition: all 0.3s ease-out;
}
.toggle-cart-enter,
.toggle-cart-leave-active {
  transform: translateY(100%);
}
</style>

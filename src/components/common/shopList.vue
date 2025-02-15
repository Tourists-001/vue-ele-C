<template>
  <div class="shopList_container">
    <ul
      v-load-more="showMore"
      v-if="shopListArr.length"
      type="1"
      style="marginbottom: 2rem"
    >
      <router-link
        :to="{ path: 'shop', query: { geohash, id: item.id } }"
        v-for="item in shopListArr"
        :key="item.id"
        tag="li"
        class="shop_li"
      >
        <section>
          <img :src="imgBaseUrl + item.image_path" class="shop_img" />
        </section>
        <hgroup class="shop_right">
          <header class="shop_detail_header">
            <h4
              :class="item.is_premium ? 'premium' : ''"
              class="shop_title ellipsis"
            >
              {{ item.name }}
            </h4>
            <ul class="shop_detail_ul">
              <li class="supports" v-for="item in item.supports" :key="item.id">
                {{ item.icon_name }}
              </li>
            </ul>
          </header>
          <h5 class="rating_order_num">
            <section class="rating_section">
              <ratingStart :rating="item.rating"></ratingStart>
              <span class="rating_num">{{ item.rating }}</span>
            </section>
            <section class="order_section">
              月售{{ item.recent_order_num }}单
            </section>
            <section class="rating_order_num_right">
              <span
                class="delivery_style delivery_left"
                v-if="item.delivery_mode"
                >{{ item.delivery_mode.text }}</span
              >
              <span
                class="delivery_style delivery_right"
                v-if="zhunshi(item.supports)"
                >准时达</span
              >
            </section>
          </h5>
          <h5 class="fee_distance">
            <p class="fee">
              ¥{{ item.float_minimum_order_amount }}起送
              <span class="segmentation">/</span>
              {{ item.piecewise_agent_fee.tips }}
            </p>
            <p class="distance_time">
              <span v-if="Number(item.distance)">
                {{
                  item.distance > 1000
                    ? (item.distance / 1000).toFixed(2) + "km"
                    : item.distance + "m"
                }}
              </span>
              <span>/</span>
              <span>{{ item.distance }}</span>
              <span class="segmentation">{{ item.order_lead_time }}</span>
            </p>
          </h5>
        </hgroup>
      </router-link>
    </ul>
    <!-- 没加载前的蒙层 -->
    <ul v-else class="animation_opactiy">
      <li class="list_back_li">
        <img src="../../images/shopback.svg" class="list_back_svg" />
      </li>
    </ul>
    <p class="empty_data" v-if="touchend">没有更多了</p>
    <!-- 返回顶部按钮 -->
    <aside class="return_top" @click="backTop" v-show="showBackStatus">
      <svg class="back_top_svg">
        <use
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#backtop"
        ></use>
      </svg>
    </aside>
    <div ref="abc" style="background-color: red">
      <transition name="loading">
        <loading v-show="showLoading"></loading>
      </transition>
    </div>
  </div>
</template>

<script>
import ratingStart from "@/components/common/ratingStart";
import loading from "@/components/common/loading";
import loadMore from "@/directives/loadingMore";
import { shopList } from "@/api/main";
import { mapState } from "vuex";
import { imgBaseUrl } from "@/config/env";
import { animate, showBack } from "@/config/nUtils";
import { getImgPath } from "@/mixin/resImg";
export default {
  components: {
    ratingStart,
    loading,
  },
  mixins: [getImgPath],
  data() {
    return {
      offset: 0,
      shopListArr: [], // 商品列表数据
      touchend: false, // 没有加载更多
      showLoading: true, //显示加载动画
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      imgBaseUrl,
      showBackStatus: false, // 回到顶部按钮的显示和隐藏
    };
  },
    props: [
      "restaurantCategoryId",
      "restaurantCategoryIds",
      "sortByType",
      "deliveryMode",
      "supportIds",
      "confirmSelect",
      "geohash",
    ],
  // 自定义指令，设置下滑加载更多
  directives: loadMore,
  computed: {
    ...mapState(["latitude", "longitude"]),
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 获取商家列表数据
    async getShoList() {
        console.log( this.latitude,this.longitude);
      const res = await shopList(
        this.latitude,
        this.longitude,
        this.offset,
        this.restaurantCategoryId
      );
      return res;
    },
    async initData() {
      const res = await this.getShoList();
    //   console.log(res);
      this.shopListArr = [...res];
      // 当长度大于20，监听滚动条
      if (res.length < 19) {
        this.touchend = true;
      }
      this.hideLoading();
      //开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
      showBack((status) => {
        this.showBackStatus = status;
      });
    },
    // 到达底部加载更多
    async showMore() {
      // 大于20 ，加载跟多
      if (this.touchend) {
        return;
      }
      // 防止重复点击
      if (this.preventRepeatReuqest) {
        return;
      }
      this.showLoading = true;
      this.preventRepeatReuqest = true;
      // 数据的定位加20位
      this.offset += 20;
      const res = await this.getShoList();
      this.hideLoading();
      this.shopListArr = [...this.shopListArr, ...res];
    //   console.log(res);
      //当获取数据小于20，说明没有更多数据，不需要再次请求数据
      if (res.length <= 19) {
        this.touchend = true;
        return;
      }
      this.preventRepeatReuqest = false;
    },
    hideLoading() {
      this.showLoading = false;
    },
    // 点击置顶
    backTop() {
      animate(document.documentElement, { scrollTop: "0" }, 400, "ease-out");
    },
    zhunshi(supports) {
      let zhunStatus;
      if (supports instanceof Array && supports.length) {
        supports.forEach((item) => {
          if (item.icon_name === "准") {
            zhunStatus = true;
          }
        });
      } else {
        zhunStatus = false;
      }
      return zhunStatus;
    },
    // 监听父级传来的数据发生变化时，触发此函数重新根据属性值获取数据
    async listenPropChange() {
      this.showLoading = true;
      this.offset = 0;
      let res = await shopList(
        this.latitude,
        this.longitude,
        this.offset,
        "",
        this.restaurantCategoryIds,
        this.sortByType,
        this.deliveryMode,
        this.supportIds
      );
      this.hideLoading();
      //考虑到本地模拟数据是引用类型，所以返回一个新的数组
      this.shopListArr = [...res];
    },
  },
  watch: {
    //监听父级传来的restaurantCategoryIds，当值发生变化的时候重新获取餐馆数据，作用于排序和筛选
    restaurantCategoryIds() {
      this.listenPropChange();
    },
    //监听父级传来的排序方式
    sortByType() {
      this.listenPropChange();
    },
    //监听父级的确认按钮是否被点击，并且返回一个自定义事件通知父级，已经接收到数据，此时父级才可以清除已选状态
    confirmSelect() {
      this.listenPropChange();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
.shopList_container {
  background-color: #fff;
  margin-bottom: 2rem;
}
.shop_li {
  display: flex;
  border-bottom: 0.025rem solid #f1f1f1;
  padding: 0.7rem 0.4rem;
}
.shop_img {
  @include wh(2.7rem, 2.7rem);
  display: block;
  margin-right: 0.4rem;
}
.list_back_li {
  height: 4.85rem;
  .list_back_svg {
    @include wh(100%, 100%);
  }
}
.shop_right {
  flex: auto;
  .shop_detail_header {
    @include fj;
    align-items: center;
    .shop_title {
      width: 8.5rem;
      color: #333;
      padding-top: 0.01rem;
      @include font(0.65rem, 0.65rem, "PingFangSC-Regular");
      font-weight: 700;
    }
    .premium::before {
      content: "品牌";
      display: inline-block;
      font-size: 0.5rem;
      line-height: 0.6rem;
      color: #333;
      background-color: #ffd930;
      padding: 0 0.1rem;
      border-radius: 0.1rem;
      margin-right: 0.2rem;
    }
    .shop_detail_ul {
      display: flex;
      transform: scale(0.8);
      margin-right: -0.3rem;
      .supports {
        @include sc(0.5rem, #999);
        border: 0.025rem solid #f1f1f1;
        padding: 0 0.04rem;
        border-radius: 0.08rem;
        margin-left: 0.05rem;
      }
    }
  }
  .rating_order_num {
    @include fj(space-between);
    height: 0.6rem;
    margin-top: 0.52rem;
    .rating_section {
      display: flex;
      .rating_num {
        @include sc(0.4rem, #ff6000);
        margin: 0 0.2rem;
      }
    }
    .order_section {
      transform: scale(0.8);
      margin-left: -1.2rem;
      @include sc(0.4rem, #666);
    }
    .rating_order_num_left {
      @include fj(flex-start);
    }
    .rating_order_num_right {
      display: flex;
      align-items: center;
      transform: scale(0.7);
      min-width: 5rem;
      justify-content: flex-end;
      margin-right: -0.8rem;
      .delivery_style {
        font-size: 0.4rem;
        padding: 0.04rem 0.08rem 0;
        border-radius: 0.08rem;
        margin-left: 0.08rem;
        border: 1px;
      }
      .delivery_left {
        color: #fff;
        background-color: $blue;
        border: 0.025rem solid $blue;
      }
      .delivery_right {
        color: $blue;
        border: 0.025rem solid $blue;
      }
    }
  }
  .fee_distance {
    margin-top: 0.52rem;
    @include fj;
    @include sc(0.5rem, #333);
    .fee {
      transform: scale(0.9);
      @include sc(0.5rem, #666);
    }
    .distance_time {
      transform: scale(0.9);
      span {
        color: #999;
      }
      .order_time {
        color: $blue;
      }
      .segmentation {
        color: #ccc;
      }
    }
  }
}
.loader_more {
  @include font(0.6rem, 3);
  text-align: center;
  color: #999;
}
.empty_data {
  @include sc(0.5rem, #666);
  text-align: center;
  line-height: 2rem;
  position: relative;
  top: -50px;
}
.return_top {
  position: fixed;
  bottom: 3rem;
  right: 1rem;
  .back_top_svg {
    @include wh(2rem, 2rem);
  }
}
.loading-enter-active,
.loading-leave-active {
  transition: opacity 1s;
}
.loading-enter,
.loading-leave-active {
  opacity: 0;
}
</style>

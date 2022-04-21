<template>
  <div>
    <!-- 头部 -->
    <headTop signinUp="mysite">
      <router-link :to="'/search/geohash'" class="link_search" slot="search">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <circle
            cx="8"
            cy="8"
            r="7"
            stroke="rgb(255,255,255)"
            stroke-width="1"
            fill="none"
          />
          <line
            x1="14"
            y1="14"
            x2="20"
            y2="20"
            style="stroke: rgb(255, 255, 255); stroke-width: 2"
          />
        </svg>
      </router-link>
      <router-link to="/" slot="msite-title" class="msite_title">
        <span class="title_text ellipsis">{{ msiteTitle }}</span>
      </router-link>
    </headTop>
    <!-- 头部轮播图 -->
    <nav class="msite_nav">
      <div class="swiper-container" ref="page">
        <div class="swiper-wrapper" v-if="foodTypes.length">
          <div
            class="swiper-slide food_types_container"
            v-for="(item, index) in foodTypes"
            :key="index"
          >
            <router-link
              v-for="foodItem in item"
              :key="foodItem.id"
              class="link_to_food"
              :to="{
                path: '/food',
                query: {
                  geohash,
                  title: foodItem.title,
                  restaurant_category_id: getCategoryId(foodItem.link),
                },
              }"
            >
              <figure>
                <img :src="'https://fuss10.elemecdn.com'+ foodItem.image_url"/>
                <figcaption>{{ foodItem.title }}</figcaption>
              </figure>
            </router-link>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <img
        src="../../images/fl.svg"
        class="fl_back animation_opactiy"
        v-if="!foodTypes.length"
      />
    </nav>
    <!-- 列表 -->
    <div class="shop_list_container">
      <header class="shop_header">
        <svg class="shop_icon">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#shop"
          ></use>
        </svg>
        <span class="shop_header_title">附近商家</span>
      </header>
      <!-- !列表组件 -->
      <shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
    </div>
    <footGuide></footGuide>
  </div>
</template>
<script>
import shopList from "@/components/common/shopList.vue";
import { cityGuess, msiteAddress } from "@/api/city";
import { msiteFoodTypes } from "@/api/main";
import footGuide from "@/components/footer/footGuide.vue";
import { mapMutations } from "vuex";
import Swiper from "swiper";
export default {
  data() {
    return {
      msiteTitle: "请选择地址...", // 头部地址
      geohash: "", // 城市的id
      hasGetData: false, //是否已经获取到位置信息了，如果获取到了，获取位置信息的商铺
      foodTypes: [], //获取商品分类
      imgBaseUrl: "https://fuss10.elemecdn.com", //图片域名地址
    };
  },
  activated () {
    this.getHash();
    // 获取商品分类
    this.getFoodTypes();
  },
  components: {
    footGuide,
    shopList,
  },
  watch: {
    immediate: true,
    foodTypes() {
      // 防止数据过来了，但是结构没渲染好
      this.$nextTick(() => {
        new Swiper(this.$refs.page, {
          pagination: {
            el: ".swiper-pagination",
            //点击小球的时候也切换图片
            clickable: true,
          },
          loop: true,
        });
      });
    },
  },
  methods: {
    ...mapMutations(["RECORD_ADDRESS", "SAVE_GEOHASH"]),
    // 获取商品分类
    async getFoodTypes() {
      const res = await msiteFoodTypes(this.geohash);
      let resLength = res.length;
      let resArr = [...res];
      let foodArr = [];
      // 因为分页需要两页的数据，所有把获取到的数据拆分为两个数据
      for (let i = 0, j = 0; i < resLength; i += 8, j++) {
        foodArr[j] = resArr.splice(0, 8);
      }
      this.foodTypes = foodArr;
    },
    // 获取地理位置信息
    async getHash() {
      if (!this.$route.query.geohash) {
        // 如果是从其他地方进来，或者没有地址信息，则直接获取热门城市的信息
        const address = await cityGuess();
        this.geohash = address.latitude + "," + address.longitude;
      } else {
        this.geohash = this.$route.query.geohash;
        // console.log(this.geohash,'adadad');
      }
      // 保存geohash到vuex中去
      this.SAVE_GEOHASH(this.geohash);
      // 获取位置信息
      const res = await msiteAddress(this.geohash);
    //   console.log(res,'ffffff');
      this.msiteTitle = res.name;
      // 记录当前经纬度
      this.RECORD_ADDRESS(res);
      this.hasGetData = true;
    },
    // 解码
    getCategoryId(url) {
        // console.log(url);
      let urlData = decodeURIComponent(
        url.split("=")[1].replace("&target_name", "")
      );
    //   console.log(urlData);
      if (/restaurant_category_id/gi.test(urlData)) {
        return JSON.parse(urlData).restaurant_category_id.id;
      } else {
        return "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/style/mixin";
.link_search {
  left: 0.8rem;
  @include wh(0.9rem, 0.9rem);
  @include ct;
}
.msite_title {
  @include center;
  width: 50%;
  color: #fff;
  text-align: center;
  margin-left: -0.5rem;
  .title_text {
    @include sc(0.8rem, #fff);
    text-align: center;
    display: block;
  }
}
.msite_nav {
  padding-top: 2.1rem;
  background-color: #fff;
  border-bottom: 0.025rem solid $bc;
  height: 10.6rem;
  .swiper-container {
    @include wh(100%, auto);
    padding-bottom: 0.6rem;
    .swiper-pagination {
      bottom: 0.2rem;
    }
  }
  .fl_back {
    @include wh(100%, 100%);
  }
}
.food_types_container {
  display: flex;
  flex-wrap: wrap;
  .link_to_food {
    width: 25%;
    padding: 0.3rem 0rem;
    @include fj(center);
    figure {
      img {
        margin-bottom: 0.3rem;
        @include wh(1.8rem, 1.8rem);
      }
      figcaption {
        text-align: center;
        @include sc(0.55rem, #666);
      }
    }
  }
}
.shop_list_container {
  margin-top: 0.4rem;
  border-top: 0.025rem solid $bc;
  background-color: #fff;
  .shop_header {
    .shop_icon {
      fill: #999;
      margin-left: 0.6rem;
      vertical-align: middle;
      @include wh(0.6rem, 0.6rem);
    }
    .shop_header_title {
      color: #999;
      @include font(0.55rem, 1.6rem);
      padding-left: 0.5rem;
    }
  }
}
</style>

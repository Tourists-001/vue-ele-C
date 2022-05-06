<template>
  <div>
    <!-- 头部导航栏 -->
    <headTop signin-up="home">
      <span slot="logo" class="head_logo" @click="reload">ele.me</span>
    </headTop>
    <!-- 城市定位 -->
    <nav class="city_nav">
      <div class="city_tip">
        <span>当前定位城市</span>
        <span>定位不准,请在城市列表选择</span>
      </div>
      <router-link :to="`/city/${guessCityId}`" class="guess_city">
        <span>{{ guessCity }}</span>
        <svg class="arrow_right">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#arrow-right"
          ></use>
        </svg>
      </router-link>
    </nav>
    <!-- 热门城市 -->
    <section id="hot_city_container">
      <h4 class="city_title">热门城市</h4>
      <ul class="cityListul clear">
        <router-link
          :to="`/city/${item.id}`"
          tag="li"
          v-for="(item, i) in hotCity"
          :key="i"
          >{{ item.name }}</router-link
        >
      </ul>
    </section>
    <!-- 城市列表 -->
    <section class="group_city_container">
      <ul class="letter_classify">
        <li
          v-for="(value, key, index) in sortGroupCity"
          :key="key"
          class="letter_classify_li"
        >
          <h4 class="city_title">
            {{ key }}
            <span v-if="index === 0">(按首字母排)</span>
          </h4>
          <ul class="group_name_container cityListul clear">
            <router-link
              v-for="(item, i) in value"
              :key="i"
              class="ellipsis"
              :to="`/city/${item.id}`"
              tag="li"
            >
              {{ item.name }}
            </router-link>
          </ul>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
// import headTop from "@/components/header/head.vue";
import { cityGuess, hotCity, groupCity } from "@/api/city";
export default {
  //   components: {
  //     headTop,
  //   },
  data() {
    return {
      guessCity: "", // 当前城市
      guessCityId: "", // 当前城市id
      hotCity: [], // 热门城市列表
      groupCity: {}, // 所有城市列表
    };
  },
  created() {
    this.getCityGuess();
    this.getHostCity();
    this.getGroupCity();
  },
  computed: {
    // 将获取的数据按照A-Z排列
    sortGroupCity() {
      let sortObj = {};
      for (let i = 65; i <= 90; i++) {
        if (this.groupCity[String.fromCharCode(i)]) {
          sortObj[String.fromCharCode(i)] =
            this.groupCity[String.fromCharCode(i)];
        }
      }
      return sortObj;
    },
  },
  methods: {
    // 获取热门城市的数据
    async getCityGuess() {
      const res = await cityGuess();
      this.guessCity = res.name;
      this.guessCityId = res.id;
    //   console.log(this.guessCityId);
    },
    // 获取热门城市列表
    async getHostCity() {
      const res = await hotCity();
      this.hotCity = res;
    },
    async getGroupCity() {
      const res = await groupCity();
      this.groupCity = res;
    },
    // 标题的点击事件
    reload() {
      window.location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
.head_logo {
  left: 0.4em;
  font-weight: 400;
  @include sc(0.7rem, #fff);
  @include wh(2.3rem, 0.7rem);
  @include ct;
}
.city_nav {
  padding-top: 2.3rem;
  border-top: 1px solid $bc;
  background-color: #fff;
  margin-bottom: 0.4rem;
  .city_tip {
    @include fj;
    line-height: 1.45rem;
    padding: 0 0.45rem;
    span:nth-of-type(1) {
      @include sc(0.55rem, #666);
    }
    span:nth-of-type(2) {
      font-weight: 900;
      @include sc(0.475rem, #9f9f9f);
    }
  }
  .guess_city {
    @include fj;
    align-items: center;
    height: 1.8rem;
    padding: 0 0.45rem;
    border-top: 1px solid $bc;
    border-bottom: 2px solid $bc;
    @include font(0.75rem, 1.8rem);
    span:nth-of-type(1) {
      color: $blue;
    }
    .arrow_right {
      @include wh(0.6rem, 0.6rem);
      fill: #999;
    }
  }
}
#hot_city_container {
  background-color: #fff;
  margin-bottom: 0.4rem;
}
.cityListul {
  li {
    float: left;
    text-align: center;
    color: $blue;
    border-bottom: 0.025rem solid $bc;
    border-right: 0.025rem solid $bc;
    @include wh(25%, 1.75rem);
    @include font(0.6rem, 1.75rem);
  }
  li:nth-of-type(4n) {
    border-right: none;
  }
}
.city_title {
  color: #666;
  font-weight: 400;
  text-indent: 0.45rem;
  border-top: 2px solid $bc;
  border-bottom: 1px solid $bc;
  @include font(0.55rem, 1.45rem, "Helvetica Neue");
  span {
    @include sc(0.45rem, #999);
  }
}
.letter_classify_li {
  margin-bottom: 0.4rem;
  background-color: #fff;
  border-bottom: 1px solid $bc;
  .group_name_container {
    li {
      color: #666;
    }
  }
}
</style>

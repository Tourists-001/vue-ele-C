<template>
  <div class="city_container">
    <headTop :headTitle="cityName" go-back="true">
      <router-link to="/home" slot="changecity" class="change_city"
        >切换城市</router-link
      >
    </headTop>
    <!-- 搜索表单 -->
    <form class="city_form" v-on:submit.prevent>
      <div>
        <input
          type="search"
          name="city"
          placeholder="输入学校,商务楼,地址"
          class="city_input input_style"
          required
          v-model="inputValue"
        />
      </div>
      <div>
        <input
          type="submit"
          name="submit"
          class="city_submit input_style"
          @click="postPosition"
          value="提交"
        />
      </div>
    </form>
    <!-- 历史记录 -->
    <header v-if="historyTitle" class="pois_search_history">
      搜索历史记录
    </header>
    <ul class="getpois_ul">
      <li
        v-for="(item, i) in placeList"
        :key="i"
        @click="nextPage(i, item.geohash)"
      >
        <h4 class="pois_name ellipsis">{{ item.name }}</h4>
        <p class="pois_address ellipsis">{{ item.address }}</p>
      </li>
    </ul>
    <footer
      v-if="historyTitle && placeList.length"
      class="clear_all_history"
      @click="clearAll"
    >
      清空所有
    </footer>
    <div class="search_none_place" v-if="placeNone">很抱歉！无搜索结果</div>
  </div>
</template>

<script>
import { currentCity, searchPlace } from "@/api/city";
import { setStore, getStore, removeStore } from "@/config/nUtils";
export default {
  data() {
    return {
      inputValue: "",
      historyTitle: true,
      cityId: "",
      cityName: "",
      placeList: [],
      placeNone: false,
      placeHistory: [],
    };
  },
  mounted() {
    // 通过路由的id获取头部标题
    this.cityId = this.$route.params.cityId;
    currentCity(this.cityId).then((res) => (this.cityName = res.name));
    // 在本地获取数据
    this.initData();
  },
  methods: {
    // 在本地获取数据
    initData() {
      if (getStore("placeHistory")) {
        this.placeList = JSON.parse(getStore("placeHistory"));
      } else {
        this.placeList = [];
      }
    },
    // 清除历史记录
    clearAll() {
      removeStore("placeHistory");
      this.initData();
    },
    // 进入下一页,点击的时候判断是否已经有一次一样的记录存储了
    // 如果点击没有则新增,如果有则不必做重复的请求,判断完成进入下一页
    nextPage(index, geohash) {
      let history = getStore("placeHistory");
      let choosePlace = this.placeList[index];
      // 是否有本地缓存
      if (history) {
        // 如果有本地缓存,判断是否再次点击本地记录
        // 如果是,什么都不干
        let checkRepeat = false;
        this.placeHistory = JSON.parse(history);
        this.placeHistory.forEach((item) => {
          if (item.geohash === geohash) {
            checkRepeat = true;
          }
        });
        // 如果不是,添加到要本地存储的数组中去
        if (!checkRepeat) {
          // 添加存储本地
          this.placeHistory.push(choosePlace);
        }
      } else {
        // 没有本地存储(添加到要本地存储的数组中)
        this.placeHistory.push(choosePlace);
      }
      // 添加到本地
      setStore("placeHistory", this.placeHistory);
      this.$router.push({ path: "/msite", query: { geohash } });
    },
    // 发送搜索信息inputValue
    async postPosition() {
      // 简单判断是否有值
      if (this.inputValue.trim()) {
        const res = await searchPlace(this.cityId, this.inputValue);
        (this.historyTitle = false), (this.placeList = res);
        // 判断是否返回有数据的数据,如果没数据,则显示暂无数据
        this.placeNone = res.length ? false : true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
.city_container {
  padding-top: 2.35rem;
}
.change_city {
  right: 0.4rem;
  @include sc(0.6rem, #fff);
  @include ct;
}
.city_form {
  background-color: #fff;
  border-top: 1px solid $bc;
  border-bottom: 1px solid $bc;
  padding-top: 0.4rem;
  div {
    width: 90%;
    margin: 0.5rem auto;
    text-align: center;
    .input_style {
      border-bottom: 0.4rem;
      border-radius: 0.1rem;
      @include wh(100%, 1.4rem);
    }
    .city_input {
      border: 1px solid $bc;
      padding: 0 0.3rem;
      @include sc(0.65rem, #333);
    }
    .city_submit {
      background-color: $blue;
      @include sc(0.65rem, #fff);
    }
  }
}
.pois_search_history {
  border-top: 1px solid $bc;
  border-bottom: 1px solid $bc;
  padding-left: 0.5rem;
  @include font(0.475rem, 0.8rem);
}
.getpois_ul {
  background-color: #fff;
  border-top: 1px solid $bc;
  li {
    margin: 0 auto;
    border-bottom: 1px solid $bc;
    padding-top: 0.65rem;
    .pois_name {
      margin: 0 auto 0.35rem;
      width: 90%;
      @include sc(0.65rem, #333);
    }
    .pois_address {
      width: 90%;
      margin: 0 auto 0.55rem;
      @include sc(0.45rem, #999);
    }
  }
}
.search_none_place {
  margin: 0 auto;
  @include font(0.65rem, 1.75rem);
  color: #333;
  background-color: #fff;
  text-indent: 0.5rem;
}
.clear_all_history {
  @include sc(0.7rem, #666);
  text-align: center;
  line-height: 2rem;
  background-color: #fff;
}
</style>

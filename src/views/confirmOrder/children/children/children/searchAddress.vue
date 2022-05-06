<template>
  <div class="search_address_page">
    <section>
      <headTop head-title="搜索" :goBack="true"></headTop>
      <form class="search_form">
        <input
          type="search"
          name="search"
          placeholder="请输入小区/写字楼/学校等"
          v-model="searchValue"
        />
        <button @click.prevent="searchPlace">搜索</button>
      </form>
      <ul class="address_list" v-if="searchData">
        <li
          @click="choooedAddress(item)"
          v-for="(item, index) in searchData"
          :key="index"
        >
          <h4>{{ item.name }}</h4>
          <p>{{ item.address }}</p>
        </li>
      </ul>
      <div class="empty_tips" v-else>
        <p>找不到地址？</p>
        <p>尝试输入小区、写字楼或学校名</p>
        <p>详细地址（如门牌号等）可稍后输入哦</p>
      </div>
    </section>
  </div>
</template>

<script>
import { searchNearby } from "@/api/search";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      searchValue: "", // 搜索的内容
      searchData: [], // 搜索数据
    };
  },
  methods: {
    ...mapMutations(["CHOOSE_SEARCH_ADDRESS"]),
    // 搜索地址
    async searchPlace() {
      if (this.searchValue) {
        this.searchData = await searchNearby(this.searchValue);
      }
    },
    // 选中的地址
    choooedAddress(item) {
      this.CHOOSE_SEARCH_ADDRESS(item);
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";

.search_address_page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 204;
  overflow-y: auto;
  padding-top: 1.95rem;
  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}
.search_form {
  display: flex;
  padding: 0.7rem;
  input {
    @include sc(0.65rem, #999);
    flex: 4;
    background-color: #f1f1f1;
    margin-right: 0.6rem;
    height: 1.5rem;
    border-radius: 0.15rem;
    padding: 0 0.4rem;
  }
  button {
    flex: 1;
    @include sc(0.65rem, #fff);
    background-color: $blue;
    border-radius: 0.15rem;
  }
}
.address_list {
  padding: 0.7rem;
  li {
    padding: 0.7rem 0;
    border-bottom: 0.025rem solid #f5f5f5;
    line-height: 1rem;
    h4 {
      @include sc(0.75rem, #555);
    }
    p {
      @include sc(0.65rem, #999);
    }
  }
}
.empty_tips {
  @include center;
  width: 100%;
  p {
    @include sc(0.5rem, #aaa);
    line-height: 0.7rem;
    text-align: center;
  }
}
</style>

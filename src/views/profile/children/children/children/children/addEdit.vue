<template>
  <div class="rating_page">
    <headTop head-title="搜索地址" :goBack="true"></headTop>
    <section>
      <div class="add-detail">
        <input
          type="text"
          placeholder="请输入小区/写字楼/学校等"
          v-model="inputAddress"
        />
        <button @click="inputThing">确认</button>
      </div>
      <div class="warnpart">为了满足商家的送餐要求，建议您从列表中选择地址</div>
      <div class="point" v-show="warning">
        <p>找不到地址？</p>
        <p>请尝试输入小区、写字楼或学校名</p>
        <p>详细地址（如门牌号）可稍后输入哦。</p>
      </div>
    </section>
    <section class="poisearch-container" v-show="addressList">
      <ul>
        <li v-for="(item, i) in addressList" :key="i" @click="listClick(i)">
          <p>{{ item.name }}</p>
          <p>{{ item.address }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { searchNearby } from "@/api/search";
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      inputAddress: "",
      addressList: [],
      warning: true,
    };
  },
  created() {
      this.inputAddress = this.addAddress ? this.addAddress : this.inputAddress;
  },
  computed: {
      ...mapState(['addAddress'])
  },
  methods: {
    ...mapMutations(["SAVE_ADDDETAIL"]),
    async inputThing() {
      if (this.inputAddress) {
        const res = await searchNearby(this.inputAddress);
        this.addressList = res;
        this.warning = true;
        if (this.addressList.length > 0) {
          this.warning = false;
        }
      } else {
        this.warning = true;
      }
    },
    listClick(index) {
      this.SAVE_ADDDETAIL(this.addressList[index].name);
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
.rating_page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f2f2f2;
  z-index: 205;
  padding-top: 1.95rem;
  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}
.add-detail {
  @include fj(space-between);
  background: #fff;
  padding: 0.5rem;
  input {
    display: block;
    width: 11.8rem;
    padding: 0.4rem;
    background: #f2f2f2;
    border: 1px solid #ddd;
    @include borderRadius(5px);
    font-size: 0.6rem;
  }
  button {
    display: block;
    width: 3rem;
    background: #3199e8;
    @include sc(0.7rem, #fff);
    @include borderRadius(5px);
  }
}
.warnpart {
  background: #fff6e4;
  @include sc(0.62rem, #ff883f);
  text-align: center;
  padding: 0.2rem 0;
}
.point {
  @include center;
  width: 100%;
  p {
    width: 100%;
    text-align: center;
    @include sc(0.7rem, #969696);
    margin-bottom: 0.4rem;
  }
}
.poisearch-container {
  background: #f2f2f2;
  li {
    border-bottom: 1px solid #ccc;
    padding: 0.4rem;
    p {
      @include sc(0.65rem, #969696);
    }
    p:first-child {
      margin-bottom: 0.2rem;
    }
  }
  li:last-child {
    border: 0;
  }
}
</style>

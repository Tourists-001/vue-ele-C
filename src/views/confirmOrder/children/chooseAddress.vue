<template>
  <div class="rating_page">
    <headTop head-title="选择地址" :goBack="true"></headTop>
    <router-link
      to="/confirmOrder/chooseAddress/addAddress"
      class="add_icon_footer"
    >
      <img src="../../../images/add_address.png" height="24" width="24" />
      <span>新增收获地址</span>
    </router-link>
    <section id="scroll_section" class="scroll_container">
      <section class="list_container">
        <ul class="deliverable_address">
          <li
            v-for="(item, index) in deliverable"
            :key="index"
            @click.prevent.stop="chooseAddress(item, index)"
          >
            <svg
              class="choosed_address"
              :class="{ default_address: defaultIndex == index }"
            >
              <use
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xlink:href="#select"
              ></use>
            </svg>
            <div>
              <header>
                <span>{{ item.name }}</span
                ><span>{{ item.sex == 1 ? "男生" : "女生" }}</span
                ><span>{{ item.phone }}</span>
              </header>
              <div class="address_detail ellipsis">
                <span
                  v-if="item.tag"
                  :style="{ backgroundColor: iconColor(item.tag) }"
                  >{{ item.tag }}</span
                >
                <p>{{ item.address_detail }}</p>
              </div>
            </div>
          </li>
        </ul>
        <section id="out_delivery" v-if="deliverdisable.length">
          <header class="out_header">以下地址超出配送范围</header>
          <ul class="deliverable_address">
            <li v-for="(item, index) in deliverdisable" :key="index">
              <svg class="choosed_address">
                <use
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  xlink:href="#select"
                ></use>
              </svg>
              <div>
                <header>
                  <span>{{ item.name }}</span>
                  <span>{{ item.sex == 1 ? "先生" : "女士" }}</span>
                  <span>{{ item.phone }}</span>
                </header>
                <div class="address_detail ellipsis">
                  <span
                    v-if="item.tag"
                    :style="{ backgroundColor: '#ccc', color: '#fff' }"
                    >{{ item.tag }}</span
                  >
                  <p>{{ item.address_detail }}</p>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </section>
    </section>
    <alert-tip
      v-if="showAlert"
      @closeTip="showAlert = false"
      :alertText="alertText"
    ></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { getAddressList } from "@/api/shop";
export default {
  data() {
    return {
      showAlert: false,
      alertText: null,
      addressList: [],
      deliverable: [], // 有效地址
      deliverdisable: [], // 无效地址
    };
  },
  computed: {
    ...mapState(["userInfo", "addressIndex", "newAddress"]),
    // 选择地址
    defaultIndex() {
      if (this.addressList) {
        return this.addressIndex;
      } else {
        return 0;
      }
    },
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapMutations(["CHOOSE_ADDRESS"]),
    // 初始化信息
    async initData() {
      this.addressList = [];
      this.deliverable = [];
      this.deliverdisable = [];
      if (this.userInfo && this.userInfo.user_id) {
        this.addressList = await getAddressList(this.userInfo.user_id);
        console.log(this.addressList);
        this.addressList.forEach((item, index) => {
          if (item.is_deliverable) {
            this.deliverable.push(item);
          } else {
            this.deliverdisable.push(item);
          }
        });
      }
    },
    iconColor(name) {
      switch (name) {
        case "公司":
          return "#4cd964";
        case "学校":
          return "#3190e8";
      }
    },
    chooseAddress(address, index) {
      this.CHOOSE_ADDRESS({ address, index });
      //   console.log("index");
      this.$router.go(-1);
    },
  },
  watch: {
    userInfo: function (value) {
      if (value && value.user_id) {
        this.initData();
      }
    },
    newAddress: function (value) {
      this.initData();
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
  background-color: #fff;
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
  overflow-y: auto;
}
.list_cotainer {
  padding-bottom: 5rem;
}
.add_icon_footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2.5rem;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 204;
  span {
    @include sc(0.7rem, $blue);
    margin-left: 0.3rem;
  }
}
.deliverable_address {
  background-color: #fff;
  li {
    display: flex;
    align-items: center;
    border-bottom: 0.025rem solid #f5f5f5;
    padding: 0.7rem;
    line-height: 1rem;
    .choosed_address {
      @include wh(0.8rem, 0.8rem);
      fill: #4cd964;
      margin-right: 0.4rem;
      opacity: 0;
    }
    .default_address {
      opacity: 1;
    }
    header {
      @include sc(0.7rem, #333);
      span:nth-of-type(1) {
        font-size: 0.8rem;
        font-weight: bold;
      }
    }
    .address_detail {
      width: 100%;
      display: flex;
      align-items: center;
      span {
        @include sc(0.5rem, #fff);
        border-radius: 0.15rem;
        background-color: #ff5722;
        height: 0.6rem;
        line-height: 0.6rem;
        padding: 0 0.2rem;
        margin-right: 0.3rem;
      }
      p {
        @include sc(0.6rem, #777);
      }
    }
  }
}
#out_delivery {
  .out_header {
    @include sc(0.6rem, #666);
    line-height: 1.5rem;
    padding-left: 0.5rem;
    background-color: #f5f5f5;
  }
  * {
    color: #ccc;
  }
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
</style>

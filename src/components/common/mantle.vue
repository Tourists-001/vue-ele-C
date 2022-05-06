<template>
  <div class="active_mask" v-if="isShowMask">
    <div class="active_title">
      <div class="seller_name">
        {{ shopDetail.name }}
      </div>
      <div class="star-wrapper">
        <ratingStart :ranting="10"></ratingStart>
      </div>
    </div>
    <div class="seller_support">
      <div class="support_title">
        <div class="line"></div>
        <div style="color: #fff; padding: 0 1rem">优惠信息</div>
        <div class="line"></div>
      </div>
      <div class="support_content">
        <div
          class="support_item"
          v-for="(item, i) in shopDetail.supports"
          :key="i"
        >
          <span class="support_icon">{{ item.icon_name }}</span>
          <span>{{ item.description }}</span>
        </div>
      </div>
    </div>
    <div class="seller_bulletin">
      <div class="bulletin_title">
        <div class="line"></div>
        <div style="color: #fff; padding: 0 1rem">商家公告</div>
        <div class="line"></div>
      </div>
      <div
        class="bulletin_text"
        v-for="(item, i) in shopDetail.activities"
        :key="i"
      >
        {{ item.description }}
      </div>
    </div>
    <div class="mask_close" @click="closeClick">
      <span class="icon-close"></span>
      <span class="icon-close icon_c"></span>
    </div>
  </div>
</template>

<script>
import ratingStart from "@/components/common/ratingStart";
import { mapState } from "vuex";
export default {
  components: {
    ratingStart,
  },
  props: ["isShowMask"],
  computed: {
    ...mapState(["shopDetail"]),
  },
  methods: {
    closeClick() {
      this.$emit("closeClick", false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
$components: header;
.active_mask {
  color: #fff !important;
  font-weight: bold;
  padding: 40px 0 0;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 9900;
  text-align: center;
  background-color: rgba(7, 17, 27, 0.8);
  & > div {
    color: #fff;
  }
}
.seller_name {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #fff;
  font-size: 20px;
}

.seller_support {
  margin-top: 30px;
  .support_title {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 15px;
  }
  .support_content {
    text-align: left;
    padding: 20px;
    .support_item {
      color: #fff !important;
      font-size: 16px;
      padding: 7px;
      & > span {
        color: #fff !important;
        vertical-align: middle;
      }
      .support_icon {
        margin-right: 8px;
        display: inline-block;
        width: 15px;
        height: 15px;
        vertical-align: top;
        background-size: 15px 15px;
        background-repeat: no-repeat;
      }
    }
  }
}

.seller_bulletin {
  margin-top: 10px;
  .bulletin_title {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 15px;
  }
  .bulletin_text {
    padding: 20px;
    font-size: 16px;
    color: #fff;
    line-height: 20px;
    text-align: left;
  }
}
.mask_close {
  position: absolute;
  font-size: 30px;
  //   color: rgba(255, 255, 255, 0.5);
  bottom: 20px;
  width: 50px;
  height: 50px;
  //   background-color: red;
}
.line {
  width: 100px;
  height: 2px;
  background-color: #61676e;
}
.icon-close {
  position: absolute;
  width: 4px;
  height: 30px;
  left: 25px;
  top: 11px;
  background-color: #fff;
  border: 1px solid #fff;
  z-index: 999;
  transform: rotate(228deg);
  border-radius: 37px;
}
.icon_c {
  position: absolute;
  left: 25px;
  top: 11px;
  transform: rotate(-228deg);
}
</style>

<template>
  <div class="page">
    <headTop head-title="我的余额" :goBack="true"></headTop>
    <section class="content_container">
      <section class="content">
        <header class="content_header">
          <span class="content_title_style">当前余额</span>
          <section class="content_description">
            <img src="../../images/description.png" height="24" width="24" />
            <router-link to="/balance/detail" class="content_title_style"
              >余额说明</router-link
            >
          </section>
        </header>
        <p class="content_num">
          <span>0.00</span>
          <span>元</span>
        </p>
        <div class="promit_button">提现</div>
      </section>
    </section>
    <p class="deal_detail">交易明细</p>
    <div class="no_log">
      <img src="../../images/no-log.png" />
      <p>暂无明细记录</p>
    </div>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import alertTip from "@/components/common/alertTip";
export default {
  components: {
    alertTip,
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
.page {
  padding-top: 1.95rem;
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}
.content_container {
  padding: 0.3rem;
  background-color: $blue;
  .content {
    padding: 0.4rem;
    background-color: #fff;
    border-radius: 0.15rem;
    .content_header {
      @include fj;
      font-size: 0.55rem;
      .content_description {
        display: flex;
        align-items: center;
        img {
          @include wh(0.6rem, 0.6rem);
          margin-right: 0.2rem;
        }
        .content_title_style {
          color: $blue;
        }
      }
      .content_title_style {
        color: #666;
      }
    }
    .content_num {
      span:nth-of-type(1) {
        @include sc(1.8rem, #333);
      }
      span:nth-of-type(2) {
        @include sc(0.7rem, #333);
      }
    }
    .promit_button {
      @include wh(100%, 2rem);
      @include sc(0.8rem, #fff);
      border-radius: 0.15rem;
      line-height: 2rem;
      margin-top: 1rem;
      text-align: center;
      background-color: #ccc;
    }
  }
}
.deal_detail {
  @include sc(0.6rem, #999);
  line-height: 2rem;
  padding-left: 0.5rem;
}
.no_log {
  text-align: center;
  margin-top: 1rem;
  img {
    @include wh(8rem, 5rem);
  }
  p {
    margin-top: 0.5rem;
    @include sc(0.7rem, #666);
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

<template>
  <div class="safe_shop">
    <headTop head-title="食品监督安全公示" :goBack="true"></headTop>
    <!-- 公示 -->
    <section id="scroll_section" class="scroll_container">
      <section>
        <section class="shop_status_container">
          <header>食品监督安全公示</header>
          <section class="shop_status_detail">
            <div>
              <svg class="shop_status" v-if="shopDetail.status == 1">
                <use
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  xlink:href="#res-well"
                ></use>
              </svg>
              <svg class="res-well" v-else>
                <use
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  xlink:href="#res-bad"
                ></use>
              </svg>
            </div>
            <!-- 督察结果 -->
            <div class="check_date">
              <p>
                <span>监督检查结果：</span>
                <span class="shop_status_well" v-if="shopDetail.status == 1"
                  >良好</span
                >
                <span class="shop_status_bad" v-else>差</span>
              </p>
              <p>
                <span>检查日期：</span>
                <span>{{
                  shopDetail.identification.identificate_date &&
                  shopDetail.identification.identificate_date.split("T")[0]
                }}</span>
              </p>
            </div>
          </section>
        </section>
        <!-- 工商登记信息 -->
        <section class="shop_status_container">
          <header>
            <span>工商登记信息</span>
          </header>
          <ul>
            <li>
              <p>企业名称</p>
              <p>{{ shopDetail.identification.company_name }}</p>
            </li>
            <li>
              <p>工商执照注册号</p>
              <p>{{ shopDetail.identification.identificate_agency }}</p>
            </li>
            <li>
              <p>注册资本</p>
              <p>{{ shopDetail.identification.registered_number }}</p>
            </li>
            <li>
              <p>注册地址</p>
              <p>{{ shopDetail.identification.registered_address }}</p>
            </li>
            <li>
              <p>属地监管所</p>
              <p>{{ shopDetail.identification.registered_principal }}</p>
            </li>
            <li>
              <p>法定代表人</p>
              <p>{{ shopDetail.identification.legal_person }}</p>
            </li>
            <li>
              <p>经营范围</p>
              <p>{{ shopDetail.identification.operation_period }}</p>
            </li>
          </ul>
        </section>
        <section class="shop_status_container">
          <header>餐饮许可证</header>
          <ul>
            <li>
              <p>营业范围</p>
              <p>{{ shopDetail.identification.operation_period }}</p>
            </li>
            <li>
              <p>许可证有效期</p>
              <p>{{ shopDetail.identification.licenses_date }}</p>
            </li>
            <li>
              <p>许可证号</p>
              <p>{{ shopDetail.identification.licenses_number }}</p>
            </li>
            <li>
              <p>发证时间</p>
              <p>{{ shopDetail.identification.licenses_scope }}</p>
            </li>
            <li>
              <p>发证机关</p>
              <p>{{ shopDetail.identification.registered_principal }}</p>
            </li>
          </ul>
        </section>
        <section class="license_img shop_status_container">
          <header>许可证书</header>
          <div class="img_container">
            <img
              :src="imgBaseUrl + shopDetail.license.business_license_image"
              alt=""
            />
            <img
              :src="imgBaseUrl + shopDetail.license.business_license_image"
              alt=""
            />
          </div>
        </section>
      </section>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getImgPath } from "@/mixin/resImg";
import BScroll from "better-scroll";
import { imgBaseUrl } from "@/config/env";
export default {
  data() {
    return {
      imgBaseUrl,
      licenseImg: "",
      showlicenseImg: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      new BScroll("#scroll_section", {
        deceleration: 0.001,
        bounce: true,
        swipeTime: 1800,
        click: true,
      });
    });
  },
  mixins: [getImgPath],
  computed: {
    ...mapState(["shopDetail"]),
  },
  methods: {
    showLicenseImg(img) {
      this.licenseImg = img;
      this.showlicenseImg = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
.safe_shop {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 105;
  padding-top: 1.95rem;
  background-color: #ebebeb;
}
.scroll_container {
  @include wh(100%, 100%);
}
ul {
  margin-left: 1rem;
  padding: 0.4rem 0;
  li {
    margin-bottom: 0.4rem;
    p {
      line-height: 1rem;
    }
    p:nth-of-type(1) {
      @include sc(0.55rem, #333);
    }
    p:nth-of-type(2) {
      @include sc(0.5rem, #999);
    }
  }
}
.shop_status_container {
  background-color: #fff;
  margin-bottom: 0.4rem;
  header {
    line-height: 1.8rem;
    padding: 0 0.6rem;
    border-bottom: 0.025rem solid #f1f1f1;
    @include sc(0.75rem, #333);
  }
  .shop_status_detail {
    display: flex;
    padding: 0.6rem;
    svg {
      @include wh(2rem, 2rem);
      margin-right: 0.6rem;
    }
    .check_date {
      span {
        @include sc(0.55rem, #666);
      }
      .shop_status_well {
        color: rgb(126, 211, 33);
      }
      .shop_status_bad {
        color: red;
      }
    }
  }
}
.license_img {
  padding: 0.6rem;
  background-color: #fff;
  padding-bottom: 8rem;
  .img_container {
    background-color: #ebebeb;
    img {
      width: 40%;
      height: auto;
      margin: 0.4rem;
      vertical-align: middle;
    }
  }
}
</style>

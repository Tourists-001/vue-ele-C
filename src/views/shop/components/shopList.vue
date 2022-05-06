<template>
  <section class="food_container">
    <section class="menu_container">
      <section class="menu_left" id="wrapper_menu" ref="wrapperMenu">
        <ul>
          <li
            class="menu_left_li"
            v-for="(item, index) in menuList"
            :key="index"
            :class="{ activity_menu: index == menuIndex }"
            @click="chooseMenu(index, $event)"
          >
            <img :src="getImgPath(item.icon_url)" v-if="item.icon_url" />
            <span>{{ item.name }}</span>
            <span
              v-if="categoryNum[index] && item.type == 1"
              class="category_num"
              >{{ categoryNum[index] }}</span
            >
          </li>
        </ul>
      </section>
      <section class="menu_right" ref="menuFoodList">
        <ul>
          <li v-for="(item, index) in menuList" :key="index">
            <header class="menu_detail_header">
              <section class="menu_detail_header_left">
                <strong class="menu_item_title">{{ item.name }}</strong>
                <span class="menu_item_description">{{
                  item.description
                }}</span>
              </section>
              <span
                class="menu_detail_header_right"
                @click="showTitleDetail(index)"
              ></span>
              <p class="description_tip" v-if="index == TitleDetailIndex">
                <span>{{ item.name }}</span>
                {{ item.description }}
              </p>
            </header>
            <section
              v-for="(foods, index) in item.foods"
              :key="index"
              class="menu_detail_list"
              @click="goFoodDetail(foods)"
            >
              <router-link
                :to="{
                  path: '/foodDetail',
                  query: {
                    image_path: foods.image_path,
                    description: foods.description,
                    month_sales: foods.month_sales,
                    name: foods.name,
                    rating: foods.rating,
                    rating_count: foods.rating_count,
                    satisfy_rate: foods.satisfy_rate,
                    foods,
                    shopId,
                  },
                }"
                tag="div"
                class="menu_detail_link"
              >
                <section class="menu_food_img">
                  <img :src="imgBaseUrl + foods.image_path" alt="" />
                </section>
                <section class="menu_food_description">
                  <h3 class="food_description_head">
                    <strong class="description_foodname">{{
                      foods.name
                    }}</strong>
                    <ul v-if="foods.attributes.length" class="attributes_ul">
                      <li
                        v-if="attribute"
                        v-for="(attribute, foodIndex) in foods.attributes"
                        :key="foodIndex"
                        :style="{
                          color: '#' + attribute.icon_color,
                          borderColor: '#' + attribute.icon_color,
                        }"
                        :class="{
                          attribute_new: attribute.icon_name == '新',
                        }"
                      >
                        <p
                          :style="{
                            color:
                              attribute.icon_name == '新'
                                ? '#fff'
                                : '#' + attribute.icon_color,
                          }"
                        >
                          {{
                            attribute.icon_name == "新"
                              ? "新品"
                              : attribute.icon_name
                          }}
                        </p>
                      </li>
                    </ul>
                  </h3>
                  <p class="food_description_content">
                    {{ foods.description }}
                  </p>
                  <p class="food_description_sale_rating">
                    <span>月售{{ foods.month_sales }}份</span>
                    <span>好评率{{ foods.satisfy_rate }} %</span>
                  </p>
                  <p v-if="foods.activity" class="food_activity">
                    <span
                      :style="{
                        color: '#' + foods.activity.image_text_color,
                        borderColor: '#' + foods.activity.icon_color,
                      }"
                      >{{ foods.activity.image_text }}</span
                    >
                  </p>
                </section>
              </router-link>
              <footer class="menu_detail_footer">
                <section class="food_price">
                  <span>¥</span>
                  <span>{{ foods.specfoods[0].price }}</span>
                  <span v-if="foods.specifications.length">起</span>
                </section>
                <buyCar
                  :shopId="shopId"
                  :foods="foods"
                  @moveInCart="listenInCart"
                  @showChooseList="showChooseList"
                  @showReduceTip="showReduceTip"
                  @showMoveDot="showMoveDotFun"
                ></buyCar>
              </footer>
            </section>
          </li>
        </ul>
      </section>
    </section>
    <shopCart
      :menuList="menuList"
      :shopId="shopId"
      ref="cartContainer"
    ></shopCart>
    <!-- 弹出框 -->
    <section>
      <transition name="fade">
        <div class="specs_cover" @click="showChooseList" v-if="showSpecs"></div>
      </transition>
      <transition name="fadeBounce">
        <div class="specs_list" v-if="showSpecs">
          <header class="specs_list_header">
            <h4 class="ellipsis"></h4>
            <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              class="specs_cancel"
              @click="showChooseList"
            >
              <line
                x1="0"
                y1="0"
                x2="16"
                y2="16"
                stroke="#666"
                stroke-width="1.2"
              />
              <line
                x1="0"
                y1="16"
                x2="16"
                y2="0"
                stroke="#666"
                stroke-width="1.2"
              />
            </svg>
          </header>
          <section class="specs_details">
            <h5 class="specs_detail_title">
              {{ choosedFoods.specifications[0].name }}
            </h5>
            <ul>
              <li
                v-for="(item, itemIndex) in choosedFoods.specifications[0]
                  .values"
                :class="{ specs_activity: itemIndex == specsIndex }"
                @click="chooseSpecs(itemIndex)"
              >
                {{ item }}
              </li>
            </ul>
          </section>
          <footer class="specs_footer">
            <div class="specs_price">
              <span>¥ </span>
              <span>{{ choosedFoods.specfoods[specsIndex].price }}</span>
            </div>
            <div
              class="specs_addto_cart"
              @click="
                addSpecs(
                  choosedFoods.category_id,
                  choosedFoods.item_id,
                  choosedFoods.specfoods[specsIndex].food_id,
                  choosedFoods.specfoods[specsIndex].name,
                  choosedFoods.specfoods[specsIndex].price,
                  choosedFoods.specifications[0].values[specsIndex],
                  choosedFoods.specfoods[specsIndex].packing_fee,
                  choosedFoods.specfoods[specsIndex].sku_id,
                  choosedFoods.specfoods[specsIndex].stock
                )
              "
            >
              加入购物车
            </div>
          </footer>
        </div>
      </transition>
    </section>
    <transition name="fade">
      <p class="show_delete_tip" v-if="showDeleteTip">
        多规格商品只能去购物车删除哦
      </p>
    </transition>
    <transition
      appear
      @after-appear="afterEnter"
      @before-appear="beforeEnter"
      v-for="(item, index) in showMoveDot"
    >
      <span class="move_dot" v-if="item">
        <svg class="move_liner">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#cart-add"
          ></use>
        </svg>
      </span>
    </transition>

    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
import { getImgPath } from "@/mixin/resImg";
import { imgBaseUrl } from "@/config/env";
import { animate } from "@/config/nUtils";
import buyCar from "@/components/common/buyCar";
import shopCart from "@/views/shop/components/shopCart";
import { mapMutations } from "vuex";
export default {
  props: ["menuList", "showLoading", "shopId"],
  components: {
    buyCar,
    shopCart,
  },
  data() {
    return {
      menuIndex: 0, //已选菜单索引值，默认为0
      categoryNum: [], //商品类型右上角已加入购物车的数量
      shopListTop: [], //商品列表的高度集合
      TitleDetailIndex: null, //点击展示列表头部详情
      imgBaseUrl,
      foodScroll: null, //食品列表scroll
      timer: null,
      showMoveDot: [], //控制下落的小圆点显示隐藏
      showDeleteTip: false, //多规格商品点击减按钮，弹出提示框
      choosedFoods: null, //当前选中视频数据
      showSpecs: false,
      specsIndex: 0,
      receiveInCart: false, //购物车组件下落的圆点是否到达目标位置
    };
  },
  mixins: [getImgPath],
  mounted() {
    if (this.menuList) {
      this.getFoodListHeight();
    }
  },
  //    销毁组件之前，移除事件监听
  beforeDestroy() {
    this.$refs.menuFoodList.removeEventListener("scroll", this.onScrollBy);
  },
  methods: {
    ...mapMutations(["ADD_CART", "DETAIL_FOODS"]),
    //获取食品列表的高度，存入shopListTop
    getFoodListHeight() {
      const listContainer = this.$refs.menuFoodList;
      if (listContainer) {
        const listArr = Array.from(listContainer.children[0].children);
        listArr.forEach((item, index) => {
          this.shopListTop[index] = item.offsetTop;
        });
      }
      this.$refs.menuFoodList.addEventListener("scroll", this.onScrollBy);
    },
    onScrollBy() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.shopListTop.forEach((item, index) => {
          if (this.$refs.menuFoodList.scrollTop >= item) {
            this.menuIndex = index;
          }
        });
      }, 500);
    },
    chooseMenu(index) {
      this.menuIndex = index;
      animate(
        this.$refs.menuFoodList,
        { scrollTop: this.shopListTop[index] },
        900,
        "ease - out"
      );
      this.IsCurrentDom(index);
    },
    // 判断当前滚动条的位置
    IsCurrentDom(index) {
      const currentDom = this.$refs.wrapperMenu.children[0].children[index];
      if (
        currentDom.offsetTop >= currentDom.clientHeight * 6 ||
        currentDom.offsetTop <= this.$refs.wrapperMenu.scrollTop
      ) {
        animate(
          this.$refs.wrapperMenu,
          { scrollTop: currentDom.offsetTop / 2 },
          900,
          "ease - out"
        );
      }
    },
    // 标题的显示和隐藏
    showTitleDetail(index) {
      if (this.TitleDetailIndex == index) {
        this.TitleDetailIndex = null;
      } else {
        this.TitleDetailIndex = index;
      }
    },
    // 移出购物车的回调
    showMoveDotFun(showMoveDot, elLeft, elBottom) {
      this.showMoveDot = [...this.showMoveDot, ...showMoveDot];
      this.elLeft = elLeft;
      this.elBottom = elBottom;
    },
    // 显示规格列表的回调
    showChooseList(foods) {
      if (foods) {
        this.choosedFoods = foods;
      }
      this.showSpecs = !this.showSpecs;
      this.specsIndex = 0;
    },
    // 点击多规格商品的减按钮，弹出提示的回调
    showReduceTip() {
      this.showDeleteTip = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.showDeleteTip = false;
      }, 3000);
    },
    chooseSpecs(index) {
      this.specsIndex = index;
    },
    //多规格商品加入购物车
    addSpecs(
      category_id,
      item_id,
      food_id,
      name,
      price,
      specs,
      packing_fee,
      sku_id,
      stock
    ) {
      this.ADD_CART({
        shopid: this.shopId,
        category_id,
        item_id,
        food_id,
        name,
        price,
        specs,
        packing_fee,
        sku_id,
        stock,
      });
      this.showChooseList();
    },
    //监听圆点是否进入购物车
    listenInCart() {
      if (!this.receiveInCart) {
        this.receiveInCart = true;
        // console.log(this.$refs.cartContainer);
        this.$refs.cartContainer.$el.addEventListener("animationend", () => {
          this.receiveInCart = false;
        });
        this.$refs.cartContainer.$el.addEventListener(
          "webkitAnimationEnd",
          () => {
            this.receiveInCart = false;
          }
        );
      }
    },
    beforeEnter(el) {
      el.style.transform = `translate3d(0,${
        37 + this.elBottom - this.windowHeight
      }px,0)`;
      el.children[0].style.transform = `translate3d(${this.elLeft - 30}px,0,0)`;
      el.children[0].style.opacity = 0;
    },
    afterEnter(el) {
      el.style.transform = `translate3d(0,0,0)`;
      el.children[0].style.transform = `translate3d(0,0,0)`;
      el.style.transition =
        "transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)";
      el.children[0].style.transition = "transform .55s linear";
      this.showMoveDot = this.showMoveDot.map((item) => false);
      el.children[0].style.opacity = 1;
      el.children[0].addEventListener("transitionend", () => {
        this.listenInCart();
      });
      el.children[0].addEventListener("webkitAnimationEnd", () => {
        this.listenInCart();
      });
    },
    goFoodDetail(item) {
      this.DETAIL_FOODS(item);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
.food_container {
  display: flex;
  flex: 1;
  padding-bottom: 2rem;
  overflow: hidden;
}
.menu_container {
  display: flex;
  flex: 1;
  overflow-y: hidden;
  position: relative;
  .menu_left {
    width: 3.8rem;
    height: 20rem;
    overflow: auto;
    .menu_left_li {
      padding: 0.7rem 0.3rem;
      border-bottom: 0.025rem solid #ededed;
      box-sizing: border-box;
      border-left: 0.15rem solid #f8f8f8;
      position: relative;
      img {
        @include wh(0.5rem, 0.6rem);
      }
      span {
        @include sc(0.6rem, #666);
      }
      .category_num {
        position: absolute;
        top: 0.1rem;
        right: 0.1rem;
        background-color: #ff461d;
        line-height: 0.6rem;
        text-align: center;
        border-radius: 50%;
        border: 0.025rem solid #ff461d;
        min-width: 0.6rem;
        height: 0.6rem;
        @include sc(0.5rem, #fff);
        font-family: Helvetica Neue, Tahoma, Arial;
      }
    }
    .activity_menu {
      border-left: 0.15rem solid #3190e8;
      background-color: #fff;
      span:nth-of-type(1) {
        font-weight: bold;
      }
    }
  }
}
.menu_right {
  transition: all 0.5s ease-in;
  flex: 4;
  overflow-y: auto;
  .menu_detail_header {
    width: 100%;
    padding: 0.4rem;
    position: relative;
    @include fj;
    align-items: center;
    .menu_detail_header_left {
      width: 11rem;
      white-space: nowrap;
      z-index: 999;
      overflow: hidden;
      .menu_item_title {
        @include sc(0.7rem, #666);
        font-weight: bold;
        margin-right: 0.5rem;
      }
      .menu_item_description {
        @include sc(0.5rem, #999);
        width: 30%;
        overflow: hidden;
      }
    }
    .menu_detail_header_right {
      @include wh(0.5rem, 1rem);
      display: block;
      @include bis("~@/images/icon_point.png");
      background-size: 100% 0.4rem;
      background-position: left center;
    }
    .description_tip {
      background-color: #39373a;
      opacity: 0.95;
      @include sc(0.5rem, #fff);
      position: absolute;
      top: 1.5rem;
      z-index: 14;
      width: 8rem;
      right: 0.2rem;
      padding: 0.5rem 0.4rem;
      border: 1px;
      border-radius: 0.2rem;
      span {
        color: #fff;
        line-height: 0.6rem;
        font-size: 0.55rem;
      }
    }
    .description_tip::after {
      content: "";
      position: absolute;
      @include wh(0.4rem, 0.4rem);
      background-color: #39373a;
      top: -0.5rem;
      right: 0.7rem;
      transform: rotate(-45deg) translateY(0.41rem);
    }
  }
  .menu_detail_list {
    background-color: #fff;
    padding: 0.6rem 0.4rem;
    border-bottom: 1px solid #f8f8f8;
    position: relative;
    overflow: hidden;
    .menu_detail_link {
      display: flex;
      .menu_food_img {
        margin-right: 0.4rem;
        img {
          @include wh(2rem, 2rem);
          display: block;
        }
      }
      .menu_food_description {
        width: 100%;
        .food_description_head {
          @include fj;
          margin-bottom: 0.2rem;
          .description_foodname {
            @include sc(0.7rem, #333);
          }
          .attributes_ul {
            display: flex;
            li {
              font-size: 0.3rem;
              height: 0.6rem;
              line-height: 0.35rem;
              padding: 0.1rem;
              border: 1px solid #666;
              border-radius: 0.3rem;
              margin-right: 0.1rem;
              transform: scale(0.8);
              p {
                white-space: nowrap;
              }
            }
            .attribute_new {
              position: absolute;
              top: 0;
              left: 0;
              background-color: #4cd964;
              @include wh(2rem, 2rem);
              display: flex;
              align-items: flex-end;
              transform: rotate(-45deg) translate(-0.1rem, -1.5rem);
              border: none;
              border-radius: 0;
              p {
                @include sc(0.4rem, #fff);
                text-align: center;
                flex: 1;
                transform: scale(0.8) translate(0.1rem, -0.1rem);
              }
            }
          }
        }
        .food_description_content {
          @include sc(0.5rem, #999);
          line-height: 0.6rem;
        }
        .food_description_sale_rating {
          line-height: 0.8rem;
          span {
            @include sc(0.5rem, #333);
          }
        }
        .food_activity {
          line-height: 0.4rem;
          span {
            font-size: 0.3rem;
            border: 1px solid currentColor;
            border-radius: 0.3rem;
            padding: 0.08rem;
            display: inline-block;
            transform: scale(0.8);
            margin-left: -0.35rem;
          }
        }
      }
    }
    .menu_detail_footer {
      margin-left: 2.4rem;
      font-size: 0;
      margin-top: 0.3rem;
      @include fj;
      .food_price {
        span {
          font-family: "Helvetica Neue", Tahoma, Arial;
        }
        span:nth-of-type(1) {
          @include sc(0.5rem, #f60);
          margin-right: 0.05rem;
        }
        span:nth-of-type(2) {
          @include sc(0.7rem, #f60);
          font-weight: bold;
          margin-right: 0.3rem;
        }
        span:nth-of-type(3) {
          @include sc(0.5rem, #666);
        }
      }
    }
  }
}
.specs_cover {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 17;
}
.specs_list {
  position: fixed;
  top: 35%;
  left: 15%;
  width: 70%;
  background-color: #fff;
  z-index: 18;
  border: 1px;
  border-radius: 0.2rem;
  .specs_list_header {
    h4 {
      @include sc(0.7rem, #222);
      font-weight: normal;
      text-align: center;
      padding: 0.5rem;
    }
    .specs_cancel {
      position: absolute;
      right: 0.5rem;
      top: 0.5rem;
    }
  }
  .specs_details {
    padding: 0.5rem;
    .specs_details_title {
      @include sc(0.6rem, #666);
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0.4rem 0;
      li {
        font-size: 0.6rem;
        padding: 0.3rem 0.5rem;
        border: 0.025rem solid #ddd;
        border-radius: 0.2rem;
        margin-right: 0.5rem;
        margin-bottom: 0.2rem;
      }
      .specs_activity {
        border-color: #3199e8;
        color: #3199e8;
      }
    }
  }
  .specs_footer {
    @include fj;
    align-items: center;
    background-color: #f9f9f9;
    padding: 0.5rem;
    border: 1px;
    border-bottom-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
    .specs_price {
      span {
        color: #ff6000;
      }
      span:nth-of-type(1) {
        font-size: 0.5rem;
      }
      span:nth-of-type(2) {
        font-size: 0.8rem;
        font-weight: bold;
        font-family: Helvetica Neue, Tahoma;
      }
    }
    .specs_addto_cart {
      @include wh(4rem, 1.3rem);
      background-color: #3199e8;
      border: 1px;
      border-radius: 0.15rem;
      @include sc(0.6rem, #fff);
      text-align: center;
      line-height: 1.3rem;
    }
  }
}
.show_delete_tip {
  position: fixed;
  top: 50%;
  left: 15%;
  width: 70%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 18;
  @include sc(0.65rem, #fff);
  text-align: center;
  padding: 0.5rem 0;
  border: 1px;
  border-radius: 0.25rem;
}
.move_dot {
  position: fixed;
  bottom: 30px;
  left: 30px;

  svg {
    @include wh(0.9rem, 0.9rem);
    fill: #3190e8;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.fade-choose-enter-active,
.fade-choose-leave-active {
  transition: opacity 0.5s;
}
.fade-choose-leave,
.fade-choose-leave-active {
  display: none;
}
.fade-choose-enter,
.fade-choose-leave-active {
  opacity: 0;
}
</style>

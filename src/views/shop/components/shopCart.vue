<template>
  <div>
    <section class="buy_cart_container">
      <section class="cart_icon_num" @click="toggleCartList">
        <div
          class="cart_icon_container"
          ref="cartContainer"
          :class="{ cart_icon_activity: totalPrice > 0 }"
        >
          <span v-if="totalNum" class="cart_list_length">{{ totalNum }}</span>
          <svg class="cart_icon">
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#cart-icon"
            ></use>
          </svg>
        </div>
        <div class="cart_num">
          <div>¥{{ totalPrice }}</div>
          <div>配送费¥{{ deliveryFee }}</div>
        </div>
      </section>
      <section
        class="gotopay"
        :class="{ gotopay_acitvity: minimumOrderAmount <= 0 }"
      >
        <span class="gotopay_button_style" v-if="minimumOrderAmount > 0"
          >还差${{ minimumOrderAmount }}起送</span
        >
        <router-link
          :to="{ path: '/confirmOrder', query: { geohash, shopId } }"
          class="gotopay_button_style"
          v-else
          >去结算</router-link
        >
      </section>
    </section>
    <transition name="toggle-cart">
      <section
        class="cart_food_list"
        v-show="showCartList && cartFoodList.length"
      >
        <header>
          <h4>购物车</h4>
          <div @click="clearCart">
            <svg>
              <use
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xlink:href="#cart-remove"
              ></use>
            </svg>
            <span class="clear_cart">清空</span>
          </div>
        </header>
        <section class="cart_food_details" id="cartFood">
          <ul>
            <li class="cart_food_li" v-for="(item, i) in cartFoodList" :key="i">
              <div class="cart_list_num">
                <p class="ellipsis">{{ item.name }}</p>
                <p class="ellipsis">{{ item.specs }}</p>
              </div>
              <div class="cart_list_price">
                <span>$</span>
                <span>{{ item.price }}</span>
              </div>
              <section class="cart_list_control">
                <span
                  @click="
                    removeOutCart(
                      item.category_id,
                      item.item_id,
                      item.food_id,
                      item.name,
                      item.price,
                      item.specs
                    )
                  "
                >
                  <svg>
                    <use
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xlink:href="#cart-minus"
                    ></use>
                  </svg>
                </span>
                <span class="cart_num">{{ item.num }}</span>
                <svg
                  class="cart_add"
                  @click="
                    addToCart(
                      item.category_id,
                      item.item_id,
                      item.food_id,
                      item.name,
                      item.price,
                      item.specs
                    )
                  "
                >
                  <use
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xlink:href="#cart-add"
                  ></use>
                </svg>
              </section>
            </li>
          </ul>
        </section>
      </section>
    </transition>
    <transition name="fade">
      <div
        class="screen_cover"
        v-show="showCartList && cartFoodList.length"
        @click="toggleCartList"
      ></div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: ["menuList", "shopId"],
  data() {
    return {
      geohash: "", //geohash位置信息
      totalNum: "",
      totalPrice: 0, //总共价格
      cartFoodList: [], //购物车商品列表
      showCartList: false,
    };
  },
  created() {
    this.geohash = this.$route.query.geohash;
  },
  watch: {
    // shopCart发生变化 init购物车
    shopCart: function (value) {
      this.initCategoryNum();
    },
  },
  //购物车列表发生变化，没有商铺时，隐藏
  cartFoodList: function (value) {
    if (!value.length) {
      this.showCartList = false;
    }
  },
  beforeMount() {
    // 初始化和shopCart变化时，重新获取购物车改变过的数据，
    // 赋值 categoryNum，totalPrice，cartFoodList，整个数据流是自上而下的形式，
    // 所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，使整个数据流更加清晰
    this.initCategoryNum();
    this.INIT_BUYCART();
  },
  computed: {
    ...mapState(["cartList", "shopDetail"]),
    // 当前商店购物信息
    shopCart() {
      return { ...this.cartList[this.shopId] };
    },
    // 配送费
    deliveryFee() {
      if (this.shopDetail) {
        return this.shopDetail.float_delivery_fee;
      } else {
        return null;
      }
    },
    // 还差多少元起送，为负数显示去结算按钮
    minimumOrderAmount() {
      if (this.shopDetail) {
        return this.shopDetail.float_minimum_order_amount - this.totalPrice;
      } else {
        return null;
      }
    },
  },
  methods: {
    ...mapMutations(["INIT_BUYCART", "ADD_CART", "REDUCE_CART", "CLEAR_CART"]),
    clearCart() {
      this.toggleCartList();
      this.CLEAR_CART(this.shopId);
    },
    // 控制购物车的显示和隐藏
    toggleCartList() {
      this.cartFoodList.length
        ? (this.showCartList = !this.showCartList)
        : true;
    },
    //加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
    addToCart(category_id, item_id, food_id, name, price, specs) {
      this.ADD_CART({
        shopid: this.shopId,
        category_id,
        item_id,
        food_id,
        name,
        price,
        specs,
      });
    },
    //移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
    removeOutCart(category_id, item_id, food_id, name, price, specs) {
      this.REDUCE_CART({
        shopid: this.shopId,
        category_id,
        item_id,
        food_id,
        name,
        price,
        specs,
      });
    },
    // 初始化购物测数据
    initCategoryNum() {
      let newArr = [];
      let cartFoodNum = 0;
      this.totalPrice = 0;
      this.cartFoodList = [];
      this.menuList.forEach((item, index) => {
        if (this.shopCart && this.shopCart[item.foods[0].category_id]) {
          let num = 0;
          Object.keys(this.shopCart[item.foods[0].category_id]).forEach(
            (itemid) => {
              Object.keys(
                this.shopCart[item.foods[0].category_id][itemid]
              ).forEach((foodid) => {
                let foodItem =
                  this.shopCart[item.foods[0].category_id][itemid][foodid];
                num += foodItem.num;
                if (item.type == 1) {
                  this.totalPrice += foodItem.num * foodItem.price;
                  if (foodItem.num > 0) {
                    this.cartFoodList[cartFoodNum] = {};
                    this.cartFoodList[cartFoodNum].category_id =
                      item.foods[0].category_id;
                    this.cartFoodList[cartFoodNum].item_id = itemid;
                    this.cartFoodList[cartFoodNum].food_id = foodid;
                    this.cartFoodList[cartFoodNum].num = foodItem.num;
                    this.cartFoodList[cartFoodNum].price = foodItem.price;
                    this.cartFoodList[cartFoodNum].name = foodItem.name;
                    this.cartFoodList[cartFoodNum].specs = foodItem.specs;
                    cartFoodNum++;
                  }
                }
              });
            }
          );
          newArr[index] = num;
        } else {
          newArr[index] = 0;
        }
      });
      this.totalPrice = this.totalPrice.toFixed(2);
      this.categoryNum = [...newArr];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
.buy_cart_container {
  position: absolute;
  background-color: #3d3d3f;
  bottom: 0;
  left: 0;
  z-index: 13;
  display: flex;
  @include wh(100%, 2rem);
  .cart_icon_num {
    flex: 1;
    .cart_icon_container {
      display: flex;
      background-color: #3d3d3f;
      position: absolute;
      padding: 0.4rem;
      border: 0.18rem solid #444;
      border-radius: 50%;
      left: 0.5rem;
      top: -0.7rem;
      .cart_icon {
        @include wh(1.2rem, 1.2rem);
      }
      .cart_list_length {
        position: absolute;
        top: -0.25rem;
        right: -0.25rem;
        background-color: #ff461d;
        line-height: 0.7rem;
        text-align: center;
        border-radius: 50%;
        border: 0.025rem solid #ff461d;
        min-width: 0.7rem;
        height: 0.7rem;
        @include sc(0.5rem, #fff);
        font-family: Helvetica Neue, Tahoma, Arial;
      }
    }
    .move_in_cart {
      animation: mymove 0.5s ease-in-out;
    }
    .cart_icon_activity {
      background-color: #3190e8;
    }
    .cart_num {
      @include ct;
      left: 3.5rem;

      div {
        color: #fff;
      }
      div:nth-of-type(1) {
        font-size: 0.8rem;
        font-weight: bold;
        margin-bottom: 0.1rem;
      }
      div:nth-of-type(2) {
        font-size: 0.4rem;
      }
    }
  }
  .gotopay {
    position: absolute;
    right: 0;
    background-color: #535356;
    @include wh(5rem, 100%);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .gotopay_button_style {
      @include sc(0.7rem, #fff);
      font-weight: bold;
    }
  }
  .gotopay_acitvity {
    background-color: #4cd964;
  }
}
.cart_food_list {
  position: fixed;
  width: 100%;
  padding-bottom: 2rem;
  z-index: 12;
  bottom: 0;
  left: 0;
  background-color: #fff;
  header {
    @include fj;
    align-items: center;
    padding: 0.3rem 0.6rem;
    background-color: #eceff1;
    svg {
      @include wh(0.6rem, 0.6rem);
      vertical-align: middle;
    }
    h4 {
      @include sc(0.7rem, #666);
    }
    .clear_cart {
      @include sc(0.6rem, #666);
    }
  }
  .cart_food_details {
    background-color: #fff;
    max-height: 20rem;
    overflow-y: auto;
    .cart_food_li {
      @include fj;
      padding: 0.6rem 0.5rem;
      .cart_list_num {
        width: 55%;
        p:nth-of-type(1) {
          @include sc(0.7rem, #666);
          font-weight: bold;
        }
        p:nth-of-type(2) {
          @include sc(0.4rem, #666);
        }
      }
      .cart_list_price {
        font-size: 0;
        span:nth-of-type(1) {
          @include sc(0.6rem, #f60);
          font-family: Helvetica Neue, Tahoma;
        }
        span:nth-of-type(2) {
          @include sc(0.7rem, #f60);
          font-family: Helvetica Neue, Tahoma;
          font-weight: bold;
        }
      }
      .cart_list_control {
        display: flex;
        align-items: center;
        span {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        svg {
          @include wh(0.9rem, 0.9rem);
          fill: #3190e8;
        }
        .specs_reduce_icon {
          fill: #999;
        }
        .cart_num {
          @include sc(0.65rem, #666);
          min-width: 1rem;
          text-align: center;
          font-family: Helvetica Neue, Tahoma;
        }
      }
    }
  }
}
.screen_cover {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 11;
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
.router-slid-enter-active,
.router-slid-leave-active {
  transition: all 0.4s;
}
.router-slid-enter,
.router-slid-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
.toggle-cart-enter-active,
.toggle-cart-leave-active {
  transition: all 0.3s ease-out;
}
.toggle-cart-enter,
.toggle-cart-leave-active {
  transform: translateY(100%);
}
</style>

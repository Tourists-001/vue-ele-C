<template>
  <div class="food_container">
    <headTop :head-title="headTitle" :goBack="true"></headTop>
    <!-- 分类 -->
    <section class="sort_container">
      <div class="sort_item" :class="{ choose_type: sortBy === 'food' }">
        <div class="sort_item_container" @click="chooseType('food')">
          <div class="sort_item_border">
            <span :class="{ category_title: sortBy == 'food' }">{{
              foodTitle
            }}</span>
            <svg
              width="10"
              height="10"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              class="sort_icon"
            >
              <polygon points="0,3 10,3 5,8" />
            </svg>
          </div>
        </div>
        <transition name="showList" v-show="category">
          <section
            class="category_container sort_detail_type"
            v-show="sortBy == 'food'"
          >
            <section class="category_left">
              <ul>
                <li
                  class="category_left_li"
                  v-for="(item, index) in category"
                  @click="selectCategoryName(item.id, index)"
                  :key="item.id"
                  :class="{
                    category_active: restaurant_category_id == item.id,
                  }"
                >
                  <section>
                    <img
                      :src="getImgPath(item.image_url)"
                      class="category_icon"
                    />
                    <span>{{ item.name }}</span>
                  </section>
                  <section>
                    <span class="category_count">{{ item.count }}</span>
                    <svg
                      width="8"
                      height="8"
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      class="category_arrow"
                    >
                      <path
                        d="M0 0 L6 4 L0 8"
                        stroke="#bbb"
                        stroke-width="1"
                        fill="none"
                      />
                    </svg>
                  </section>
                </li>
              </ul>
            </section>
            <section class="category_right">
              <ul>
                <li
                  class="category_right_li"
                  v-for="(item, index) in categoryDetail"
                  :key="item.id"
                  @click="getCategoryIds(item.id, item.name)"
                  :class="{
                    category_right_choosed:
                      restaurant_category_ids == item.id ||
                      (!restaurant_category_ids && index == 0),
                  }"
                >
                  <span>{{ item.name }}</span
                  ><span>{{ item.count }}</span>
                </li>
              </ul>
            </section>
          </section>
        </transition>
      </div>
      <!-- 排序 -->
      <div class="sort_item" :class="{ choose_type: sortBy == 'sort' }">
        <div class="sort_item_container" @click="chooseType('sort')">
          <div class="sort_item_border">
            <span :class="{ category_title: sortBy == 'sort' }"> 排序</span>
            <svg
              width="10"
              height="10"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              class="sort_icon"
            >
              <polygon points="0,3 10,3 5,8" />
            </svg>
          </div>
        </div>
        <transition name="showList">
          <section class="sort_detail_type" v-show="sortBy == 'sort'">
            <ul class="sort_list_container" @click="sortList($event)">
              <li class="sort_list_li">
                <svg>
                  <use
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xlink:href="#default"
                  ></use>
                </svg>
                <p data="0" :class="{ sort_select: sortByType == 0 }">
                  <span>智能排序</span>
                  <svg v-if="sortByType === '0'">
                    <use
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xlink:href="#selected"
                    ></use>
                  </svg>
                </p>
              </li>
              <li class="sort_list_li">
                <svg>
                  <use
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xlink:href="#distance"
                  ></use>
                </svg>
                <p data="5" :class="{ sort_select: sortByType == 5 }">
                  <span>距离最近</span>
                  <svg v-if="sortByType === '5'">
                    <use
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xlink:href="#selected"
                    ></use>
                  </svg>
                </p>
              </li>
              <li class="sort_list_li">
                <svg>
                  <use
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xlink:href="#hot"
                  ></use>
                </svg>
                <p data="6" :class="{ sort_select: sortByType == 6 }">
                  <span>销量最高</span>
                  <svg v-if="sortByType === '6'">
                    <use
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xlink:href="#selected"
                    ></use>
                  </svg>
                </p>
              </li>
              <li class="sort_list_li">
                <svg>
                  <use
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xlink:href="#price"
                  ></use>
                </svg>
                <p data="1" :class="{ sort_select: sortByType == 1 }">
                  <span>起送最低价</span>
                  <svg v-if="sortByType === '1'">
                    <use
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xlink:href="#selected"
                    ></use>
                  </svg>
                </p>
              </li>
              <li class="sort_list_li">
                <svg>
                  <use
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xlink:href="#speed"
                  ></use>
                </svg>
                <p data="2" :class="{ sort_select: sortByType == 2 }">
                  <span>配送速度最快</span>
                  <svg v-if="sortByType === '2'">
                    <use
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xlink:href="#selected"
                    ></use>
                  </svg>
                </p>
              </li>
              <li class="sort_list_li">
                <svg>
                  <use
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xlink:href="#rating"
                  ></use>
                </svg>
                <p data="3" :class="{ sort_select: sortByType == 3 }">
                  <span>评分最高</span>
                  <svg v-if="sortByType === '3'">
                    <use
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xlink:href="#selected"
                    ></use>
                  </svg>
                </p>
              </li>
            </ul>
          </section>
        </transition>
      </div>
      <!-- 筛选 -->
      <div class="sort_item" :class="{ choose_type: sortBy == 'activity' }">
        <div class="sort_item_container" @click="chooseType('activity')">
          <span :class="{ category_title: sortBy == 'activity' }">筛选</span>
          <svg
            width="10"
            height="10"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            class="sort_icon"
          >
            <polygon points="0,3 10,3 5,8" />
          </svg>
        </div>
        <transition name="showList">
          <section
            class="sort_detail_type filter_container"
            v-show="sortBy == 'activity'"
          >
            <section style="width: 100%">
              <header class="filter_header_style">配送方式</header>
              <ul class="filter_ul">
                <li
                  class="filter_li"
                  v-for="(item, i) in Delivery"
                  :key="i"
                  @click="selectDeliveryMode(item.id)"
                >
                  <svg
                    :style="{
                      opacity: item.id == 0 && delivery_mode !== 0 ? 0 : 1,
                    }"
                  >
                    <use
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      :xlink:href="
                        delivery_mode == item.id ? '#selected' : '#fengniao'
                      "
                    ></use>
                  </svg>
                  <span
                    :class="{ selected_filter: delivery_mode == item.id }"
                    >{{ item.text }}</span
                  >
                </li>
              </ul>
            </section>
            <section style="width: 100%">
              <header class="filter_header_style">商家属性（可多选）</header>
              <ul class="filter_ul" style="paddingbottom: 0.5rem">
                <li
                  class="filter_li"
                  v-for="(item, index) in Activity"
                  :key="index"
                  @click="selectSupportIds(index, item.id)"
                >
                  <svg class="activity_svg" v-show="support_ids[index].status">
                    <use
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xlink:href="#selected"
                    ></use>
                  </svg>
                  <span
                    class="filter_icon"
                    v-show="false"
                    :style="{
                      color: '#' + item.icon_color,
                      borderColor: '#' + item.icon_color,
                    }"
                  >
                    {{ item.icon_name }}
                  </span>
                  <span
                    :class="{ selected_filter: support_ids[index].status }"
                    >{{ item.name }}</span
                  >
                </li>
              </ul>
            </section>
            <footer class="confirm_filter">
              <div class="clear_all filter_button_style" @click="clearSelect">
                清空
              </div>
              <div
                class="confirm_select filter_button_style"
                @click="confirmSelectFun"
              >
                确定<span v-show="filterNum">({{ filterNum }})</span>
              </div>
            </footer>
          </section>
        </transition>
      </div>
    </section>
    <transition name="showcover">
      <div class="back_cover" v-show="sortBy"></div>
    </transition>
    <section class="shop_list_container">
      <shop-list
        :geohash="geohash"
        :restaurantCategoryId="restaurant_category_id"
        :restaurantCategoryIds="restaurant_category_ids"
        :sortByType="sortByType"
        :deliveryMode="delivery_mode"
        :confirmSelect="confirmStatus"
        :supportIds="support_ids"
        v-if="latitude"
      ></shop-list>
    </section>
  </div>
</template>

<script>
import shopList from "@/components/common/shopList";
import { mapState, mapMutations } from "vuex";
import { cityGuess } from "@/api/city";
import { foodCategory, foodDelivery, foodActivity } from "@/api/category";
import { getImgPath } from "@/mixin/resImg";
export default {
  components: {
    shopList,
  },
  created() {
    this.initData();
  },
  mixins: [getImgPath],
  data() {
    return {
      headTitle: "", // city页面传递过来的地址geohash
      geohash: "", // msiet页面头部标题
      foodTitle: "", // 排序左侧头部标题
      restaurant_category_id: "", // 食品类型id值
      category: [], // 商品分类左侧内容
      categoryDetail: null, // category分类右侧的详细数据
      restaurant_category_ids: "", //筛选类型的id
      sortBy: "", //排序
      Activity: [], // 活动属性
      Delivery: [], // 配送方式
      sortByType: null, // 根据何种方式排序
      delivery_mode: null, // 选中的配送方式
      support_ids: [], // 商家活动
      filterNum: 0, // 所选中的所有样式的集合
      confirmStatus: false, // 确认选择
    };
  },
  computed: {
    ...mapState(["latitude", "longitude"]),
  },
  methods: {
    ...mapMutations(["RECORD_ADDRESS"]),
    async initData() {
      // 从路由中获取参数
      this.headTitle = this.$route.query.title;
      this.geohash = this.$route.query.geohash;
      this.foodTitle = this.headTitle;
      // 防止页面刷新，丢失vuex里的位置信息，从新获取一下位置
      this.restaurant_category_id = this.$route.query.restaurant_category_id;
      if (!this.latitude) {
        const res = await cityGuess();
        this.RECORD_ADDRESS(res);
      }
      //获取category分类左侧数据
      this.category = await foodCategory(this.latitude, this.longitude);
    //   console.log(this.category);
      this.category.forEach((item, i) => {
        // if (item.name === "全部商家") {
        //   this.category.splice(i, 1);
        // }
        if (this.restaurant_category_id == item.id) {
          this.categoryDetail = item.sub_categories;
        }
      });
      // 获取筛选列表的配送方式
      this.Delivery = await foodDelivery(this.latitude, this.longitude);
    //   console.log(this.Delivery);
      // 获取商家活动属性
      this.Activity = await foodActivity(this.latitude, this.latitude);
    //   console.log(this.Activity);
      //记录support_ids的状态，默认不选中，点击状态取反，status为true时为选中状态
      this.Activity.forEach((item, index) => {
        this.support_ids[index] = { status: false, id: item.id };
      });
    },
    // 分类左侧列表的点击
    selectCategoryName(id, i) {
      //第一个选项 -- 全部商家 因为没有自己的列表，所以点击则默认获取选所有数据
      if (i === 7) {
        this.restaurant_category_ids = null;
        this.sortBy = "";
        //不是第一个选项时，右侧展示其子级sub_categories的列表
      } else {
        this.restaurant_category_id = id;
        this.categoryDetail = this.category[i].sub_categories;
      }
    },
    // 点击右侧详情
    getCategoryIds(id, name) {
      this.restaurant_category_ids = id;
      this.sortBy = "";
      this.foodTitle = this.headTitle = name;
    },
    // 点击头部切换
    chooseType(type) {
      if (this.sortBy != type) {
        this.sortBy = type;
        // 分类需要进行特殊处理
        if (type === "分类") {
          this.foodTitle = "分类";
        } else {
          this.foodTitle = this.headTitle;
        }
      } else {
        // 再次点击相同选项时收回列表
        this.sortBy = "";
        if (type == "food") {
          //将foodTitle 和 headTitle 进行同步
          this.foodTitle = this.headTitle;
        }
      }
    },
    //点击某个排序方式，获取事件对象的data值，并根据获取的值重新获取数据渲染
    sortList(event) {
      let node;
      // 如果点击的是 span 中的文字，则需要获取到 span 的父标签 p
      // 获取event.targetDOM节点的字符串
      if (event.target.nodeName.toUpperCase() !== "P") {
        node = event.target.parentNode;
      } else {
        node = event.target;
      }
      this.sortByType = node.getAttribute("data");
      this.sortBy = "";
    },
    // 选择商家属性
    selectDeliveryMode(id) {
      //delivery_mode为空时，选中当前项，并且filterNum加一
      if (this.delivery_mode == null) {
        this.filterNum++;
        this.delivery_mode = id;
        //delivery_mode为当前已有值时，清空所选项，并且filterNum减一
      } else if (this.delivery_mode == id) {
        this.filterNum--;
        this.delivery_mode = null;
        //delivery_mode已有值且不等于当前选择值，则赋值delivery_mode为当前所选id
      } else {
        this.delivery_mode = id;
      }
    },
    selectSupportIds(index, id) {
      this.support_ids.splice(index, 1, {
        status: !this.support_ids[index].status,
        id,
      });
      //重新计算filterNum的个数
      this.filterNum = this.delivery_mode == null ? 0 : 1;
      this.support_ids.forEach((item) => {
        if (item.status) {
          this.filterNum++;
        }
      });
    },
    clearSelect() {
      this.support_ids.map((item) => (item.status = false));
      this.filterNum = 0;
      this.delivery_mode = null;
    },
    //点击确认时，将需要筛选的id值传递给子组件，并且收回列表
    confirmSelectFun() {
      //状态改变时，因为子组件进行了监听，会重新获取数据进行筛选
      this.confirmStatus = !this.confirmStatus;
      this.sortBy = "";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/mixin";
@import "src/style/mixin";
.category_active {
  background-color: #fff;
}
.food_container {
  padding-top: 3.6rem;
}
.sort_container {
  background-color: #fff;
  border-bottom: 0.025rem solid #f1f1f1;
  position: fixed;
  top: 1.95rem;
  right: 0;
  width: 100%;
  display: flex;
  z-index: 13;
  box-sizing: border-box;
  .sort_item {
    @include sc(0.55rem, #444);
    @include wh(33.3%, 1.6rem);
    text-align: center;
    line-height: 1rem;
    .sort_item_container {
      @include wh(100%, 100%);
      position: relative;
      z-index: 14;
      background-color: #fff;
      box-sizing: border-box;
      padding-top: 0.3rem;
      .sort_item_border {
        height: 1rem;
        border-right: 0.025rem solid $bc;
      }
    }
    .sort_icon {
      vertical-align: middle;
      transition: all 0.3s;
      fill: #666;
    }
  }
  .choose_type {
    .sort_item_container {
      .category_title {
        color: $blue;
      }
      .sort_icon {
        transform: rotate(180deg);
        fill: $blue;
      }
    }
  }
  .showList-enter-active,
  .showList-leave-active {
    transition: all 0.3s;
    transform: translateY(0);
  }
  .showList-enter,
  .showList-leave-active {
    opacity: 0;
    transform: translateY(-100%);
  }
  .sort_detail_type {
    width: 100%;
    position: absolute;
    display: flex;
    top: 1.6rem;
    left: 0;
    border-top: 0.025rem solid $bc;
    background-color: #fff;
  }
  .category_container {
    .category_left {
      flex: 1;
      background-color: #f1f1f1;
      height: 16rem;
      overflow-y: auto;
      span {
        @include sc(0.5rem, #666);
        line-height: 1.8rem;
      }
      .category_left_li {
        @include fj;
        padding: 0 0.5rem;
        .category_icon {
          @include wh(0.8rem, 0.8rem);
          vertical-align: middle;
          margin-right: 0.2rem;
        }
        .category_count {
          background-color: #ccc;
          @include sc(0.4rem, #fff);
          padding: 0 0.1rem;
          border: 0.025rem solid #ccc;
          border-radius: 0.8rem;
          vertical-align: middle;
          margin-right: 0.25rem;
        }
        .category_arrow {
          vertical-align: middle;
        }
      }
      .category_active {
        background-color: #fff;
      }
    }
    .category_right {
      flex: 1;
      background-color: #fff;
      padding-left: 0.5rem;
      height: 16rem;
      overflow-y: auto;
      .category_right_li {
        @include fj;
        height: 1.8rem;
        line-height: 1.8rem;
        padding-right: 0.5rem;
        border-bottom: 0.025rem solid $bc;
        span {
          color: #666;
        }
      }
      .category_right_choosed {
        span {
          color: $blue;
        }
      }
    }
  }
  .sort_list_container {
    width: 100%;
    .sort_list_li {
      height: 2.5rem;
      display: flex;
      align-items: center;
      svg {
        @include wh(0.7rem, 0.7rem);
        margin: 0 0.3rem 0 0.8rem;
      }
      p {
        line-height: 2.5rem;
        flex: auto;
        text-align: left;
        text-indent: 0.25rem;
        border-bottom: 0.025rem solid $bc;
        @include fj;
        align-items: center;
        span {
          color: #666;
        }
      }
      .sort_select {
        span {
          color: $blue;
        }
      }
    }
  }
  .filter_container {
    flex-direction: column;
    align-items: flex-start;
    min-height: 10.6rem;
    background-color: #f1f1f1;
    .filter_header_style {
      @include sc(0.4rem, #333);
      line-height: 1.5rem;
      height: 1.5rem;
      text-align: left;
      padding-left: 0.5rem;
      background-color: #fff;
    }
    .filter_ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0 0.5rem;
      background-color: #fff;
      .filter_li {
        display: flex;
        align-items: center;
        border: 0.025rem solid #eee;
        @include wh(4.7rem, 1.4rem);
        margin-right: 0.25rem;
        border-radius: 0.125rem;
        padding: 0 0.25rem;
        margin-bottom: 0.25rem;
        svg {
          @include wh(0.8rem, 0.8rem);
          margin-right: 0.125rem;
        }
        span {
          @include sc(0.4rem, #333);
        }
        .filter_icon {
          @include wh(0.8rem, 0.8rem);
          font-size: 0.5rem;
          border: 0.025rem solid $bc;
          border-radius: 0.15rem;
          margin-right: 0.25rem;
          line-height: 0.8rem;
          text-align: center;
        }
        .activity_svg {
          margin-right: 0.25rem;
        }
        .selected_filter {
          color: $blue;
        }
      }
    }
    .confirm_filter {
      display: flex;
      background-color: #f1f1f1;
      width: 100%;
      padding: 0.3rem 0.2rem;
      .filter_button_style {
        @include wh(50%, 1.8rem);
        font-size: 0.8rem;
        line-height: 1.8rem;
        border-radius: 0.2rem;
      }
      .clear_all {
        background-color: #fff;
        margin-right: 0.5rem;
        border: 0.025rem solid #fff;
      }
      .confirm_select {
        background-color: #56d176;
        color: #fff;
        border: 0.025rem solid #56d176;
        span {
          color: #fff;
        }
      }
    }
  }
}
.showcover-enter-active,
.showcover-leave-active {
  transition: opacity 0.3s;
}
.showcover-enter,
.showcover-leave-active {
  opacity: 0;
}
.back_cover {
  position: fixed;
  @include wh(100%, 100%);
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>

<template>
  <section
    class="rating_containers"
    id="ratingContainer"
    v-load-more="loaderMoreRating"
    type="2"
  >
    <section>
      <section>
        <header class="rating_header">
          <section class="rating_header_left">
            <p>{{ shopDetail.rating }}</p>
            <p>综合评价</p>
            <p v-if="!Loading">高于周边商家{{ score }}%</p>
          </section>
          <section class="rating_header_right">
            <p>
              <span>服务态度</span>
              <ratingStart
                :rating="ratingScoresData.service_score"
              ></ratingStart>
              <span class="rating_num">{{ ratingNum }}</span>
            </p>
            <p>
              <span>菜品评价</span>
              <ratingStart :rating="ratingScoresData.food_score"></ratingStart>
              <span class="rating_num">{{ foodScore }}</span>
            </p>
            <p>
              <span>送达时间</span>
              <span class="delivery_time"
                >{{ shopDetail.order_lead_time }}分钟</span
              >
            </p>
          </section>
        </header>
        <ul class="tag_list_ul">
          <li
            v-for="(item, index) in ratingTagsList"
            :key="index"
            :class="{
              unsatisfied: item.unsatisfied,
              tagActivity: ratingTageIndex == index,
            }"
            @click="changeTgeIndex(index, item.name)"
          >
            {{ item.name }}({{ item.count }})
          </li>
        </ul>
        <ul class="rating_list_ul">
          <li
            class="rating_list_li"
            v-for="(item, index) in ratingList"
            :key="index"
          >
            <img
              :src="getImgPath(item.avatar)"
              v-if="item.avatar"
              class="user_avatar"
            />
            <section class="rating_list_details">
              <header>
                <section class="username_star">
                  <p class="username">{{ item.username }}</p>
                  <p class="star_desc">
                    <ratingStart :rating="item.rating_star"></ratingStart>
                    <span class="time_spent_desc">{{
                      item.time_spent_desc
                    }}</span>
                  </p>
                </section>
                <time class="rated_at">{{ item.rated_at }}</time>
              </header>
              <ul class="food_img_ul">
                <li v-if="(item, index) in item.item_ratings" :key="index">
                  <img
                    :src="getImgPath(item.image_hash)"
                    v-if="item.image_hash"
                    alt=""
                  />
                </li>
              </ul>
              <ul class="food_name_ul">
                <li
                  class="ellipsis"
                  v-for="(item, index) in item.item_ratings"
                  :key="index"
                >
                  {{ item.food_name }}
                </li>
              </ul>
            </section>
          </li>
        </ul>
      </section>
    </section>
    <loading v-show="loadRatings"></loading>
  </section>
</template>

<script>
import ratingStart from "@/components/common/ratingStart";
import { mapState } from "vuex";
import { ratingScores, ratingTags, getRatingList } from "@/api/shop";
import { getImgPath } from "@/mixin/resImg";
import loadMore from "@/directives/loadingMore";
import loading from "@/components/common/loading";
export default {
  components: {
    ratingStart,
    loading,
  },
  data() {
    return {
      shopDetailData: null, //商铺详情
      ratingScoresData: "", //评价总体分数
      Loading: true,
      ratingTagsList: [], // 评论列表分类
      ratingTageIndex: 0, //评价分类索引
      ratingList: [], //评价列表
      ratingOffset: 0, //评价获取数据offset值
      ratingTagName: "", //评论的类型
      preventRepeatRequest: false,
      loadRatings: false,
    };
  },
  created() {
    this.shopId = this.$route.query.id;
    this.initData();
  },
  mixins: [getImgPath],
  directives: loadMore,
  computed: {
    ...mapState(["shopDetail"]),
    score() {
      return this.ratingScoresData.compare_rating
        ? (this.ratingScoresData.compare_rating * 100).toFixed(1)
        : "";
    },
    ratingNum() {
      return this.ratingScoresData.service_score
        ? this.ratingScoresData.service_score.toFixed(1)
        : "";
    },
    foodScore() {
      return this.ratingScoresData.food_score
        ? this.ratingScoresData.food_score.toFixed(1)
        : "";
    },
    leadTime() {
      return this.shopDetail.order_lead_time
        ? this.shopDetailData.order_lead_time
        : "";
    },
  },
  methods: {
    async initData() {
      this.ratingScoresData = await ratingScores(this.shopId);
      this.ratingTagsList = await ratingTags(this.shopId);
      this.ratingList = await getRatingList(this.shopId, this.ratingOffset);
      this.Loading = false;
    },
    // 点击切换评论列表
    async changeTgeIndex(index, name) {
      this.ratingTageIndex = index;
      this.ratingOffset = 0;
      this.ratingTagName = name;
      let res = await getRatingList(this.shopId, this.ratingOffset, name);
      this.ratingList = res;
    },
    // 下滑加载更多
    async loaderMoreRating() {
      if (this.preventRepeatRequest) {
        return;
      }
      this.loadRatings = true;
      this.preventRepeatRequest = true;
      this.ratingOffset += 10;
      let ratingDate = await getRatingList(
        this.shopId,
        this.ratingOffset,
        this.ratingTagName
      );
      this.ratingList = [...this.ratingList, ...ratingDate];
      this.loadRatings = false;
      if (ratingDate.length >= 10) {
        this.preventRepeatRequest = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin";
.rating_containers {
  position: absolute;
  top: 144px;
  flex: 1;
  overflow-y: auto;
  flex-direction: column;
  width: 100%;
  height: 22rem;
  p,
  span,
  li,
  time {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
  .rating_header {
    display: flex;
    background-color: #fff;
    padding: 0.8rem 0.5rem;
    margin-bottom: 0.5rem;
    .rating_header_left {
      flex: 3;
      text-align: center;
      p:nth-of-type(1) {
        @include sc(1.2rem, #f60);
      }
      p:nth-of-type(2) {
        @include sc(0.65rem, #666);
        margin-bottom: 0.1rem;
      }
      p:nth-of-type(3) {
        @include sc(0.4rem, #999);
      }
    }
    .rating_header_right {
      flex: 4;
      p {
        font-size: 0.65rem;
        line-height: 1rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        span:nth-of-type(1) {
          color: #666;
          margin-right: 0.5rem;
        }
        .rating_num {
          width: 3rem;
          @include sc(0.55rem, #f60);
        }
        .delivery_time {
          @include sc(0.4rem, #999);
        }
      }
    }
  }
  .tag_list_ul {
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
    padding: 0.5rem;
    li {
      @include sc(0.6rem, #6d7885);
      padding: 0.3rem 0.3rem;
      background-color: #ebf5ff;
      border-radius: 0.2rem;
      border: 1px;
      margin: 0 0.4rem 0.2rem 0;
    }
    .unsatisfied {
      background-color: #f5f5f5;
      color: #aaa;
    }
    .tagActivity {
      background-color: #3190e8;
      color: #fff;
    }
  }
  .rating_list_ul {
    background-color: #fff;
    padding: 0 0.5rem;
    .rating_list_li {
      border-top: 1px solid #f1f1f1;
      display: flex;
      padding: 0.6rem 0;
      .user_avatar {
        @include wh(1.5rem, 1.5rem);
        border: 0.025rem;
        border-radius: 50%;
        margin-right: 0.8rem;
      }
      .rating_list_details {
        flex: 1;
        header {
          display: flex;
          flex: 1;
          justify-content: space-between;
          margin-bottom: 0.3rem;
          .username_star {
            @include sc(0.55rem, #666);
            .username {
              color: #666;
              margin-bottom: 0.2rem;
            }
            .star_desc {
              display: flex;
              align-items: center;
              .time_spent_desc {
                @include sc(0.55rem, #666);
                margin-left: 0.15rem;
              }
            }
          }
          .rated_at {
            @include sc(0.4rem, #999);
          }
        }
        .food_img_ul {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 0.4rem;
          li {
            img {
              @include wh(3rem, 3rem);
              margin-right: 0.4rem;
              display: block;
            }
          }
        }
        .food_name_ul {
          display: flex;
          flex-wrap: wrap;
          li {
            @include sc(0.55rem, #999);
            width: 2.2rem;
            padding: 0.2rem;
            border: 0.025rem solid #ebebeb;
            border-radius: 0.15rem;
            margin-right: 0.3rem;
            margin-bottom: 4px;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="rating_page">
    <section v-if="!showLoading">
      <headTop head-title="订单备注" :goBack="true"></headTop>
      <section class="quick_remark" v-if="remarkList.remarks.length">
        <header class="header_style">快速备注</header>
        <ul class="remark_arr_list_ul">
          <li
            class="remark_arr_list_li"
            v-for="(item, index) in remarkList.remarks"
            :key="index"
          >
            <span
              :class="{
                first: remarkIndex == 0,
                last: remarkIndex == item.length - 1,
                choosed:
                  remarkText[index] && remarkText[index][0] == remarkIndex,
              }"
              class="remark_item_li"
              v-for="(remarkTtem, remarkIndex) in item"
              :key="remarkIndex"
              @click="chooseRemark(index, remarkIndex, remarkTtem)"
              >{{ remarkTtem }}</span
            >
          </li>
        </ul>
      </section>
      <section class="input_remark quick_remark">
        <header class="header_style">其他备注</header>
        <textarea
          class="input_text"
          v-model="inputText"
          placeholder="请输入备注内容(可不填)"
        ></textarea>
      </section>
      <div class="determine" @click="confirmRemark">确定</div>
    </section>
    <loading v-if="showLoading"></loading>
  </div>
</template>

<script>
import loading from "@/components/common/loading";
import { getRemark } from "@/api/shop";
import { mapMutations } from "vuex";
export default {
  components: {
    loading,
  },
  created() {
    this.id = this.$route.query.id;
    this.sig = this.$route.query.sig;
    this.initData();
  },
  data() {
    return {
      showLoading: true, // 数据加载蒙层
      inputText: "", // 其他备注
      id: "",
      sig: "",
      remarkList: [], // 备注列表
      remarkText: {},
      RestartIndex: false,
    };
  },
  methods: {
    ...mapMutations(["CONFIRM_REMARK"]),
    async initData() {
      this.remarkList = await getRemark(this.id, this.sig);
      this.showLoading = false;
    },
    chooseRemark(index, remarkIndex, text) {
      this.remarkText[index] = [remarkIndex, text];
      //   console.log(this.remarkText);
      this.remarkText = Object.assign({}, this.remarkText);
    },
    //确认选择
    confirmRemark() {
      this.CONFIRM_REMARK({
        remarkText: this.remarkText,
        inputText: this.inputText,
      });
      this.$router.go(-1);
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
  background-color: #f5f5f5;
  z-index: 204;
  padding-top: 1.95rem;
  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}
.header_style {
  @include sc(0.65rem, #333);
  line-height: 2rem;
}
.quick_remark {
  background-color: #fff;
  margin-top: 0.4rem;
  padding: 0 0.6rem 1rem;
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      margin-right: 0.6rem;
      margin-bottom: 0.6rem;
      span {
        @include sc(0.6rem, #333);
        padding: 0.3rem 0.6rem;
        border: 0.025rem solid #3190e8;
        border-left: 0;
      }
      .first {
        border-left: 0.025rem solid #3190e8;
        border-top-left-radius: 0.2rem;
        border-bottom-left-radius: 0.2rem;
      }
      .last {
        border-top-right-radius: 0.2rem;
        border-bottom-right-radius: 0.2rem;
      }
      .choosed {
        color: #fff;
        background-color: #3190e8;
      }
    }
  }
}
.input_remark {
  background-color: #fff;
  .input_text {
    width: 100%;
    background-color: #f9f9f9;
    border: 0.025rem solid #eee;
    resize: none;
    min-height: 4.5rem;
    border-radius: 0.2rem;
    @include sc(0.6rem, #666);
    padding: 0.5rem;
  }
}
.determine {
  background-color: #4cd964;
  @include sc(0.7rem, #fff);
  text-align: center;
  margin: 0 0.7rem;
  line-height: 1.8rem;
  border-radius: 0.2rem;
}
</style>

<template>
  <div id="order" class="h100">
    <tab>
      <tab-item bar-active-color="#03bdeb" selected @on-item-click="changeItem(1)">租用中</tab-item>
      <tab-item bar-active-color="#03bdeb" @on-item-click="changeItem(2)">已完成</tab-item>
    </tab>
    <!-- <swiper v-model="tabMsg.index" :show-dots="false" height="100%" class="h100">
    <swiper-item v-for="(item, index) in tabMsg.listTab" :key="index" class="h100 over_sc">-->
    <scroller
      lock-x
      @on-scroll-bottom="onScrollBottom"
      ref="scrollerBottom"
      :scroll-bottom-offst="200"
    >
      <div class="list" v-if="orderList.length>0">
        <div
          class="mg-t-10 listBox bfff"
          v-for="(order,index) in orderList"
          :key="index"
          @click="goTo(order.id, 2)"
        >
          <div class="pd-15 flex flexBetween border-b">
            <div class="orderNo">
              <span>订单编号：</span>
              {{ order.order_no }}
            </div>
            <div class="cmain">{{order.status == 1?"租用中":"已完成"}}</div>
          </div>
          <div class="pd-15 mainMsg border-b">
            <div class="orderTime">
              <span>租用时间：</span>
              {{ order.rent_start_time | timeStr("Y.m.d H:i:s") }}
            </div>
            <div class="orderTime">
              <span>设备编号：</span>
              {{ order.title }}
            </div>
            <div class="orderTime">
              <span>柜子编号：</span>
              {{ order.number }}
            </div>
            <div class="orderTime">
              <span>设备位置：</span>
              {{ order.address }}
            </div>
          </div>
          <div class="pd-15 mark flex flexStart">
            <div class="icon">
              <img src="../assets/i_feedback.png" class="wd-100">
            </div>
            <span>备注：</span>
            {{order.remark}}
          </div>
        </div>
      </div>
      <div class="tac wd-50 mg-auto pd-t-30" v-else>
        <img src="../assets/noImg.jpg" class="wd-100">
        <div>暂无数据...</div>
      </div>
    </scroller>
    <!-- </swiper-item>
    </swiper>-->
  </div>
</template>

<script>
import { Tab, TabItem, Swiper, SwiperItem, Scroller } from "vux";
export default {
  name: "order",
  components: {
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    Scroller
  },
  data() {
    return {
      orderList: [],
      listParam: {
        api_name: "myOrder",
        type: 1,
        page: 1,
        pagesize: 10
      }
    };
  },
  created() {
    const _this = this;
    _this.getOrderList();
  },
  methods: {
    goTo: function(orderNo, type) {
      const _this = this;
      _this.$router.push({
        name: "orderDetail",
        query: {
          id: orderNo,
          type: type
        }
      });
    },
    onScrollBottom() {
      const _this = this;
      if (!_this.onFetching) {
        _this.onFetching = true;
        setTimeout(() => {
          _this.listParam.page++;
          _this.onFetching = false;
          _this.getOrderList();
        }, 1000);
      }
    },
    changeItem: function(index) {
      const _this = this;
      _this.listParam.type = index;
      _this.listParam.page = 1;
      _this.orderList = [];
      _this.getOrderList();
    },
    getOrderList: function() {
      const _this = this;
      _this.$vux.loading.show({
        text: "请稍候..."
      });
      _this.axios.post("Wxsite/Order/api", _this.listParam).then(res => {
        _this.$vux.loading.hide();
        if (res.data.code == 1) {
          console.log(res.data.data);
          if (res.data.data) {
            console.log(1);
            res.data.data.forEach(item => {
              _this.orderList.push(item);
            });
          } else {
            console.log(2);
            _this.$vux.toast.text("已经没有更多数据啦", "bottom");
          }
        } else {
          _this.$vux.toast.text(res.data.msg, "bottom");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~vux/src/styles/1px.less";
@import "~vux/src/styles/center.less";
.listBox span {
  color: #bbbbbb;
}
.vux-slider {
  height: calc(~"100% - 44px");
  overflow: scroll;
}
</style>

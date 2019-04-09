<template>
  <div id="orderClose" class="pd-15" v-show="show">
    <div class="bfff pd-15 radius5 mg-b-15">
      <div class="orderNo">
        <span class="cbbb">订单编号：</span>
        {{ order.order_no }}
      </div>
      <div class="orderTime">
        <span class="cbbb">设备编号：</span>
        {{ order.macno }}
      </div>
      <div class="orderTime">
        <span class="cbbb">柜子编号：</span>
        {{ order.number }}
      </div>
      <div class="orderTime">
        <span class="cbbb">设备位置：</span>
        {{ order.address }}
      </div>
      <div class="orderTime">
        <span class="cbbb">租用时间：</span>
        {{ order.rent_start | timeStr("Y.m.d H:i:s") }}
      </div>
      <!-- <div class="endTime">
        <span class="cbbb">结束时间： </span>{{ order.end_time | timeStr("Y.m.d H:i:s")  }}
      </div>-->
    </div>
    <div class="bfff pd-15 radius5 mg-b-15">
      <div class="orderNo">
        <span class="cbbb">租用费用：</span>
        {{ order.rental }}元
      </div>
      <div class="orderTime">
        <span class="cbbb">用电费用：</span>
        {{ order.total_ele }}元
      </div>
      <div class="orderTime">
        <span class="cbbb">合计费用：</span>
        <span class="font16 fontb orange">{{ order.money }}元</span>
      </div>
    </div>
    <div class="payway pd-b-0">
      <div class="title">
        <div class="mainTitle fontb">请选择支付方式</div>
        <div class="bfff tal radius10 mg-t-15">
          <div
            class="pd-15 flex"
            :class="index == 0 ? 'border-b' : ''"
            v-for="(pay,index) in payWay"
            :key="index"
            @click="changePayWay(index)"
          >
            <div class="icon wd-10 box">
              <img :src="pay.icon" class="wd-60">
            </div>
            <div class="name wd-80">
              {{pay.name}}
              <span class="c999">{{pay.money ? "(余额:"+pay.money+"元)" : ""}}</span>
            </div>
            <div class="checkBox wd-10 box">
              <img :src="pay.pick ? pay.check : pay.uncheck" class="wd-80">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn mainBtn" @click="payNow">去支付{{order.money}}元</div>
    <!-- toast信息 -->
    <toast
      v-model="toast.status"
      type="text"
      :time="1500"
      is-show-mask
      position="middle"
    >{{ toast.text }}</toast>
  </div>
</template>

<script>
export default {
  name: "orderClose",
  data() {
    return {
      show: false,
      toast: {
        text: "成功",
        status: false
      },
      order: {
        orderMsg: {
          mark: "冰的海鲜",
          status: "租用中",
          orderNo: 22222222222,
          macno: 666666,
          boxNum: 8,
          address: "广东省东莞市南城区高盛科技大厦303",
          orderTime: "2018.01.01 10:10:10",
          endTime: "2018.11.11 10:10:10"
        },
        price: {
          rent: 310,
          eletric: 88.6,
          count: 398.6
        }
      },
      payWay: [
        {
          icon: require("../assets/i_money.png"),
          check: require("../assets/i_check.png"),
          uncheck: require("../assets/i_uncheck.png"),
          name: "我的钱包",
          payWay: "1",
          money: 100,
          pick: true
        },
        {
          icon: require("../assets/i_wechat.png"),
          check: require("../assets/i_check.png"),
          uncheck: require("../assets/i_uncheck.png"),
          name: "微信支付",
          payWay: "2",
          pick: false
        }
      ],
      closePayParam: {
        api_name: "order_pay",
        id: this.$route.query.order_id,
        type: 1,
        code: this.$route.query.code
      },
      jsApiParameters: {}
    };
  },
  created() {
    const _this = this;
    // 获取结束订单详情信息
    _this.axios
      .post("Wxsite/Order/api", {
        api_name: "closure_order",
        id: _this.$route.query.order_id
      })
      .then(res => {
        _this.order = res.data.data.data.order;
        // 获取个人信息
        _this.axios
          .post("Wxsite/User/api", {
            api_name: "consumption_log"
          })
          .then(res => {
            _this.payWay[0].money = res.data.data.money;
            _this.show = true;
          });
      });
  },
  methods: {
    changePayWay: function(index) {
      const _this = this;
      _this.payWay.forEach(item => {
        item.pick = false;
      });
      _this.payWay[index].pick = true;
      _this.closePayParam.type = _this.payWay[index].payWay;
    },
    pay: function() {
      const _this = this;
      _this.payResult = true;
    },
    payNow: function() {
      const _this = this;
      _this.$vux.loading.show({
        text: "请稍候..."
      });
      // 微信支付结束订单
      _this.axios.post("Wxsite/Order/api", _this.closePayParam).then(res => {
        _this.$vux.loading.hide();
        if (res.data.code == 1) {
          // alert(JSON.stringify(_this.jsApiParameters));
          _this.order.money == 0 ? (_this.closePayParam.type = 1) : "";
          if (_this.closePayParam.type == 2) {
            //调用微信 支付
            _this.jsApiParameters = res.data.data.wx_info;
            _this.callpay(_this.jsApiParameters, payBack => {
              // alert(JSON.stringify(payBack));
              if (payBack.err_msg == "get_brand_wcpay_request:ok") {
                // setTimeout(() => {
                _this.$router.push({
                  name: "order"
                });
                // }, 1500);
              } else {
                _this.toast.text = "支付失败，请重试";
              }
            });
          } else {
            // 余额支付结束订单
            _this.toast.text = "支付成功";
            setTimeout(() => {
              _this.$router.push({
                name: "order"
              });
            }, 1500);
          }
          _this.toast.status = true;
        } else {
          _this.toast = {
            status: true,
            text: res.data.msg
          };
          setTimeout(() => {
            _this.$router.push({
              name: "order"
            });
          }, 1500);
        }
      });
    }
  }
};
</script>

<style>
</style>

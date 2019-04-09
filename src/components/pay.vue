<template>
  <div id="pay">
    <div class="deviceMsg pd-15 pd-b-0">
      <div class="radius10 bfff pd-15 tal msgBoxShadow">
        <div class="fontb mg-b-10">设备编号：{{deviceMsg.device.macno}}</div>
        <div class="c999">{{deviceMsg.device.address}}</div>
      </div>
    </div>
    <div class="cupboard pd-15 pd-b-0">
      <div class="title">
        <div class="mainTitle fontb">您当前选择租用的柜子</div>
        <div class="boxes pd-t-15 flex flexBetween">
          <div class="box boxList boxList">{{deviceMsg.number}}</div>
        </div>
      </div>
    </div>
    <div class="payway pd-15 pd-b-0">
      <div class="title">
        <div class="mainTitle fontb">请选择支付方式</div>
        <!-- <div class="bfff tal radius10 mg-t-15">
          <div
            class="pd-15 flex"
            :class="index == 0 ? 'border-b' : ''"
            v-for="(pay,index) in payWay_old"
            :key="index"
            @click="changePayWay(index)"
          >
            <div class="icon wd-10 box">
              <img :src="pay.icon" class="wd-80">
            </div>
            <div class="name wd-80">
              {{pay.name}}
              <span class="c999">{{pay.money ? "(余额:"+pay.money+"元)" : ""}}</span>
            </div>
            <div class="checkBox wd-10 box">
              <img :src="pay.pick ? pay.check : pay.uncheck" class="wd-80">
            </div>
          </div>
        </div>-->
        <div class="bfff tal radius10 mg-t-15">
          <div
            class="flex"
            :class="index == 0 ? 'border-b' : ''"
            v-for="(pay,index) in payWay"
            :key="index"
            @click="changePayWay(index)"
          >
            <div class="checkBox wd-100 box">
              <img :src="pay.pick ? pay.check : pay.uncheck" class="wd-100">
            </div>
            <div class="name po_ab mg-t-40">
              {{pay.name}}
              <span
                class="fontb"
                :class="pay.pick?'cfff':'cbbb'"
              >{{pay.money ? "￥ "+pay.money+"" : ""}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="otherMsg pd-15 flex flexStart flexVStart">
      <img src="../assets/alert.png" class="alertImg">
      <div class="mg-l-5">
        <div class="font15 fontb">
          需预交一天的租用费：
          <span class="orange">{{deviceMsg.rental}}元</span>
        </div>
        <div class="c999 font12">(租用费不包含租用中产生的电费)</div>
      </div>
    </div>
    <div class="payBtn mainBtn" @click="pay">去支付</div>
    <!-- toast提示 -->
    <toast v-model="payResult" type="text" :time="1500" position="middle">{{ result }}</toast>
  </div>
</template>

<script>
export default {
  name: "pay",
  data() {
    return {
      deviceMsg: {
        //设备信息
        macno: 123456,
        address: "广东省东莞市南城区高盛科技大厦303",
        boxName: "03",
        price: 10
      },
      payResult: false,
      result: "支付成功",
      payWay_old: [
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
      payWay: [
        {
          payWay: 1,
          pick: true,
          check: require("../assets/yepay.png"),
          uncheck: require("../assets/yepay1.png"),
          money: 0
        },
        {
          payWay: 2,
          pick: false,
          check: require("../assets/wxpay.png"),
          uncheck: require("../assets/wxpay1.png")
        }
      ],
      payMsg: {
        api_name: "order",
        macno: this.$route.query.macno,
        type: "1",
        id: this.$route.query.id,
        code: this.$route.query.code
      }
    };
  },
  created() {
    const _this = this;
    // 获取设备支付前各信息
    _this.axios
      .post("Wxsite/Device/api", {
        api_name: "go_rent",
        id: _this.$route.query.id
      })
      .then(res => {
        _this.deviceMsg = res.data.data;
        _this.payWay[0].money = res.data.data.money;
        console.log(_this.deviceMsg);
      });
  },
  methods: {
    changePayWay: function(index) {
      const _this = this;
      _this.payWay.forEach(item => {
        item.pick = false;
      });
      _this.payWay[index].pick = true;
      _this.payMsg.type = _this.payWay[index].payWay;
    },
    pay: function() {
      const _this = this;
      _this.$vux.loading.show({
        text: "请稍候..."
      });
      _this.axios.post("Wxsite/Device/api", _this.payMsg).then(res => {
        _this.$vux.loading.hide();
        console.log(res);
        if (res.data.code == 1) {
          _this.deviceMsg.rental == 0 ? (_this.payMsg.type = 1) : "";
          if (_this.payMsg.type == 1) {
            // 余额支付
            setTimeout(() => {
              _this.$router.push({
                name: "order"
              });
            }, 1500);
          } else {
            _this.callpay(res.data.data.wx_info, payBack => {
              _this.payResult = true;
              // alert(JSON.stringify(payBack));
              if (payBack.err_msg == "get_brand_wcpay_request:ok") {
                _this.result = "支付成功!";
                setTimeout(() => {
                  _this.$router.push({
                    name: "order"
                  });
                }, 1500);
              } else {
                _this.result = "支付失败!";
                setTimeout(() => {
                  _this.$router.push({
                    name: "choose",
                    query: {
                      macno: _this.$route.query.macno
                    }
                  });
                }, 1500);
              }
            });
          }
        } else {
          _this.payResult = true;
          _this.result = res.data.msg;
          setTimeout(() => {
            _this.$router.push({
              name: "choose",
              query: {
                macno: _this.$route.query.macno
              }
            });
          }, 1500);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.name {
  right: 20px;
}
</style>

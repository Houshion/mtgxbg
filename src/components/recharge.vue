<template>
  <div id="recharge" class="pd-15">
    <div class="chargeBox radius10 bfff pd-15">
      <div class="title">充值金额</div>
      <div class="flex flexStart font26 border-b pd-tb-30">
        <div class="wd-10">￥</div>
        <div class="wd-85">
          <input
            type="number"
            placeholder
            class="moneyNum font26"
            v-model="chargeMoney"
            onkeyup="this.value=this.value.replace(/[^0-9]/g,'')"
          >
        </div>
      </div>
      <div class="c999 pd-t-15">钱包余额￥{{money}}</div>
    </div>
    <div class="btn mainBtn" @click="recharge">微信充值</div>
    <toast
      v-model="toastMsg.status"
      type="text"
      :time="1500"
      is-show-mask
      position="middle"
    >{{ toastMsg.content }}</toast>
  </div>
</template>

<script>
export default {
  name: "recharge",
  data() {
    return {
      money: 10086,
      chargeMoney: "",
      toastMsg: {
        status: false,
        content: "充值成功"
      },
      jsApiParameters: {
        app: 123456
      }
    };
  },
  created() {
    const _this = this;
    _this.money = _this.$route.query.money;
  },
  methods: {
    recharge() {
      const _this = this;
      if (_this.chargeMoney == "") {
        _this.toastMsg = {
          status: true,
          content: "请输入金额"
        };
        return;
      }
      if (_this.chargeMoney < 0) {
        _this.toastMsg = {
          status: true,
          content: "金额不能小于0"
        };
        return;
      }
      _this.$vux.loading.show({
        text: "请稍候..."
      });
      _this.axios
        .post("Wxsite/User/api", {
          api_name: "recharge",
          money: _this.chargeMoney
        })
        .then(res => {
          _this.$vux.loading.hide();
          if (res.data.code == 1) {
            _this.jsApiParameters = res.data.data;
            //调用微信 支付
            _this.callpay(_this.jsApiParameters, payBack => {
              _this.toastMsg.status = true;
              if (payBack.err_msg == "get_brand_wcpay_request:ok") {
                setTimeout(() => {
                  _this.$router.push({
                    name: "wallet"
                  });
                }, 1500);
              } else {
                _this.toastMsg.content = "充值失败，请重试";
              }
            });
          }
        });
    }
  }
};
</script>

<style scoped>
.weui-cell:before {
  position: relative;
}
</style>

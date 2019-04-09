<template>
  <div id="scan">
    <loading :show="loadingMsg.status" :text="loadingMsg.text"></loading>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
export default {
  name: "scan",
  data() {
    return {
      weixinApiList: ["scanQRCode"],
      loadingMsg: {
        status: true,
        text: "请稍候..."
      }
    };
  },
  created() {
    const _this = this;
    _this.getWx(_this.weixinApiList);
  },
  mounted() {
    const _this = this;
    wx.ready(function() {
      _this.loadingMsg = false
      wx.scanQRCode({
        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function(res) {
          // alert(JSON.stringify(res));
          // _this.$router.push({
          //   name: "addPackage",
          //   query: {
          //     device_number: res.resultStr,
          //     // device_number: "1000100010001612",
          //     type: 1
          //   }
          // });
        },
        error: function(err) {
          dlctipbox.show(err);
        }
      });
    });
  }
};
</script>

<style>
</style>

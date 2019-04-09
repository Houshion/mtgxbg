// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
// import FastClick from 'fastclick'
import App from './App'
import router from './router'
import store from "./store"
// vux-uploader
import Uploader from 'vux-uploader'
/** Ocean自带组件 **/
import Ocean from '../static/js/components'
/** Ocean自带组件 **/
// 请求信息
// import axios from '../static/js/axios'
/* vux组件 */
import {
  Toast,
  Cell,
  CellBox,
  Group,
  Alert,
  Tab,
  TabItem,
  Swiper,
  SwiperItem,
  Confirm,
  Loading,
  ConfirmPlugin,
  LoadingPlugin,
  ToastPlugin
} from 'vux'
Vue.component('toast', Toast)
Vue.component('cell', Cell)
Vue.component('cell-box', CellBox)
Vue.component('group', Group)
Vue.component('alert', Alert)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('swiper', Swiper)
Vue.component('swiper-item', SwiperItem)
Vue.component('confirm', Confirm)
Vue.component('loading', Loading)
Vue.component('uploader', Uploader)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
/* vux组件 */

// axios请求
import axios from "../static/js/axios";
Vue.prototype.axios = axios;

Vue.use(Vuex)

Vue.config.productionTip = false

/**** 全局引用filters过滤器 ****/
/**
 * 转换时间
 * @author Ocean
 * @param {int} time 传入时间戳
 * @param {string} ff 转换日期格式 Y-m-d 等，下方有著明
 */
Vue.filter('timeStr', function (time, ff) {
  if (Number(time).toString().length == 10) {
    time = Number(time + "000")
  }
  time = new Date(time);
  var year = time.getFullYear();
  var month =
    time.getMonth() + 1 < 10 ?
    "0" + (time.getMonth() + 1) :
    time.getMonth() + 1;
  var date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  var hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  var minute =
    time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  var second =
    time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
  if (ff == "Y-m-d") {
    return year + "-" + month + "-" + date;
  } else if (ff == "Y-m-d H:i:s") {
    return (
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      second
    );
  } else if (ff == "Y-m-d H:i") {
    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
  } else if (ff == "Y.m.d") {
    return year + "." + month + "." + date;
  } else if (ff == "Y.m.d H:i:s") {
    return (
      year +
      "." +
      month +
      "." +
      date +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      second
    );
  } else if (ff == "Y.m.d H:i") {
    return year + "." + month + "." + date + " " + hour + ":" + minute;
  }
})
/**
 * 正数计时器
 * @author Ocean
 * @param {int} value 传入时间，单位 秒
 */
Vue.filter('countTime', function (value) {
  let theTime = parseInt(value)
  let theTime1 = 0
  let theTime2 = 0
  let theTime3 = 0;
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60)
      theTime1 = parseInt(theTime1 % 60)
      if (theTime2 > 24) {
        theTime3 = parseInt(theTime2 / 24);
        theTime2 = theTime2 = parseInt(theTime2 % 24);
      }
    }
  }
  let result = '' + parseInt(theTime) + '秒'
  if (theTime1 > 0) {
    result = '' + parseInt(theTime1) + '分' + result
  }
  if (theTime2 > 0) {
    result = '' + parseInt(theTime2) + '小时' + result
  }
  if (theTime3 > 0) {
    result = "" + parseInt(theTime3) + "天" + result;
  }
  return result
})

/**** 全局引入微信jssdk调用信息 ****/
// import weixin from '../static/js/weixin-jssdk'
import wx from "weixin-js-sdk";
Vue.prototype.getWx = (jsApiList) => {
  const _this = this;
  axios.post("Wxsite/Device/getTicket", {}).then(res => {
    let timestamp = (new Date().getTime() / 1000).toFixed(0);
    let noncestr = Math.random()
      .toString(36)
      .substr(2);
    // let ticket = wx_js(res.data.data.result.ticket, timestamp, noncestr);
    let e = decodeURIComponent(
        "jsapi_ticket=" +
        res.data.data.result.ticket +
        "&noncestr=" +
        noncestr +
        "&timestamp=" +
        timestamp +
        "&url=" +
        location.href.split("#")[0]
      ),
      s = new jsSHA(e, "TEXT"),
      ticket = s.getHash("SHA-1", "HEX");
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端//alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: res.data.data.appid, // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: noncestr, // 必填，生成签名的随机串
      signature: ticket, // 必填，签名，见附录1
      jsApiList: jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
  });
}
/**** 全局引入微信支付动作 ****/
Vue.prototype.callpay = (jsApiParameters, callback) => {
  if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
      document.addEventListener(
        "WeixinJSBridgeReady",
        jsApiCall,
        false
      );
    } else if (document.attachEvent) {
      document.attachEvent("WeixinJSBridgeReady", jsApiCall);
      document.attachEvent("onWeixinJSBridgeReady", jsApiCall);
    }
  } else {
    WeixinJSBridge.invoke(
      "getBrandWCPayRequest",
      jsApiParameters, // 提交的支付信息
      function (payBack) {
        WeixinJSBridge.log(payBack.err_msg);
        callback(payBack)
        // if (payBack.err_msg == "get_brand_wcpay_request:ok") {
        //   setTimeout(() => {
        //     _this.$router.push({
        //       name: "wallet"
        //     });
        //   }, 1500);
        // } else {
        //   _this.toastMsg.content = "充值失败，请重试";
        // }
      }
    );
  }
}

/* 创建Vue实例 */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
// 路由钩子函数，页面添加title
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // if (to.path === '/author') {
  next()
  // } else {
  //   setToUrl(to.fullPath)
  //   next('/author')
  // }
})

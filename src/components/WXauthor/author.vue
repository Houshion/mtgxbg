<template>
  <div id="author"></div>
</template>
<script>
import { getToUrl, setToken, setUid } from "../assets/lib/util"; // 封装的缓存方法
var url = getToUrl();
export default {
  created() {
    var code = this.GetUrlParame("code"); // 截取code
    console.log(code);
    if (!code) {
      var domine = window.location.href.split("#")[0]; // 微信会自动识别#    并且清除#后面的内容
      this.$axios
        .post("/OAutho/OAuthUrl?Ourl=" + domine) // 如果没有code，说明用户还没授权   将当前地址传递给后台
        .then(res => {
          // 正则处理后台返回的链接
          var url = /http\S*t/g.exec(res.data.url);
          url = url[0].replace(/\\u0026/g, "&");
          window.location.href = url;
        });
    } else {
      this.$http
        .post("/OAutho/OAuthHandle?code=" + code) //如果有code，说明用户点击了授权  将获取到的code传递给后台
        .then(res => {
          // 返回状态和UId
          console.log(res.data);
          this.uid = res.data.UId;
          setUid(this.uid);
          if (res.data.status && this.uid) {
            window.location.replace("http://wenlian.cct.work/dist/#" + url);
          }
        });
    }
  },
  data() {
    return {
      uid: ""
    };
  },
  methods: {
    // 截取code
    GetUrlParame(parameName) {
      /// 获取地址栏指定参数的值
      /// <param name="parameName">参数名</param>
      // 获取url中跟在问号后面的部分
      var parames = window.location.search;
      // 检测参数是否存在
      if (parames.indexOf(parameName) > -1) {
        var parameValue = "";
        parameValue = parames.substring(
          parames.indexOf(parameName),
          parames.length
        );
        // 检测后面是否还有参数
        if (parameValue.indexOf("&") > -1) {
          // 去除后面多余的参数, 得到最终 parameName=parameValue 形式的值
          parameValue = parameValue.substring(0, parameValue.indexOf("&"));
          // 去掉参数名, 得到最终纯值字符串
          parameValue = parameValue.replace(parameName + "=", "");
          return parameValue;
        }
        return "";
      }
    }
  }
};
</script>

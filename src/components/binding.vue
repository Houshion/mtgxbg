<template>
  <div id="binding" class="h100 bfff">
    <div class="flex h100">
      <div class="old wd-80 tal mg-b-20" v-show="oldPhone!=''">
        <div class="fontb">原手机号 {{oldPhone}}</div>
        <div class="c999">请输入新手机号进行绑定</div>
      </div>
      <div class="input flex flexStart mg-b-20 border radius30">
        <div class="img">
          <img src="../assets/i_phone.png" class="icon wd-100">
        </div>
        <input class="wd-80" type="text" maxlength="11"  onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" v-model="phone" placeholder="请输入手机号码">
      </div>
      <div class="input flex flexStart wd-80 mg-b-20 border radius30">
        <div class="img">
          <img src="../assets/i_pass.png" class="icon wd-100">
        </div>
        <input type="text" class="wd-50" v-model="code" placeholder="请输入验证码">
        <div class="getCode border-l wd-35 box" @click="getCode">{{str}}</div>
      </div>
      <div class="btn mainBtn" @click="bingdingPhone">绑定</div>
    </div>
    <toast v-model="toast" type="text" :time="1500" position="middle" >{{ toastContent }}</toast>
  </div>
</template>

<script>
export default {
  name: "binding",
  data() {
    return {
      phone: "",
      oldPhone: "",
      code: "",
      sendCode: true,
      toast: false,
      toastContent: "",
      interval: "",
      time: 60,
      str: "获取验证码",
      bindingStatus: true
    };
  },
  created() {
    const _this = this;
    _this.oldPhone = _this.$route.query.phone;
    _this.phone = _this.oldPhone != "" ? _this.oldPhone : "";
  },
  methods: {
    getCode() {
      const _this = this;
      if (_this.phone && _this.isPhone(_this.phone)) {
        if (_this.sendCode) {
          _this.axios
            .post("Wxsite/User/api", {
              api_name: "send_code",
              mobile: _this.phone
            })
            .then(res => {
              _this.sendCode = false;
              _this.toast = true;
              _this.toastContent = res.data.msg;
              if (res.data.code == 1) {
                // 设置定时器倒计时
                _this.interval = setInterval(() => {
                  _this.time--;
                  if (_this.time > 0) {
                    _this.str = _this.time + "s";
                  } else {
                    _this.sendCode = true;
                    _this.str = "获取验证码";
                    clearInterval(_this.interval);
                  }
                }, 1000);
              } else {
              }
            });
        }
      } else if (_this.isPhone(_this.phone)) {
        _this.toast = true;
        _this.toastContent = "手机号不能为空";
      } else {
        _this.toast = true;
        _this.toastContent = "手机号码格式有误，请检查";
      }
    },
    bingdingPhone() {
      const _this = this;
      if (_this.bindingStatus) {
        _this.axios
          .post("Wxsite/User/api", {
            api_name: "bind_mobile",
            mobile: _this.phone,
            code: _this.code
          })
          .then(res => {
            _this.toast = true;
            _this.toastContent = res.data.msg;
            if (res.data.code == 1) {
              _this.bindingStatus = false;
              setTimeout(() => {
                $router.go(-1);
              }, 1500);
            }
          });
      }
    },
    isPhone(phone) {
      if (/^1[3|4|5|7|8][0-9]\d{8}$/.test(phone)) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style>
</style>

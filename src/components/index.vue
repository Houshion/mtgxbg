<template>
  <div id="index" class="pd-15 bfff" v-show="show">
    <div class="title">
      <div class="mainTitle fontb">请选择您要租用的柜子</div>
      <div class="cccc">灰色状态是已被租用的柜子，不能选择</div>
    </div>
    <div class="boxes pd-15 flex flexStart mg-b-10">
      <div
        class="box boxList"
        :class="[item.pick ? 'boxList2' : '',item.status == 1 ? 'boxList1' : 'boxList0']"
        v-for="(item,index) in boxes"
        :key="index"
        @click="choose(index,item.device_id,item.id)"
      >{{item.number}}</div>
    </div>
    <div class="price mg-b-30">
      租借费
      <span class="orange">{{price.item.price}}元/天</span> | 电费
      <span class="orange">{{price.eleitem.price}}元/度</span>
    </div>
    <div class="title">
      <div class="mainTitle fontb">租用、费用说明</div>
      <div class="cccc" style="overflow-wrap:break-word;" v-html="useMsg">{{ useMsg }}</div>
    </div>
    <div class="mainBtn confirm" @click="goPay">去租用</div>
    <div class="tac cmain mg-t-10" @click="showAlert">《使用须知》</div>
    <!-- alert弹窗 -->
    <alert v-model="alert" @on-hide="!alert" title="使用须知">
      <div v-html="alertMsg">{{ alertMsg }}</div>
    </alert>
    <!-- toast提示 -->
    <toast v-model="toast.status" type="text" :time="1500" position="middle">{{ toast.text }}</toast>
  </div>
</template>

<script>
import Vuex from "vuex"; //引用vuex
export default {
  name: "index",
  data() {
    return {
      alert: false,
      alertMsg: "这是文本文本文本文本文本文本文本文本",
      boxes: [
        // { number: "01", status: false, pick: false },
        // { number: "02", status: true, pick: false },
        // { number: "03", status: true, pick: true },
        // { number: "04", status: true, pick: false },
        // { number: "05", status: true, pick: false },
        // { number: "06", status: true, pick: false },
        // { number: "07", status: false, pick: false },
        // { number: "08", status: true, pick: false }
      ],
      price: {
        item: {
          price: "0.00"
        },
        eleitem: {
          price: "0.00"
        }
      },
      useMsg: "这是文本文本文本文本文本文本文本文本",
      query: {
        macno: this.$route.query.macno,
        code: "",
        id: 0
      },
      appid: "",
      show: false,
      toast: {
        status: false,
        text: ""
      }
    };
  },
  computed: Vuex.mapState(["code"]),
  created() {
    const _this = this;
    _this.axios
      .post("Wxsite/Device/api", {
        api_name: "device_info",
        macno: _this.$route.query.macno
      })
      .then(res => {
        console.log(res);
        if (res.data.code == 1) {
          res.data.data.list.forEach(item => {
            item.pick = false;
            item.status == 1 ? (item.status = true) : (item.status = false);
          });
          _this.boxes = res.data.data.list;
          _this.appid = res.data.data.agent_appid;
          _this.getCode();
        } else {
          _this.toast.status = true;
          _this.toast.text = res.data.msg;

          _this.$vux.toast.text(res.data.msg, "bottom");
          setTimeout(() => {
            WeixinJSBridge.call("closeWindow");
          }, 1500);
        }
      });
  },
  mounted() {
    const _this = this;
    _this.axios
      .post("Wxsite/User/api", {
        api_name: "notes_info"
      })
      .then(res => {
        _this.alertMsg = res.data.data.notes;
        _this.useMsg = res.data.data.charging;
      });
  },
  methods: {
    getCode() {
      if (!this.$route.query.code) {
        if (!this.appid) {
          return (this.show = true);
        }
        location.href =
          "http://mtzhll.shmtshiye.com/Wxsite/Auth/getCode?macno=" +
          // "http://mtgxbg.app.xiaozhuschool.com/Wxsite/Auth/getCode?macno=" +
          this.$route.query.macno +
          "&appid=" +
          this.appid;
      } else {
        this.query.code = this.$route.query.code;
        this.show = true;
      }
    },
    choose: function(index, deviceId, id) {
      const _this = this;
      if (_this.boxes[index].status) {
        _this.boxes.forEach(item => {
          item.pick = false;
        });
        _this.boxes[index].pick = true;
        _this.query.id = _this.boxes[index].id;
        _this.axios
          .post("Wxsite/Device/api", {
            api_name: "guizi_item",
            device_id: deviceId,
            id: id
          })
          .then(res => {
            _this.price = res.data.data;
          });
      }
    },
    showAlert() {
      const _this = this;
      _this.alert = true;
    },
    goPay() {
      const _this = this;
      if (_this.query.id == 0) {
        _this.toast.status = true;
        _this.toast.text = "请选择要租用的冰柜";
        return false;
      }
      _this.$router.push({
        name: "pay",
        query: _this.query
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>


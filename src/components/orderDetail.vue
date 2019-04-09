<template>
  <div id="orderDetail">
    <div class="orderDetail mg-b-45">
      <div class="orderTop bfff pd-15 mg-b-10">
        <div class="orderStatus flex flexStart">
          <div class="icon">
            <img src="../assets/i_status1.png" class="wd-100">
          </div>
          <div>{{status}}</div>
        </div>
        <div class="countMoney pd-tb-10">
          租用费用：
          <span class="orange fontb">￥{{orderMsg.item_price}}</span>
        </div>
      </div>
      <div class="mark pd-15 flex flexStart mg-b-10 bfff" @click="changeRemark">
        <div class="icon">
          <img src="../assets/i_feedback.png" class="wd-100">
        </div>
        <span class="cbbb">备注：</span>
        {{orderMsg.remark}}
      </div>
      <div class="orderMsg pd-15 mg-b-10 bfff">
        <div class="orderNo mg-b-5">
          <span class="cbbb">订单编号：</span>
          {{ orderMsg.order_no }}
        </div>
        <div class="orderTime mg-b-5 flex flexBetween">
          <div>
            <span class="cbbb">设备编号：</span>
            {{ orderMsg.macno }}
          </div>
          <div
            :class="orderMsg.device_status == 3 ? 'cred':'cmain'"
          >{{ orderMsg.device_status == 3 ? "设备故障" : "设备正常" }}</div>
        </div>
        <div class="orderTime mg-b-5">
          <span class="cbbb">柜子编号：</span>
          {{ orderMsg.number }}
        </div>
        <div class="orderTime mg-b-5">
          <span class="cbbb">设备位置：</span>
          {{ orderMsg.address }}
        </div>
        <div class="orderTime mg-b-5">
          <span class="cbbb">租用时间：</span>
          {{ orderMsg.rent_start | timeStr("Y.m.d H:i:s") }}
        </div>
        <div class="endTime mg-b-5" v-show="orderMsg.device_status == 3">
          <span class="cbbb">结束时间：</span>
          {{ orderMsg.end_time | timeStr("Y.m.d H:i:s") }}
        </div>
      </div>
      <div class="deviceMsg pd-15 mg-b-10 bfff">
        <div class="price mg-b-5">
          <span class="cbbb">租用计费：</span>
          {{ orderMsg.item_price }}元/天
        </div>
        <div class="electricPrice mg-b-5">
          <div>
            <span class="cbbb">用电计费：</span>
            {{ orderMsg.eleitem_price }}元/度
          </div>
        </div>
        <div class="electricNum mg-b-5">
          <span class="cbbb">用电度数：</span>
          {{ orderMsg.kwh }}度
        </div>
        <div class="time mg-b-5" v-if="orderMsg.order_status == 1">
          <span class="cbbb">租用时长：</span>
          {{ orderMsg.time | countTime }}
        </div>
        <div class="time mg-b-5" v-else>
          <span class="cbbb">租用时长：</span>
          {{ orderMsg.time | countTime }}
          <!-- <span class="cbbb">租用时长： </span>{{ orderMsg.timeStr }} -->
        </div>
      </div>
      <!-- <div class="deviceStutas flex flexStart pd-15 mg-b-10 bfff">
        <div class="wd-50 temperature1 mg-b-5">
          <span class="cbbb">室内温度： </span>
          {{orderMsg.temperature1}}℃
        </div>
        <div class="wd-50 temperature2 mg-b-5">
          <span class="cbbb">蒸发器温度： </span>
          {{orderMsg.temperature2}}℃
        </div>
      </div>-->
    </div>
    <!-- <footer> -->
    <footer v-show="orderMsg.order_status == '1' ? true : false">
      <div class="box btn mainBtn1 bfff" @click="close">结束订单</div>
      <div class="box btn mainBtn" @click="open">{{!op?"开锁":"关锁"}}</div>
    </footer>
    <!-- toast信息提示 -->
    <toast
      v-model="toast.status"
      type="text"
      :time="1800"
      is-show-mask
      position="middle"
    >{{ toast.text }}</toast>
    <!-- confirm信息提示 -->
    <confirm
      v-model="confirm.status"
      :title="confirm.title"
      :confirm-text="confirm.button"
      @on-confirm="callSevice"
    >
      <p style="text-align:center;">{{ confirm.content }}</p>
    </confirm>
    <confirm
      v-model="confirm2.status"
      :title="confirm2.title"
      :confirm-text="confirm2.button"
      @on-confirm="callSevice2"
    >
      <p style="text-align:center;">{{ confirm2.content }}</p>
    </confirm>
  </div>
</template>

<script>
import Vue from "vue";
import { setInterval, clearInterval } from "timers";
export default {
  name: "orderDetail",
  data() {
    return {
      toast: {
        text: "成功",
        status: false
      },
      confirm: {
        status: false,
        title: "",
        content: "这是content",
        button: "确认"
      },
      confirm2: {
        status: false,
        title: "",
        content: "这是content",
        button: "确认"
      },
      status: "",
      op: false,
      personalMoney: 0,
      orderMsg: {
        order_id: "1",
        order_no: "Device201810231639576438", //订单编号
        macno: "bbb123", //设备号
        rent_start: "1540283997", //设备开始运行时间
        kwh: "20", //用电量
        end_time: "1540608709", //结束时间
        should_money: "22.00", //预交的租用金额
        money: 129, //总计金额
        paytime: "0", //付款时间
        number: "1", //柜子编号
        address: "星河传说星河城", //地址
        device_status: "1", //设备状态 1运行中 2禁用中（空闲中） 3故障
        item_price: "22.00", //租金费用 /天
        eleitem_price: "1.20", //电费 /度
        day: 5, //租用天数
        hour: 21, //租用小时数
        minute: 48, //租用分钟
        sec: 20,
        time: 2000,
        timeStr: "0天0小时0分0秒",
        remark: "abc"
      },
      interval: "",
      intervalCheck: ""
    };
  },
  created() {
    const _this = this;
    // 初始化获取信息
    _this.init();
    // 获取个人信息
    _this.axios
      .post("Wxsite/User/api", {
        api_name: "consumption_log"
      })
      .then(res => {
        _this.personalMoney = res.data.data.money;
      });
  },
  methods: {
    init() {
      const _this = this;
      _this.axios
        .post("Wxsite/Order/api", {
          api_name: "orderInfo",
          id: _this.$route.query.id
        })
        .then(res => {
          // _this.orderMsg = res.data.data.data.order;
          if (res.data.data.data.order.order_status == 1) {
            _this.status = "使用中";
          } else if (res.data.data.data.order.order_status == 2) {
            _this.status = "已完成";
          } else {
            _this.status = "异常";
          }
          /* 使用时长累加，测试 */
          res.data.data.data.order.time =
            Date.parse(new Date()) / 1000 - res.data.data.data.order.rent_start;
          _this.orderMsg = res.data.data.data.order;
          if (res.data.data.data.order.order_status == 1) {
            _this.interval = setInterval(() => {
              _this.orderMsg.time++;
            }, 1000);
          }

          // 检查当前门锁状态
          _this.checkOpenStatus();
        });
    },
    checkOpenStatus() {
      const _this = this;
      _this.axios
        .post("Wxsite/User/api", {
          api_name: "check_lock",
          macno: _this.orderMsg.macno,
          number: _this.orderMsg.number
        })
        .then(res => {
          if (res.data.data == 1) {
            _this.op = true;
          }
        });
    },
    // 开关锁
    open() {
      const _this = this;
      if (_this.personalMoney < _this.orderMsg.money) {
        _this.confirm = {
          title: "",
          content:
            "您当前的租赁费用已经超过钱包的余额，请及时充值，才能正常开启冰柜阀门",
          button: "去充值"
        };
        _this.confirm.status = true;
      } else {
        _this.$vux.loading.show({
          text: "请稍候..."
        });
        _this.axios
          .post("Wxsite/Device/api", {
            api_name: "operation",
            macno: _this.orderMsg.macno,
            guizi_num: _this.orderMsg.number,
            op: _this.op ? 2 : 1,
            id: _this.$route.query.id
          })
          .then(res => {
            if (res.data.code == 1) {
              _this.checkLockStatus(res.data.data);
              _this.intervalCheck = setInterval(() => {
                _this.checkLockStatus(res.data.data);
              }, 3000);
            } else {
              _this.$vux.loading.hide();
              _this.toast = {
                text: res.data.msg,
                status: true
              };
            }
          });
      }
    },
    // 查询是否开启/关闭成功
    checkLockStatus(id) {
      const _this = this;
      _this.axios
        .post("Wxsite/Device/api", {
          api_name: "call_back",
          op_id: id
        })
        .then(res => {
          if (res.data.code == 1) {
            if (res.data.data != "") {
              clearInterval(_this.intervalCheck);
              _this.$vux.loading.hide();
              if (res.data.data[0].status == "success") {
                _this.toast = {
                  text: _this.op ? "冰柜门锁已关闭" : "冰柜门锁已打开",
                  status: true
                };
                _this.op = !_this.op;
              } else {
                _this.toast = {
                  text: "请求硬件失败，请重试",
                  status: true
                };
              }
            }
          } else {
            _this.toast = {
              text: res.data.msg,
              status: true
            };
          }
        });
    },
    close() {
      const _this = this;
      // if (_this.personalMoney > _this.orderMsg.money) {
      _this.confirm2 = {
        title: "结束订单",
        content: "结束订单前请打开冰柜取回储存的物品，已取出请确认结束",
        button: "确认结束订单"
      };
      // } else {
      //   _this.confirm = {
      //     title: "",
      //     content:
      //       "您当前的租赁费用已经超过钱包的余额，请及时充值，才能正常开启冰柜阀门",
      //     button: "去充值"
      //   };
      // }
      _this.confirm2.status = true;
    },
    // 修改订单备注
    changeRemark() {
      const _this = this;
      _this.$vux.confirm.prompt("请输入备注", {
        title: "修改备注",
        onShow() {
          // _this.$vux.confirm.setInputValue("set input value");
        },
        onHide() {
          console.log("prompt hide");
        },
        onCancel() {
          console.log("prompt cancel");
        },
        onConfirm(remark) {
          _this.axios
            .post("Wxsite/Order/api", {
              api_name: "remark",
              id: _this.$route.query.id,
              remark: remark
            })
            .then(res => {
              _this.toast.status = true;
              _this.toast.text = res.data.msg;
              _this.orderMsg.remark = remark;
            });
        }
      });
    },
    callSevice2() {
      const _this = this;
      if (_this.op) {
        _this.toast.status = true;
        _this.toast.text = "冰柜门未关闭";
        return false;
      }
      _this.$router.push({
        name: "orderClose",
        query: {
          order_id: _this.orderMsg.id
        }
      });
    },
    callSevice() {
      const _this = this;
      if (_this.op) {
        _this.toast.status = true;
        _this.toast.text = "冰柜门未关闭";
        return false;
      }
      if (_this.personalMoney > _this.orderMsg.money) {
        if (_this.orderMsg.appid != "") {
          // 代理商订单，获取code后支付
          location.href =
            // "http://mtgxbg.app.xiaozhuschool.com/Wxsite/Auth/getCodeByOrderClose?order_id=" +
            "http://mtzhll.shmtshiye.com/Wxsite/Auth/getCodeByOrderClose?order_id=" +
            _this.orderMsg.id +
            "&appid=" +
            _this.orderMsg.appid;
        } else {
          // 非代理商订单，不用传code支付
          _this.$router.push({
            name: "orderClose",
            query: {
              order_id: _this.orderMsg.id
            }
          });
        }
      } else {
        _this.$router.push({
          name: "recharge",
          query: {
            money: _this.personalMoney
          }
        });
      }
    }
  }
};
</script>

<style scoped>
footer {
  position: fixed;
  height: 40px;
  display: flex;
  width: 100%;
  bottom: 0;
}
</style>

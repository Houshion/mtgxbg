<template>
  <div id="wallet">
    <div class="flex wallet pd-b-50">
      <div class="bg zi-1">
        <img src="../assets/bg2.png" class="po_fi">
      </div>
      <div class="c999 wd-100 tac pd-t-50">我的余额</div>
      <div class="money c999 wd-100 tac">
        <span class="font32 fontb c000">{{walletMsg.money}}</span>
        元
      </div>
      <router-link :to="{name: 'recharge', query: {money: walletMsg.money}}" class="btn mainBtn1 w100 tqac">充值</router-link>
    </div>
    <group title="钱包明细">
      <cell v-for="(item,index) in walletMsg.list" :key="index" :title="item.remark" :inline-desc='item.ctime | timeStr("Y-m-d H:i:s")'>
        <span :class="item.type == '1' ? 'c999' : 'orange'">{{item.type == "1" ? '+' : '-'}}{{item.money}}</span>
      </cell>
    </group>
  </div>
</template>

<script>
export default {
  name: "wallet",
  data() {
    return {
      walletMsg: {
        money: "0.00",
        list: [
          // {
          //   money: "10.00",
          //   ctime: "1534573673",
          //   type: "2",
          //   order_id: "1",
          //   remark: "消费"
          // }
        ]
      }
    };
  },
  created() {
    const _this = this;
    _this.init();
  },
  methods: {
    init() {
      const _this = this;
      _this.axios
        .post("Wxsite/User/api", {
          api_name: "consumption_log",
          page: 1,
          pagesize: 10
        })
        .then(res => {
          _this.walletMsg = res.data.data;
        });
    }
  }
};
</script>
<style scoped>
</style>

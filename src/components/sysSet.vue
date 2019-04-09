<template>
  <div id="sysSet">
    <group class="listBox bfff">
      <cell-box is-link v-for="(item,index) in list" :key="index" :link="{name:item.routerName}">
        <div class="flex">
          <div class="img">
            <img :src="item.icon" class="wd-100 icon">
          </div>
          <div class="name">{{item.name}}</div>
        </div>
      </cell-box>
    </group>
  </div>
</template>

<script>
export default {
  name: "sysSet",
  data() {
    return {
      list: [
        {
          icon: require("../assets/icon_money.png"),
          name: "我的钱包",
          routerName: "wallet"
        },
        {
          icon: require("../assets/icon_order.png"),
          name: "冰柜订单",
          routerName: "order"
        }
      ]
    };
  },

  components: {},

  created() {
    const _this = this;
  },

  mounted() {
    const _this = this;
  },
  methods: {}
};
</script>
<style lang='less' scoped>
</style>

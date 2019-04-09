<template>
  <div id="center">
    <div class="headImgBox tac">
      <!-- <div class="headBGImg">
          <img src="../assets/bg.png" class="wd-100">
        </div>
        <div class="headImg flex flexACenter cfff">
          <div class="wd-100">
            <img :src="userInfo.head_img" class="wd-100">
          </div>
          <div class="wd-100">
            <div>{{userInfo.nickname}}</div>
            <div>{{userInfo.mobile ? userInfo.mobile : "未绑定手机"}}</div>
          </div>
      </div>-->
      <group class="bfff">
        <cell-box is-link :link="{name: 'centerInfo'}" value="111">
          <div class="flex flexBetween wd-100">
            <div class="wd-60 flex flexStart flexVcenter">
              <div class="wd-100 tal font24 fontb">{{userInfo.nickname}}</div>
              <div class="wd-100 tal">{{userInfo.mobile ? userInfo.mobile : "未绑定手机"}}</div>
            </div>
            <div class="wd-30 img tal">
              <img :src="userInfo.head_img" class="wd-70">
            </div>
          </div>
        </cell-box>
      </group>
    </div>
    <div class="serverList mg-t-20">
      <div class="title fontb font18 pd-10">服务</div>
      <div class="flex flexAround">
        <router-link
          :to="{name:item.routerName}"
          class="wd-30 mg-tb-20"
          v-for="(item,index) in list"
          :key="index"
          v-if="index!=3"
        >
          <div class="img box mg-auto pd-10">
            <img :src="item.icon" class="icons">
          </div>
          <div class="name c000 tac">{{item.name}}</div>
        </router-link>
        <a class="wd-30 mg-tb-20" v-else :href="'tel:#'+list[3].phone">
          <div class="img box mg-auto pd-10">
            <img :src="list[3].icon" class="icons">
          </div>
          <div class="name c000 tac">{{list[3].name}}</div>
        </a>
      </div>
    </div>
    <!-- <group class="listBox bfff">
      <cell-box is-link v-for="(item,index) in list" :key="index" :link="{name:item.routerName}">
        <div class="flex">
          <div class="img">
            <img :src="item.icon" class="wd-100 icon">
          </div>
          <div class="name">{{item.name}}</div>
        </div>
      </cell-box>
    </group>-->
  </div>
</template>

<script>
export default {
  name: "center",
  data() {
    return {
      userInfo: {
        name: "Ocean",
        headImg: require("../assets/image.png"),
        phone: ""
      },
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
        },
        {
          icon: require("../assets/icon_help.png"),
          name: "使用指南",
          routerName: "help"
        },
        {
          icon: require("../assets/icon_service.png"),
          name: "客服服务",
          routerName: "feedback"
        },
        {
          icon: require("../assets/icon_about.png"),
          name: "关于我们",
          routerName: "about"
        },
        {
          icon: require("../assets/icon_system.png"),
          name: "系统设置",
          routerName: "sysSet"
        }
      ]
    };
  },
  methods: {
    init() {
      const _this = this;
      _this.axios
        .post("Wxsite/User/api", {
          api_name: "user_info"
        })
        .then(res => {
          _this.userInfo = res.data.data;
        });
    }
  },
  created() {
    const _this = this;
    _this.list[3].phone = localStorage.getItem("servicePhone");
    _this.init();
  }
};
</script>

<style scoped>
.weui-cells {
  margin-top: 0 !important;
}
#center {
  background: #ffffff;
  height: 100%;
}
</style>

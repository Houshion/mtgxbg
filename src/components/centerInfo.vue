<template>
  <div id="centerInfo">
    <!-- <div class="head bfff flex flexBetween">
      <div>头像</div>
      <div class="headImg">
        <img :src="userInfo.head_img" class="wd-100">
      </div>
    </div> -->
    <oHeadImg :headImg="userInfo.head_img"></oHeadImg>
    <group class="listBox bfff">
      <cell title="昵称" :value="userInfo.nickname"></cell>
      <!-- <cell title="手机号码" is-link :link="{name:item.routerName}"></cell> -->
      <cell title="手机号码" :value="userInfo.mobile ? userInfo.mobile : '未绑定' " is-link :link="{name: 'binding',query: { phone: userInfo.mobile}}"></cell>
    </group>
  </div>
</template>

<script>
import oHeadImg from "./myComponents/o-headImg.vue";
export default {
  name: "centerInfo",
  components: {
    oHeadImg
  },
  data() {
    return {
      userInfo: {
        head_img: require("../assets/image.png"),
        nickname: "Ocean",
        mobile: ""
      },
      uploadImg: {
        images: [],
        uploadUrl: "/Wxsite/User/api"
      }
    };
  },
  beforeCreate() {
    const _this = this;
    _this.axios
      .post("Wxsite/User/api", {
        api_name: "user_info"
      })
      .then(res => {
        _this.userInfo = res.data.data;
      });
  },
  methods: {
    uploadImage: function(data) {
      console.log(data);
    },
    change() {
      console.log(1111);
    },
    preview() {
      const _this = this;
      console.log(1);
    },
    addImage() {
      const _this = this;
      console.log(2);
    },
    removeImage() {
      const _this = this;
      console.log(3);
    }
  },
};
</script>

<style scoped>
</style>
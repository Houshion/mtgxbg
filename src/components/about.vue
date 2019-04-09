<template>
  <div id="about" class="pd-15" v-show="show">
    <div class="logo tac pd-t-20 pd-b-5">
      <img :src="about.logo" class="wd-100">
    </div>
    <div class="tac fontb font18">{{about.name}}</div>
    <div class="font16 ti2 mg-t-20" v-html="about.content">{{about.content}}</div>
    <div class="phone flex mg-t-50">
      <div class="icon">
        <img src="../assets/i_tel.png" class="wd-100">
      </div>
      <a :href="'tel:'+about.phone">{{about.phone}}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "about",
  data() {
    return {
      about: {
        logo: require("../assets/image.png"),
        name: "公司名称",
        content:
          "这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介这是简介",
        phone: "0769-85528886"
      },
      show: false
    };
  },
  created() {
    const _this = this;
    _this.axios
      .post("Wxsite/User/api", {
        api_name: "about_us"
      })
      .then(res => {
        _this.about.logo = res.data.data.img;
        _this.about.name = res.data.data.title;
        _this.about.content = res.data.data.content;
        _this.about.phone = res.data.data.phone;
        console.log(about);
        _this.show = true;
      });
  }
};
</script>

<style>
</style>

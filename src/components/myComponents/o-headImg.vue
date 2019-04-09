<template>
  <div id="o-headImg">
    <label>
      <input name="file" type="file" accept="image/*" @change="update" hidden>
      <div class="head bfff flex flexBetween flexVcenter">
        <div>头像</div>
        <div class="headImg">
          <img :src="head_img" class="wd-100">
        </div>
      </div>
    </label>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "o-upload",
  props: ["headImg"],
  data() {
    return {
      head_img: this.headImg
    };
  },
  created() {
    const _this = this;
    console.log(this.headImg);
  },
  beforeCreate() {
    const _this = this;
    _this.axios
      .post("Wxsite/User/api", {
        api_name: "user_info"
      })
      .then(res => {
        _this.head_img = res.data.data.head_img;
      });
  },
  methods: {
    addImg: function() {
      const _this = this;
    },
    update(e) {
      // 上传照片
      const _this = this;
      let file = e.target.files[0];
      console.log(file);
      /* eslint-disable no-undef */
      let param = new FormData(); // 创建form对象
      param.append("api_name", "headimg_edit");
      param.append("img", file, file.name); // 通过append向form对象添加数据
      console.log(param.get("file")); // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function(evt) {
        //console.log(evt.target)
        _this.head_img = evt.target.result;
      };
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };

      // 添加请求头
      axios
        .post(
          "http://mtzhll.shmtshiye.com/Wxsite/User/api",
          // "http://mtgxbg.app.xiaozhuschool.com/Wxsite/User/api",
          param,
          config
        )
        .then(res => {
          console.log(res);
        });
    }
  }
};
</script>
<style lang="less" scoped>
body {
  font-family: "微软雅黑" !important;
  font-size: 14px !important;
}
.o-wd-100 {
  width: 100%;
}
.o-wd-30 {
  width: 30%;
}
.o-wd-30:nth-child(3n-1) {
  // margin: 0 5%;
}
</style>

<template>
  <div id="o-upload">
    <div class="imgs flex flexStart flexWrap">
      <label class="o-wd-100">
        <input
          name="file"
          type="file"
          accept="image/png, image/gif, image/jpeg"
          @change="update"
          hidden
        >
        <div class="img o-wd-30">
          <img :src="imgs" class="o-wd-100">
        </div>
        <div class="addImg o-wd-30">
          <img src="../../assets/addImg.png" class="o-wd-100" v-show="show" @click="addImg">
        </div>
      </label>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "o-upload",
  props: ["content"],
  data() {
    return {
      imgs: "",
      show: true
    };
  },
  methods: {
    addImg: function() {
      const _this = this;
    },
    update(e) {
      // 上传照片
      const _this = this;
      let file = e.target.files[0];
      console.log(_this.content);
      /* eslint-disable no-undef */
      let param = new FormData(); // 创建form对象
      param.append("api_name", "upload_img");
      param.append("img", file, file.name); // 通过append向form对象添加数据
      console.log(param.get("file")); // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function(evt) {
        //console.log(evt.target)
        _this.imgs = evt.target.result;
        _this.show = false;
      };
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };

      // 添加请求头
      axios
        .post(
          // "http://mtgxbg.app.xiaozhuschool.com/Wxsite/User/api",
          "http://mtzhll.shmtshiye.com/Wxsite/User/api",
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

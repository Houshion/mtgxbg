<template>
  <div id="feedback">
    <div class="content pd-15 bfff">
      <!-- <o-textarea v-model="content" holder="请描述您的意见或者反馈内容"></o-textarea>
      <oUpload :content="content"></oUpload>-->
      <textarea
        name="content"
        id="content"
        cols="30"
        rows="10"
        placeholder="请描述您的意见或者反馈内容"
        v-model="feedbackMsg.content"
      ></textarea>
      <div class="imgs flex flexStart flexWrap">
        <label class="wd-100">
          <input name="file" type="file" accept="image/*" @change="update" hidden>
          <div class="img wd-30">
            <img :src="imgs" class="wd-100">
          </div>
          <div class="addImg wd-30">
            <img src="../assets/addImg.png" class="wd-100" v-show="show">
          </div>
        </label>
      </div>
    </div>
    <div class="mainBtn" @click="submit">提交</div>
    <toast v-model="toast" type="text" :time="1500" position="middle">{{ toastContent }}</toast>
  </div>
</template>

<script>
// import oUpload from "./myComponents/o-upload.vue";
import axios from "axios";
export default {
  name: "feedback",
  // components: {
  //   oUpload
  // },
  data() {
    return {
      toast: false,
      toastContent: "",
      imgs: "",
      show: true,
      feedbackMsg: {
        content: "",
        img: ""
      }
    };
  },
  created() {
    const _this = this;
  },
  methods: {
    submit: function() {
      const _this = this;
      _this.axios
        .post("Wxsite/User/api", {
          api_name: "feedback",
          content: _this.feedbackMsg.content,
          device_num: _this.$route.query.device_num,
          img: _this.feedbackMsg.img
        })
        .then(res => {
          _this.toast = true;
          _this.toastContent = res.data.msg;
          if (res.data.code == 1) {
            _this.router.go(-1);
          }
        });
    },
    update(e) {
      // 上传照片
      const _this = this;
      let file = e.target.files[0];
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
          _this.feedbackMsg.img = res.data.data.img_url;
        });
    }
  }
};
</script>

<style>
</style>

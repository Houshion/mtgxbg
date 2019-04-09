<template>
  <div id="tMap">
    <iframe
      id="geoPage"
      width="0"
      height="0"
      frameborder="0"
      style="display:none;"
      scrolling="no"
      src="https://apis.map.qq.com/tools/geolocation?key=4LYBZ-CHBRG-TIMQ3-I3N32-2LJ4K-FZBTY&referer=WXocean"
    ></iframe>
    <div class="titleBox tal flex" v-show="deviceBoxStatus">
      <div class="wd-80">
        <div>设备编号：{{ deviceMsg.macno }}</div>
        <div class="c999 mg-tb-10">{{ deviceMsg.address }}</div>
        <div class="flex c999 flexAround">
          <div>
            可用柜子：
            <span class="c000">{{deviceMsg.guizi}}</span>
          </div>
          <div>
            已租柜子：
            <span class="c000">{{deviceMsg.in_use}}</span>
          </div>
        </div>
      </div>
      <div class="wd-20 box tac" @click="navigation(deviceMsg)">
        <img src="../assets/Navigation.png" class="wd-50">
      </div>
    </div>
    <div class="operation flex flexBetween">
      <div class="wd-15 flex flexVEnd">
        <div @click="refresh">
          <img src="../assets/refresh.png" class="wd-100">
        </div>
        <!-- <router-link :to="{name: 'feedback',params:{device_num: deviceMsg.macno}}">
          <img src="../assets/feedback.png" class="wd-100">
        </router-link>-->
        <div @click="call">
          <img src="../assets/service.png" class="wd-100">
        </div>
      </div>
      <div class="wd-40" @click="scan">
        <!-- <router-link :to="{name: 'scan'}"> -->
        <img src="../assets/scan.png" class="wd-100">
        <!-- </router-link> -->
      </div>
      <div class="wd-15 flex flexVEnd">
        <router-link :to="{name: 'center'}" style="height:auto">
          <img src="../assets/person.png" class="wd-100">
        </router-link>
      </div>
    </div>
    <confirm v-model="show" title="联系客服" @on-confirm="callSevice">
      <p style="text-align:center;">{{ phone }}</p>
    </confirm>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
export default {
  name: "tMap",
  data() {
    return {
      map: true,
      loc: "",
      show: false,
      phone: 18820129123, //客服电话
      deviceBoxStatus: false,
      deviceMsg: {
        //设备信息
        macno: 123456,
        address: "广东省东莞市南城区高盛科技大厦303",
        availableBox: 5,
        usedBox: 3
      },
      diviceList: [],
      markerImage: require("../assets/marker.png"),
      weixinApiList: ["scanQRCode"]
    };
  },
  created() {
    console.log(localStorage.getItem("indexParam"));
  },
  mounted() {
    const _this = this;
    _this.getDeviceList();
    _this.axios
      .post("Wxsite/User/api", {
        api_name: "phone"
      })
      .then(res => {
        _this.phone = res.data.data.phone;
        localStorage.setItem("servicePhone", res.data.data.phone);
      });
    // _this.scan();
  },
  beforeMount() {
    const _this = this;
    _this.getWx(_this.weixinApiList);
  },
  methods: {
    refresh() {
      const _this = this;
      _this.map = true;
      _this.initMap(_this.loc);
    },
    scan() {
      wx.ready(function() {
        wx.scanQRCode({
          needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function(res) {
            // alert(JSON.stringify(res));
            // _this.$router.push({
            //   name: "addPackage",
            //   query: {
            //     device_number: res.resultStr,
            //     // device_number: "1000100010001612",
            //     type: 1
            //   }
            // });
          },
          error: function(err) {
            dlctipbox.show(err);
          }
        });
      });
    },
    // 获取设备列表
    getDeviceList() {
      const _this = this;
      _this.axios
        .post("Wxsite/Device/api", {
          api_name: "device_list"
        })
        .then(res => {
          _this.diviceList = res.data.data;
        });
    },
    /** 拨打客服电话 ↓ **/
    call() {
      const _this = this;
      _this.show = true;
    },
    callSevice() {
      const _this = this;
      console.log(_this.phone);
      window.location.href = "tel:" + _this.phone;
    },
    /** 拨打客服电话 ↑ **/
    // 获取定位信息
    Tmap() {
      const _this = this;
      window.addEventListener(
        "message",
        function(event) {
          if (event.data) {
            if (_this.map) {
              _this.initMap(event.data);
              _this.map = false;
              _this.loc = event.data; // 接收位置信息
            }
          }
        },
        false
      );
      // 设置6s超时，防止定位组件长时间获取位置信息未响应
      setTimeout(function() {
        if (!_this.loc) {
          console.log("定位超时");
        }
      }, 6000); // 6s为推荐值，业务调用方可根据自己的需求设置改时间，不建议太短
    },
    // 初始化地图信息
    initMap(loc) {
      const _this = this;
      if (_this.map) {
        let myLatlng = new qq.maps.LatLng(loc.lat, loc.lng);
        let myOptions = {
          zoom: 12,
          center: myLatlng,
          mapTypeId: qq.maps.MapTypeId.ROADMAP
        };
        // 创建地图实例
        let map = new qq.maps.Map(document.getElementById("tMap"), myOptions);
        // 创建定位中心覆盖物
        let marker = new qq.maps.Marker({
          position: myLatlng,
          map: map
        });
        // 添加其他标注
        _this.diviceList.forEach(item => {
          let location = new qq.maps.LatLng(item.lat, item.lng);
          let marker = new qq.maps.Marker({
            position: location,
            map: map
          });
          let anchor = new qq.maps.Point(0, 39),
            size = new qq.maps.Size(42, 68),
            origin = new qq.maps.Point(0, 0),
            markerIcon = new qq.maps.MarkerImage(
              _this.markerImage,
              size,
              origin,
              anchor
            );
          marker.setIcon(markerIcon);
          // 创建标注点击事件
          qq.maps.event.addListener(marker, "click", function() {
            _this.deviceBoxStatus = true;
            _this.deviceMsg = item;
          });
        });
      }
    },
    navigation(deviceMsg) {
      const _this = this;
      console.log(_this.loc);
      window.location.href =
        "https://apis.map.qq.com/uri/v1/routeplan?type=bus&from=" +
        _this.loc.addr +
        "&fromcoord=" +
        _this.loc.lat +
        "," +
        _this.loc.lng +
        "&to=" +
        deviceMsg.address +
        "&tocoord=" +
        deviceMsg.lat +
        "," +
        deviceMsg.lng +
        "&policy=1&referer=4LYBZ-CHBRG-TIMQ3-I3N32-2LJ4K-FZBTY";
    }
  },
  created: function() {
    const _this = this;
    _this.Tmap();
  }
};
</script>

<style>
</style>

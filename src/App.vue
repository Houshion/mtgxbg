<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
@import '../static/css/o_base.css'; /*引入公共样式*/
@import '../static/css/o_style.css'; /*引入该项目公共样式*/
#app {
  font-family: '微软雅黑';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}
</style>

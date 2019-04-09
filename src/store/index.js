import Vue from 'vue'; //引用vue
import Vuex from 'vuex'; //引用vuex
Vue.use(Vuex); //使用vuex
const state = {
  code: "asdfasdfasdf"
}
//生明一个常量mutations，将所有的mutation放入其中
const mutations = {
  //为nodeVoteCount加1
  saveCode(state, code) { //这里的state即是上面定义的state常量
    state.code = code;
    //根据具体情况，你还可以在这里写一些其它的逻辑来改变状态
  },
}
export default new Vuex.Store({ ////暴露Store对象
  state,
  mutations //将mutations进行暴露
})

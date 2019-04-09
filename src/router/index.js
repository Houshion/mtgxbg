import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// 路由相关路径
import pay from '../components/pay'
import scan from '../components/scan'
import tMap from '../components/tMap'
import help from '../components/help'
import about from '../components/about'
import index from '../components/index'
import order from '../components/order'
import wallet from '../components/wallet'
import center from '../components/center'
import sysSet from '../components/sysSet'
import choose from '../components/choose'
import binding from '../components/binding'
import feedback from '../components/feedback'
import recharge from '../components/recharge'
import centerInfo from '../components/centerInfo'
import orderClose from '../components/orderClose'
import orderDetail from '../components/orderDetail'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'tMap',
    component: tMap,
    meta: {
      title: '共享冰箱'
    }
  }, {
    path: '/pay',
    name: 'pay',
    component: pay,
    meta: {
      title: '租用预支付'
    }
  }, {
    path: '/help',
    name: 'help',
    component: help,
    meta: {
      title: '使用指南'
    }
  }, {
    path: '/scan',
    name: 'scan',
    component: scan,
    meta: {
      title: '扫一扫'
    }
  }, {
    path: '/about',
    name: 'about',
    component: about,
    meta: {
      title: '关于我们'
    }
  }, {
    path: '/index',
    name: 'index',
    component: index,
    meta: {
      title: '选柜子'
    }
  }, {
    path: '/order',
    name: 'order',
    component: order,
    meta: {
      title: '我的订单'
    }
  }, {
    path: '/wallet',
    name: 'wallet',
    component: wallet,
    meta: {
      title: '我的钱包'
    }
  }, {
    path: '/center',
    name: 'center',
    component: center,
    meta: {
      title: '个人中心'
    }
  }, {
    path: '/sysSet',
    name: 'sysSet',
    component: sysSet,
    meta: {
      title: '系统设置'
    }
  }, {
    path: '/choose',
    name: 'choose',
    component: choose,
    meta: {
      title: '选柜子'
    }
  }, {
    path: '/binding',
    name: 'binding',
    component: binding,
    meta: {
      title: '绑定手机号'
    }
  }, {
    path: '/feedback',
    name: 'feedback',
    component: feedback,
    meta: {
      title: '意见反馈'
    }
  }, {
    path: '/recharge',
    name: 'recharge',
    component: recharge,
    meta: {
      title: '充值'
    }
  }, {
    path: '/centerInfo',
    name: 'centerInfo',
    component: centerInfo,
    meta: {
      title: '个人资料'
    }
  }, {
    path: '/orderClose',
    name: 'orderClose',
    component: orderClose,
    meta: {
      title: '结束订单'
    }
  }, {
    path: '/orderDetail',
    name: 'orderDetail',
    component: orderDetail,
    meta: {
      title: '订单详情'
    }
  }]
})

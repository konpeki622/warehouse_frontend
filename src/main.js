// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource';
import 'element-ui/lib/theme-chalk/index.css'
import Vuex from 'vuex'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(VueResource)

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('menu_id');
//   if (token && to.path === '/404') {

//     switch (localStorage.getItem('menu_id')) {
//       case '0': {
//         next({path: '/worker'})
//         break;
//       }
//       case '1': {
//         next({path: '/manager'})
//         break;
//       }
//       case '2': {
//         next({path: '/admin'})
//         break;
//       }
//       default: break;
//     }
//   }
//   if (!token && !(to.path === '/login' || to.path === '/register')) {
//     next({ path: '/login' })
//   } else {
//     next()
//   }
//   if (token && to.path === '/login' || to.path === '/register') {
//     localStorage.removeItem('token');
//     localStorage.removeItem('menu_id');
//     if (!localStorage.getItem('checked')) {
//       localStorage.removeItem('password');
//     }
//   }
// });

Date.prototype.format = function(fmt)
{
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "H+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

/* eslint-disable no-new */
new Vue({
  //el: '#app',
  router,
  //components: { App },
  render: h => h(App)
}).$mount('#app');

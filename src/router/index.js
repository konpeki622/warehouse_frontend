import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import NotFound from '../components/404.vue'
import Home from '../components/Home.vue'
// 原料管理员
import wInventory from '../components/worker/Inventory.vue'
import wStock from '../components/worker/StockList.vue'
import wShelveInfo from '../components/worker/ShelveInfo.vue'
// 经理
import mStock from '../components/manager/StockList.vue'
import mGoodsInventory from '../components/manager/GoodsInventory.vue'
import mInventory from '../components/manager/Inventory.vue'
import mStockGraph from '../components/manager/StockGraph.vue'
import mUserList from '../components/manager/UserList.vue'
// 系统管理员
import aMaterial from '../components/admin/MaterialList.vue'
import aPrintHistory from '../components/admin/PrintHistory.vue'
import aUpdateHistory from '../components/admin/UpdateHistory.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/worker',
      component: Home,
      name: '原料管理',
      iconCls: 'el-icon-document',//图标样式class
      redirect: '/worker/stock',
      children: [
        { path: '/worker/stock', component: wStock, name: '原料信息' },
        { path: '/worker/inventory', component: wInventory, name: '订单管理' },
        { path: '/worker/shelve', component: wShelveInfo, name: '库存信息'},
        // { path: '/worker/material', component: wMaterial, name: '原料管理'},
      ]
    },
    {
      path: '/manager',
      component: Home,
      name: '台账管理',
      iconCls: 'el-icon-date',//图标样式class
      redirect: '/manager/stock',
      children: [
        { path: 'stock', component: mStock, name: '原料信息', hidden: false },
        { path: 'inventory', component: mInventory, name: '订单管理', hidden: false },
        { path: 'goodsInventory', component: mGoodsInventory, name: '单个流水', hidden: true},
        { path: 'goodsGraph', component: mStockGraph, name: '统计图表', hidden: false},
        { path: 'userList', component: mUserList, name: '人员管理', hidden: false}
      ]
    },
    {
      path: '/admin',
      component: Home,
      name: '系统管理',
      iconCls: 'el-icon-setting',
      redirect: '/admin/material',
      children: [
        { path: '/admin/material', component: aMaterial, name: '原料管理' },
        { path: '/admin/printHistory', component: aPrintHistory, name: '打印记录' },
        { path: '/admin/updateHistory', component: aUpdateHistory, name: '更新记录' }
      ]
    },
    {
      path: '/login',
      component: Login,
      name: 'login',
    },
    {
      path: '/register',
      component: Register,
      name: 'register',
    },
    {
      path: '/404',
      component: NotFound,
      name: '404',
    },
    {
      path: '*',
      redirect: { path: '/404' }
    }]
});

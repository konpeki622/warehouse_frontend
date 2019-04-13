import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import NotFound from '../components/404.vue'
import Home from '../components/Home.vue'
// 原料管理员
import wInventory from '../components/Inventory.vue'
import wStock from '../components/StockList.vue'
import wMaterial from '../components/MaterialList.vue'
// 经理
import mStock from '../components/StockList.vue'
import mGoodsInventory from '../components/GoodsInventory.vue'
import mInventory from '../components/Inventory.vue'
import mStockGraph from '../components/StockGraph.vue'
// 系统管理员
import aMaterial from '../components/MaterialList.vue'
import aPrintHistory from '../components/PrintHistory.vue'
import aUpdateHistory from '../components/UpdateHistory.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/worker',
      component: Home,
      name: '原料管理',
      iconCls: 'el-icon-message',//图标样式class
      redirect: '/worker/stock',
      children: [
        { path: '/worker/stock', component: wStock, name: '库存信息' },
        { path: '/worker/inventory', component: wInventory, name: '库存流水' },
        { path: '/worker/material', component: wMaterial, name: '原料管理'},
      ]
    },
    {
      path: '/manager',
      component: Home,
      name: '台账管理',
      iconCls: 'el-icon-message',//图标样式class
      redirect: '/manager/stock',
      children: [
        { path: '/manager/stock', component: mStock, name: '库存信息', hidden: false },
        { path: '/manager/inventory', component: mInventory, name: '库存流水', hidden: false },
        { path: '/manager/goodsInventory', component: mGoodsInventory, name: '单个流水', hidden: true},
        { path: '/manager/goodsGraph', component: mStockGraph, name: '统计图表', hidden: false}
      ]
    },
    {
      path: '/admin',
      component: Home,
      name: '系统管理',
      iconCls: 'fa fa-bar-chart',
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

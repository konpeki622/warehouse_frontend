import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import NotFound from '../components/404.vue'
import Home from '../components/Home.vue'
import Inventory from '../components/Inventory.vue'
import Stock from '../components/StockList.vue'
import Material from '../components/MaterialList.vue'
import GoodsGraph from '../components/GoodsGraph.vue'
import GoodsInventory from '../components/GoodsInventory.vue'
import PrintHistory from '../components/PrintHistory.vue'
import UpdateHistory from '../components/UpdateHistory.vue'

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
        { path: '/worker/stock', component: Stock, name: '库存信息' },
        { path: '/worker/inventory', component: Inventory, name: '库存流水' },
        { path: '/worker/material', component: Material, name: '原料管理'},
        { path: '/worker/goodsInventory', component: GoodsInventory, name: '单个流水'},
        { path: '/worker/charts', component: GoodsGraph, name: '图标'}
      ]
    },
    {
      path: '/manager',
      component: Home,
      name: '台账管理',
      iconCls: 'el-icon-message',//图标样式class
      redirect: '/manager/stock',
      children: [
        { path: '/manager/stock', component: Stock, name: '库存信息' },
        { path: '/manager/inventory', component: Inventory, name: '库存流水' },
        { path: '/manager/material', component: Material, name: '原料管理'},
        { path: '/manager/goodsInventory', component: GoodsInventory, name: '单个流水'}
      ]
    },
    {
      path: '/admin',
      component: Home,
      name: '系统管理',
      iconCls: 'fa fa-bar-chart',
      redirect: '/admin/material',
      children: [
        { path: '/admin/material', component: Material, name: '原料管理' },
        { path: '/admin/printHistory', component: PrintHistory, name: '打印记录' },
        { path: '/admin/updateHistory', component: UpdateHistory, name: '更新记录' }
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

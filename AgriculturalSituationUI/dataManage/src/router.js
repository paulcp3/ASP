/* eslint-disable no-new */
import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from './components/login/login'
import Home from './components/Home'
// 企业管理

import CustomerManage from './components/CompanyManage/CustomerManage'
import PurchaseManage from './components/CompanyManage/PurchaseManage'
import AgriculturalService from './components/CompanyManage/AgriculturalService'
import RuleDefense from './components/CompanyManage/RuleDefense'
// import PriceManage from './components/CompanyManage/PriceManage'
import AuditResults from './components/CompanyManage/AuditResults'

//网站管理
import BannerManage from './components/WEBManage/BannerManage'
// import PictureManage from './components/WEBManage/PictureManage'
import ColumnManage from './components/WEBManage/ColumnManage'

//
import UserManage from './components/SystemManage/UserManage'

Vue.use(VueRouter)
    // 2. 定义路由
    // 每个路由应该映射一个组件。 其中"component" 可以是
    // 通过 Vue.extend() 创建的组件构造器，
    // 或者，只是一个组件配置对象。

const routes = [{
        name: 'login',
        path: '/',
        component: Login
    }, {
        name: 'home',
        path: '/home',
        component: Home,
        redirect: '/CustomerManage',
        children: [
            {
                name: 'CustomerManage',
                path: '/CustomerManage',
                component: CustomerManage
            },{
                name: 'PurchaseManage',
                path: '/PurchaseManage',
                component: PurchaseManage
            },{
                name: 'AgriculturalService',
                path: '/AgriculturalService',
                component: AgriculturalService
            },{
                name: 'RuleDefense.vue',
                path: '/RuleDefense',
                component: RuleDefense
            },
            // {
            //     name: "PriceManage",
            //     path: "/PriceManage",
            //     component: PriceManage
            // },
            {
                name: "UserManage",
                path: "/UserManage",
                component: UserManage
            },{
                name: "BannerManage",
                path: "/BannerManage",
                component: BannerManage
            },
            // {
            //     name: "PictureManage",
            //     path: "/PictureManage",
            //     component: PictureManage
            // },
            {
                name: "ColumnManage",
                path: "/ColumnManage",
                component: ColumnManage
            },{
                name: "AuditResults",
                path: "/AuditResults",
                component: AuditResults
            }
        ]
    }]
    // 3. 创建 router 实例，然后传 `routes` 配置
    // 你还可以传别的配置参数
const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
})
export default router
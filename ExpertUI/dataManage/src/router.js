/* eslint-disable no-new */
import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from './components/login/login'
import Home from './components/Home'


//网站管理

import ExportManage from './components/WEBManage/ExportManage'
import ArticleListManage from './components/WEBManage/ArticleListManage'
import KnowledgeManage from './components/WEBManage/KnowledgeManage'
import Issue from './components/WEBManage/Issue'
import Cure from './components/WEBManage/Cure'
import ViedoManage from './components/WEBManage/ViedoManage'
import OnlineManage from './components/WEBManage/OnlineManage'
import UserQue from './components/WEBManage/UserQue'
import MyQue from './components/WEBManage/MyQue'
import Ans from './components/WEBManage/Ans'
import ArticleManage from './components/WEBManage/ArticleManage'
import UserManage from './components/WEBManage/UserManage'
import ConClunm from './components/WEBManage/ConClunm'
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
        redirect: '/ExportManage',
        children: [
            {
                name: "ExportManage",
                path: "/ExportManage",
                component: ExportManage
            },{
                name: "ArticleListManage",
                path: "/ArticleListManage",
                component: ArticleListManage
            },{
                name: "KnowledgeManage",
                path: "/KnowledgeManage",
                component: KnowledgeManage
            },{
                name: "Issue",
                path: "/Issue",
                component: Issue
            },{
                name: "Cure",
                path: "/Cure",
                component: Cure
            },{
                name: "ViedoManage",
                path: "/ViedoManage",
                component: ViedoManage
            },{
                name: "OnlineManage",
                path: "/OnlineManage",
                component: OnlineManage
            },{
                name: "UserQue",
                path: "/UserQue",
                component: UserQue
            },{
                name: "MyQue",
                path: "/MyQue",
                component: MyQue
            },{
                name: "Ans",
                path: "/Ans",
                component: Ans
            },{
                name: "ArticleManage",
                path: "/ArticleManage",
                component: ArticleManage
            },{
                name: "UserManage",
                path: "/UserManage",
                component: UserManage
            },{
                name: "ConClunm",
                path: "/ConClunm",
                component: ConClunm
            }
        ]
    }]
    // 3. 创建 router 实例，然后传 `routes` 配置
    // 你还可以传别的配置参数
const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
})
export default router
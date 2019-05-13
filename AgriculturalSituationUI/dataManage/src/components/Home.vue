<template>
  <div class="home">
    <header-bar></header-bar>
    <!-- header End -->
    <div class="body-contair">
      <!-- 侧边栏 Menu-->
      <div class="left-menu fl">
        <GeminiScrollbar style="height:100%;">
          <el-menu
            :default-active="menuActive"
            :collapse="isCollapse"
            class="el-menu-left-menu"
            background-color="#001529"
            text-color="#fff"
            active-text-color="#ffd04b"
            router 
            :default-openeds="['1','2']"
          >
            <template v-for="(item,index) in menuList">
              <el-submenu :index="item.index" v-if="item.child" background-color="#fff">
                <template slot="title">
                  <i :class="item.ico"></i>
                  <span>{{item.title}}</span>
                </template>
                <el-menu-item
                  :index="childItem.index"
                  v-for="(childItem,childIndex) in item.child"
                  :key="childIndex"
                >{{childItem.title}}</el-menu-item>
              </el-submenu>
              <el-menu-item :index="item.index" v-else>
                <i :class="item.ico"></i>
                <span slot="title">{{item.title}}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </GeminiScrollbar>
      </div>
      <div class="right-contair fr">
        <router-view :set-heights="clientHeight"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import HeaderBar from "./HeadNav";
import mixins from "./mixins/common";
import { debug } from "util";
export default {
  name: "home",
  components: {
    HeaderBar
  },
  mixins: [mixins],
  data() {
    return {
      // hostUrl:'http://36.7.159.225:16000/api/trace',
      isCollapse: false,
      slideState: true,
      menuActive: "CustomerManage", //当前激活的菜单栏
      menuList: [
        {
          title: "分类管理",
          ico: "el-icon-menu",
          index: "1",
          child: [
            {
              title: "供应管理",
              index: "CustomerManage"
            },
            {
              title: "求购管理",
              index: "PurchaseManage"
            },
            {
              title:"农机服务",
              index: "AgriculturalService"
            },
            {
              title:"统防统治",
              index: "RuleDefense"
            },
            // {
            //   title:"审核结果",
            //   index: "AuditResults"
            // },
          ]
        },
        {
          title: "网站管理",
          ico: "el-icon-menu",
          index: "2",
          child: [
            {
              title: "Banner管理",
              index: "BannerManage"
            },{
              title: "分类管理",
              index: "ColumnManage"
            }
          ]
        },
        {
          title: "系统管理",
          ico: "el-icon-menu",
          index: "3",
          child: [
            {
              title: "用户管理",
              index: "UserManage"
            }
            // ,{
            //   title: "权限管理",
            //   index: "RoleManage"
            // },{
            //   title: "区域管理",
            //   index: "AreaManage"
            // }
          ]
        }
      ]
    };
  },
  methods: {},
  mounted() {
    this.menuActive = this.$route.name;
  }
};
</script>

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
      menuActive: "IndexManage", //当前激活的菜单栏
      menuList: [
        {
          title: "内容管理",
          ico: "el-icon-menu",
          index: "1",
          child: [
            {
              title: "病虫害预警",
              index: "Issue"
            },{
              title: "病虫害防治",
              index: "Cure"
            },{
              title: "农业知识",
              index: "KnowledgeManage"
            },{
              title: "问答管理",
              index: "OnlineManage"
            },{
              title: "回答管理",
              index: "Ans"
            },
            {
              title: "专家管理",
              index: "ExportManage"
            },{
              title: "专家文章",
              index: "ArticleListManage"
            },{
              title: "视频管理",
              index: "ViedoManage"
            },
            // del by liulei
            // {
            //   title: "用户问题",
            //   index: "UserQue"
            // },{
            //   title: "我的问题",
            //   index: "MyQue"
            // },
            
            // del by liulei
            // {
            //   title: "文章发布",
            //   index: "ArticleManage"
            // }
          ]
        },
        {
          title: "用户管理",
          ico: "el-icon-menu",
          index: "2",
          child: [
            {
              title: "用户管理",
              index: "UserManage"
            },
          ]

        },
        {
          title: "网站管理",
          ico: "el-icon-menu",
          index: "3",
          child: [
            {
              title: "分类管理",
              index: "ConClunm"
            }
          ]

        },
      ]
    };
  },
  methods: {},
  mounted() {
    this.menuActive = this.$route.name;
  }
};
</script>

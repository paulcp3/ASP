<template>
  <div class="head">
    <div class="logo fl before">
      <img :src="logo" width="200"/> <span class="names"> 农产品信息管理系统</span>
    </div>
    <div class="right-user-infor fr before">
      <!-- <div class="item">
                <i class="iconfont icon-zhuye"></i>
                <span>主页</span>
      </div>-->
      <div class="item">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="iconfont icon-linedesign-16"></i>
            <span>{{userInfor?userInfor.account : ''}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="nav-list">
            <el-dropdown-item command="password">修改密码</el-dropdown-item>
            <el-dropdown-item command="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    
    </div>
    <el-dialog
      width="30%"
      title="修改密码"
      center
      append-to-body
      :visible.sync="innerVisible"
      custom-class="dialog-form"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="旧密码" required>
          <el-input v-model="form.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="form.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="form.newPasswordAgin" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = false">立即修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import Cookies from "js-cookie";
export default {
  name: "header-bar",
  data() {
    return {
       logo:require('../assets/images/xishu.png'),
      userInfor: null,
      form: {
        oldPassword: "",
        newPassword: "",
        newPasswordAgin: ""
      },
      innerVisible: false
    };
  },
  methods: {
    handleCommand(command) {
      let self = this;
      if (command === "password") {
        self.innerVisible = true;
      } else if (command === "exit") {
        self
          .$confirm("是否要退出登录?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            Cookies.remove("userInfor");
            Cookies.remove("Token");
            self.$router.replace("/");
          })
          .catch(() => {});
      }
    }
  },

  mounted() {
    let userInfor = Cookies.get("userInfor");
 
    this.userInfor = JSON.parse(userInfor).data;
  }
};
</script>
<style scoped>
.logo{
  height: 100%;
  margin-left: 10px;
}
.logo img{
  display:inline-block;
  vertical-align: middle;
}
.names{
  font-size: 25px;
  color: #fff;
  margin-left: 20px;
  display:inline-block;
  vertical-align: middle;
  font-weight: bold;
}
</style>

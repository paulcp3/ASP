<style lang="less">
  @import './login.less';
  @import '../../assets/style/login.css';
</style>

<template>
  <div class="login">
     <div class="login_header before">
      <!-- <img :src="logo" class="logo"> -->
      <span class="name_web">黄山现代农业示范区专家咨询知识库平台管理系统</span>
    </div>
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
import LoginForm from './login-form'
import Cookies from "js-cookie";
import mixins from "../mixins/common.js"
import fetch from "../../util/fetch"

export default {
  name:'login',
  mixins: [mixins],
  data() {
    return {
      logo:require('../../assets/images/xishu.png')
    };
  },
  components: {
    LoginForm
  },
  methods: {
    handleSubmit ({ userName, password }) {
       debugger 
       let self = this;
       let obj = {
         account: userName,
         password: password
       }

       fetch("/user/adlogin", obj , "POST").then((res) => {  
          debugger 
          Cookies.set('Token', res[0].data.token);
          Cookies.set('userInfor', res[0].data);
          Cookies.set('uuid', res[0].data.uUserInfoId);
          self.$router.replace("/Home");
        },(err) => {
          self.$notify({
            title: "警告",
            message: err.msg,
            type: "warning"
          });
          // 请求失败
        }
      );
    }
  },
  created() {
    // 重新绑定一次 数据
  },
  mounted() {
    let self = this;
    
  }
}
</script>

<style>

</style>

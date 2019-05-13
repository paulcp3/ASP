<template>
  <div class="company-msg box-padding user-manage">
    <title-bar name="用户管理"></title-bar>
    <el-row class="search-bar">
      <el-col :span="12">
        <el-input
          style="width:240px;"
          placeholder="请输入批次/编号搜索"
          prefix-icon="el-icon-search"
          v-model="keyWords"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" style="margin-left:10px;">搜索</el-button>
      </el-col>
      <el-col :span="6" :offset="6" class="text-right">
        <el-button type="primary" icon="el-icon-edit" @click="tabHandleClick">添加</el-button>
        <!-- <el-button type="danger" icon="el-icon-delete" @click="handleDelete">批量删除</el-button> -->
      </el-col>
    </el-row>
    <div class="table-contair">
      <el-table :data="tableData" stripe :height="setHeights-170" border style="width: 100%" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <!-- <el-table-column prop="id" label="ID"></el-table-column> -->
        <el-table-column prop="account" label="帐号"></el-table-column>
        <!-- <el-table-column prop="password" label="密码"></el-table-column> -->
        <el-table-column prop="realName" label="真实姓名"></el-table-column>
        <!-- <el-table-column prop="uUserInfoId" label="用户信息"></el-table-column> -->
        <el-table-column prop="telphone" label="电话"></el-table-column>
        <el-table-column prop="type" label="用户状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == 1">
              注册用户
            </el-tag>
            <el-tag v-else-if="scope.row.type == 2">
              非注册用户
            </el-tag>
            <el-tag v-else-if="scope.row.type == 3">
              前台用户
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button
                @click="handleClick(scope.row,1)"
                circle
                size="mini"
                icon="el-icon-edit"
                type="primary"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button
                circle
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleClick(scope.row,2)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-center" style="padding:10px 0;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :title="Dtitle" :visible.sync="dialogEditerVisible" center width="50%">
      <el-form :model="formEditer" label-width="100px">
        <!-- <input type="hidden" v-model="formEditer.id"> -->
        <!-- <el-form-item label="ID">
          <el-input v-model="formEditer.id" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="账号">
          <el-input v-model="formEditer.account" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码">
          <el-input v-model="formEditer.password" autocomplete="off"></el-input>
        </el-form-item> -->
         <el-form-item label="真实姓名">
          <el-input v-model="formEditer.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formEditer.telphone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="formEditer.type">
            <el-option
              :key="item.value"
              v-for="item in Options"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>  
        <!-- <el-form-item label="用户信息">
          <el-input v-model="formEditer.uUserInfoId" autocomplete="off"></el-input>
        </el-form-item>        -->
        <!-- <el-form-item label="创建时间">
          <el-date-picker
            v-model="formEditer.createTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-date-picker
            v-model="formEditer.createTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            >
          </el-date-picker> -->
        <!-- </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditerVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOrSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import TitleBar from "../TitleBar";
import mixins from "../mixins/common";
import fetch from "../../util/fetch";
import Cookies from "js-cookie";
import {formatDate} from "../../util/utils";

export default {
  name: "user-manage",
  mixins: [mixins],
  components: { TitleBar },
  props: {
    setHeights: {
      type: Number
    }
  },
  data() {
    return {
      dialogVisible: false,
      Options: [
        {
          value: "1",
          label: "注册用户"
        },
        {
          value: "2",
          label: "非注册用户"
        },
        {
          value: "3",
          label: "前台用户"
        }
      ],
      total:0,
      formEditer: {},
      Dtitle: "添加",
      currentPage: 0,
      pageSize: 5,
      dialogEditerVisible: false,
      keyWords: "",
      multipleSelection: [],
      deletAll: [],
      tableData: [
        {
          account: "",
          createTime: "",
          id: "",
          password: "",
          realName: "",
          telphone:"",
          type:"",
          uUserInfoId:"",
          updateTime:""
        }
      ]
    };
  },
  methods: {
    tabHandleClick() {
      this.Dtitle = "添加";
      this.formEditer = {};
      this.dialogEditerVisible = true;
    },
    changeQR(val) {
      if (val === "1") {
        this.formEditer.QRnumber = 1;
      }
    },
    handleSizeChange(val) {
      this.loadData();
    },
    handleCurrentChange(val) {
      this.loadData();
    },
    handleDelete() {
      let self = this;
      for(let i = 0; i　< self.multipleSelection.length; i++){
        self.deletAll.push(self.multipleSelection[i].id)      
      }

      self.messageBox("此操作将永久删除选中记录, 是否继续?",()=>{
        debugger
        fetch("/user/del/"+ JSON.stringify(self.deletAll), {}, "delete").then(
          res => {
            this.loadData();
            this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          },
          err => {
            self.$notify({
              title: "警告",
              message: err.msg,
              type: "warning"
            });
            // 请求失败
          }
        );
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(row, type) {
      let self = this;
      var obj = {};
      if (type === 1) {
        self.dialogEditerVisible = true;
        self.Dtitle = "编辑";
        for (let i in row) {
          obj[i] = row[i];
        }
         obj["type"]=row["type"]+"";
         obj["createTime"]=null;
          obj["updateTime"]=null;
         self.formEditer = obj;
      } else if (type === 2) {
        self.messageBox("此操作将永久删除该条记录, 是否继续?", () => {
          fetch("/user/del/" + row.id, row, "delete").then(
            res => {
              this.loadData();
              self.$message({
                type: "success",
                message: "删除成功!"
              });
            },
            err => {
              self.$notify({
                title: "警告",
                message: err.msg,
                type: "warning"
              });
            }
          )         
        });
      } else {
        self.dialogEditerVisible = true;
        this.dialogTitle = "添加批次";
      }
    },
    loadData(){
      let self = this;
      var uid =  Cookies.get('uuid')
      fetch("/user/getpage/"+uid+"/"+(self.currentPage - 1)+"/"+self.pageSize,{}, "GET").then(
        res => {
        self.tableData=res[0].data.list;
             for(let i=0; i<self.tableData.length; i++){
          self.tableData[i].createTime = formatDate(self.tableData[i].createTime)
           self.tableData[i].updateTime = formatDate(self.tableData[i].updateTime)
        }
        self.total=res[0].data.total;
        },
        err => {
          self.$notify({
            title: "警告",
            message: err.msg,
            type: "warning"
          });
          // 请求失败
        }
      );
    },
    updateOrSave(){
      debugger
      if(this.Dtitle=="添加"){
        debugger
        fetch("/user/add",this.formEditer, "POST").then(
        res => {
        this.loadData();
        this.dialogEditerVisible=false;
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success'
        });
        },
        err => {
          // this.dialogContentVisible=false;
          this.$notify({
            title: "警告",
            message: err.msg,
            type: "warning"
          });
        }
      );
      }else{
        debugger
        fetch("/user/update",this.formEditer, "PUT").then(
        res => {
        this.loadData();
        this.dialogEditerVisible=false;
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success'
        });
        },
        err => {
          // this.dialogContentVisible=false;
          this.$notify({
            title: "警告",
            message: err.msg,
            type: "warning"
          });
        }
      ); 
      }
    },
  },
  mounted() {
    let self = this;
    self.loadData();
    window.onresize = function() {
      self.tableHeight = document.body.offsetHeight - 150;
    };
  }
};
</script>

<template>
  <div class="company-msg box-padding customer-manage">
    <title-bar name="专家文章"></title-bar>
    <el-row class="search-bar">
      <el-col :span="12">
        <el-input
          style="width:200px;"
          placeholder="请输入编号/名称搜索"
          prefix-icon="el-icon-search"
          v-model="keyWords"
        ></el-input>
        <el-button type="primary" @click="loadData()" icon="el-icon-search" style="margin-left:10px;">搜索</el-button>
      </el-col>
      <!-- <el-col :span="8" :offset="4" class="text-right">
        <el-button type="primary" icon="el-icon-edit" @click="showAdd()">批量添加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteD()">批量删除</el-button>            
      </el-col> -->
    </el-row>
    <div class="table-contair">
      <el-table :data="tableData" stripe :height="setHeights-170" border style="width: 100%">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
         <el-table-column prop="id" label="ID"  width="55"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="visit" label="浏览人数"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
            <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button
                circle
                size="mini"
                type="success"
                icon="el-icon-edit"
                @click="handleClick(scope.row,1)"
              ></el-button>
            </el-tooltip> -->
       
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button
                circle
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleClick(scope.row,3)"
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
        <el-form-item label="ID">
          <el-input v-model="formEditer.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="formEditer.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="formEditer.content" autocomplete="off"></el-input>
        </el-form-item>    
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditerVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOrSave">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="Dtitle" :visible.sync="dialogContentVisible" center width="50%">
      <el-form :model="formEditer" label-width="100px">  
        <el-form-item label="ID">
          <el-input v-model="formEditer.expertLibraryId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="formEditer.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="formEditer.content" autocomplete="off"></el-input>
        </el-form-item>
       <!-- <div class="item">
        <label for=""  class="item-lable">内容：</label>
        <UEditor :config = config  class="item-input item-input-txt" v-model="formEditer.content"></UEditor>
        </div>   -->
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
import UEditor from '../Ueditor';
import TitleBar from "../TitleBar";
import mixins from "../mixins/common";
import fetch from "../../util/fetch";
import {formatDate,delHtmlTag} from "../../util/utils";

export default {
  name: "supplier-manage",
  components: { TitleBar,UEditor },
  mixins:[mixins],
  props: {
    setHeights: {
      type: Number
    }
  },
  data() {
    return {
      editor: null,
      config:{
        initialFrameWidth: '100%',
        initialFrameHeight: 200
      },
      value:'',
      pageSize:5,
      currentPage: 1,
      total:0,
      formEditer: {},
      dialogContent: '默认展示的内容',
      dialogEditerVisible: false,
      dialogContentVisible: false,
      keyWords: "",
      Dtitle:"",
      multipleSelection:[],
      deletAll: [],
      tableData: [
        {
          id:'',
          title:'',
          expertLibraryId:'',
          createTime:'',
          visit:'',
          content:''
        }
      ]
    };
  },
  methods: {
     handleSizeChange(val) {
      this.loadData();
    },
    handleCurrentChange(val) {
      this.loadData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(row, type) {
      let self = this;
      if (type === 1){
        self.Dtitle = "编辑";
        self.dialogEditerVisible = true;
        let obj = {};
        for (let key in row) {
          obj[key] = row[key];
        }
        self.formEditer = obj;
      }else if (type === 2) {
        self.Dtitle="添加";
        self.dialogContentVisible = true;
      }else if (type === 3) {
        self.Dtitle="删除";
        self.messageBox("此操作将永久删除该条记录, 是否继续?",()=>{
          fetch("/article/del/"+ row.id,row, "delete").then(
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
      } else if (type === 4) {
        self.Dtitle="审核";
        self.dialogContentVisible = true;
      } 
    },
    approved(){
      alert("tonguo")
    },
    unApproved(){
      alert("weitongguo")
    },
    loadData(){
      let self = this;
      fetch("/article/getpage2/"+( self.currentPage  )+"/"+self.pageSize+"?key="+self.keyWords,{}, "GET").then(
        res => {
        self.tableData=res[0].data.list;
      for(let i=0; i<self.tableData.length; i++){
          self.tableData[i].createTime = formatDate(self.tableData[i].createTime)
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
      if(this.Dtitle=="编辑"){
        fetch("/expertlibrary/update",this.formEditer, "PUT").then(
        res => {
        this.loadData();
        this.dialogEditerVisible=false;
        this.$notify({
          title: '成功',
          message: '编辑成功',
          type: 'success'
        });
        },
        err => {
          this.dialogEditerVisible=false;
          this.$notify({
            title: "警告",
            message: err.msg,
            type: "warning"
          });
          // 请求失败
        }
      );
      }else if(this.Dtitle=="添加"){
          debugger
        fetch("/article/add",this.formEditer, "POST").then(
        res => {
        this.loadData();
        this.dialogContentVisible=false;
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success'
        });
        },
        err => {
          this.dialogContentVisible=false;
          this.$notify({
            title: "警告",
            message: err.msg,
            type: "warning"
          });
          // 请求失败
        }
      );      
      }
    }
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



<template>
  <div class="company-msg box-padding customer-manage">
    <title-bar name="农机服务"></title-bar>
    <el-row class="search-bar">
      <el-col :span="12">
        <el-input
          style="width:200px;"
          placeholder="请输入标题搜索"
          prefix-icon="el-icon-search"
          v-model="keyWords"
        ></el-input>
        <el-select style="margin-left:10px;" clearable   v-model="status" placeholder="请选择分类">
         <el-option
            label="审核通过"
            value="1">
          </el-option>
          <el-option
            label="审核失败"
            value="2">
          </el-option>
           <el-option
            label=" 未审核"
            value="0">
          </el-option>
        </el-select>
        <el-button type="primary" @click="loadData()" icon="el-icon-search" style="margin-left:10px;">搜索</el-button>
      </el-col>
   
    </el-row>
    <div class="table-contair">
      <el-table :data="tableData" stripe :height="setHeights-170" border style="width: 100%" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <!-- <el-table-column prop="author.account" label="上传人"></el-table-column> -->
        <el-table-column prop="hits" label="点击量"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="createTime" label="上传时间"></el-table-column>
        <el-table-column prop="status" label="审核状态" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0">
              未审核
            </el-tag>
            <el-tag v-else-if="scope.row.status == 1">
              通过
            </el-tag>
            <el-tag v-else-if="scope.row.status == 2">
              失败
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
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
            <!-- <el-tooltip class="item" effect="dark" content="添加" placement="top-start">
              <el-button
                circle
                size="mini"
                type="info"
                icon="el-icon-plus"
                @click="handleClick(scope.row,2)"
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
            <el-tooltip class="item" effect="dark" content="审核" placement="top-start">
              <el-button
                @click="handleClick(scope.row,4)"
                circle
                size="mini"
                icon="el-icon-zoom-in"
                type="warning"
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
        <input type="hidden" v-model="formEditer.id">
        <el-form-item label="标题">
          <el-input v-model="formEditer.title" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="编辑内容">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="formEditer.content" autocomplete="off">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditerVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOrSave">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="Dtitle" :visible.sync="dialogContentVisible" center width="50%">
      <el-form :model="viewData" label-width="100px">
      <!-- <img :src="tableData.imageUrl" /> -->
 <el-form-item label="内容">
   
          <div class="edit_container">
            <quill-editor v-model="viewData.content"
                    ref="myQuillEditor"
                    class="editer"
                    :options="editorOption">
            </quill-editor> 
          </div>  
        </el-form-item>

      <el-form-item label="说明">
        <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="viewData.result" autocomplete="off">
          </el-input>
      </el-form-item> 
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="unApproved">未通过审核</el-button>
        <el-button type="primary" @click="approved">通过审核</el-button>
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
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor'

export default {
  name: "supplier-manage",
    components: { TitleBar ,quillEditor},
  mixins:[mixins],
  props: {
    setHeights: {
      type: Number
    },
  },
  data() {
    return {
      viewValue:[],
      pageSize:5,
      currentPage: 0,
      total:0,
      formEditer: {
        author:{
            account:'',
          }, 
          title:'',
          createTime:'',
          state:0,
          content:''
      },
      Options:[
        {
          value: "0",
          label: "新建"
        },
        {
          value: "1",
          label: "通过"
        },
        {
          value: "2",
          label: "失败"
        }
      ],
      viewData:{
        sourceId:"",
        sourceType: 0,
        status:"",
        result:""
      },
      dialogContent: '默认展示的内容',
      dialogEditerVisible: false,
      dialogContentVisible: false,
      keyWords: "",
      status:"",
      multipleSelection: [],
      deletAll: [],
      Dtitle:"",
      tableData: [
        {
          author:{
            account:'',
          }, 
          title:'',
          createTime:'',
          state:0,
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
    handleClick(row, type) {
      let self = this;
      if (type === 1){
        self.Dtitle = "编辑";
        self.dialogEditerVisible = true;
        let obj = {};
        for (let key in row) {
          obj[key] = row[key];
        }
        debugger
        self.formEditer = obj;
      }else if (type === 2) {
        self.Dtitle="添加";
        self.dialogEditerVisible = true;
        self.formEditer = {
          author:{
            account:'',
          }, 
          title:'',
          createTime:'',
          state:0,
          content:''
        };
      }else if (type === 3) {
        self.Dtitle="删除";
        self.messageBox("此操作将永久删除该条记录, 是否继续?",()=>{
          fetch("/agriculturalms/del/"+ row.id,row, "delete").then(
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
        self.viewData["sourceId"] = row.id;
        self.viewData["content"] = row.content;
        self.viewData["uuid"] = Cookies.get('uuid');
        self.viewData["sourceType"] = 0;
      } 
    },
    loadData(){
      let self = this;
       var uid =  Cookies.get('uuid')
      fetch("/agriculturalms/getpage2/"+uid+"/"+(self.currentPage )+"/"+self.pageSize,{title:self.keyWords,status:self.status}, "post").then(
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    showAdd(){
      this.Dtitle="添加";
      this.dialogEditerVisible=true;
    },
    deleteD(){
      let self = this;
      for(let i = 0; i　< self.multipleSelection.length; i++){
        self.deletAll.push(self.multipleSelection[i].id)      
      }
      let param = JSON.stringify(self.deletAll);
      self.messageBox("此操作将永久删除选中记录, 是否继续?",()=>{
        debugger
        fetch("/agriculturalms/del/"+param, {}, "delete").then(
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
    updateOrSave(){
      if(this.Dtitle=="编辑"){
        
        fetch("/agriculturalms/update",this.formEditer, "PUT").then(
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
      }else if(this.Dtitle == "添加"){
        debugger
        this.formEditer["uuid"] = Cookies.get('uuid');
        fetch("/agriculturalms/add",this.formEditer, "POST").then(
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
          this.dialogEditerVisible=false;
          this.$notify({
            title: "警告",
            message: err.msg,
            type: "warning"
          });
          // 请求失败
        }
      );  
      }
    },
    approved(){
      debugger
      this.viewData["status"] = 1;
      fetch("/auditing/add",this.viewData, "POST").then(
        res => {
        this.loadData();
        this.dialogContentVisible=false;
        this.$notify({
          title: '通过',
          message: '操作成功',
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
    },
    unApproved(){
      debugger
      this.viewData["status"] = 2;
      fetch("/auditing/add",this.viewData, "POST").then(
        res => {
        this.loadData();
        this.dialogContentVisible=false;
        this.$notify({
          title: '不通过',
          message: '操作成功',
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
    },
  },
   computed:{
    
    editor() {
      return this.$refs.myQuillEditor.quill
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



<template>
  <div class="company-msg box-padding customer-manage">
    <title-bar name="问题管理"></title-bar>
    <el-row class="search-bar">
      <el-col :span="12">
        <el-input
          style="width:200px;"
          placeholder="请输入标题搜索"
          prefix-icon="el-icon-search"
          v-model="keyWords"
        ></el-input>
        <el-button type="primary" @click="loadData()" icon="el-icon-search" style="margin-left:10px;">搜索</el-button>
      </el-col>
      <el-col :span="8" :offset="4" class="text-right">
        <!-- <el-button type="primary" icon="el-icon-plus" @click="showAdd()">添加</el-button> -->
      <!--  <el-button type="danger" icon="el-icon-delete" @click="deleteD()">批量删除</el-button>  -->          
      </el-col> 
    </el-row>
    <div class="table-contair">
      <el-table :data="tableData" stripe :height="setHeights-170" border style="width: 100%">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="id" label="ID"  width="55"></el-table-column>
        <el-table-column prop="user" label="作者"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="hot" label="浏览人数"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
            <template slot-scope="scope">
            <el-tooltip v-if="scope.row.recommend==0" class="item" effect="dark" content="推荐" placement="top-start">
              <el-button
                circle
                size="mini"
                type="success"
                icon="el-icon-star-off"
                @click="handleClick(scope.row,1)"
              ></el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.recommend==1" class="item" effect="dark" content="取消推荐" placement="top-start">
              <el-button
                circle
                size="mini"
                type="danger"
                icon="el-icon-star-off"
                @click="handleClick(scope.row,1)"
              ></el-button>
            </el-tooltip>

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
       
        <el-form-item label="标题">
          <el-input v-model="formEditer.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <div class="edit_container">
            <quill-editor v-model="formEditer.content"
                    ref="myQuillEditor"
                    class="editer"
                    :options="editorOption">
            </quill-editor> 
          </div>
        </el-form-item>   
        <!-- <el-form-item label="创建时间">
          <el-time-select v-model="formEditer.createTime"></el-time-select>
        </el-form-item>     -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditerVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOrSave">确 定</el-button>
      </div>
    </el-dialog>
     <!--<el-dialog :title="Dtitle" :visible.sync="dialogContentVisible" center width="50%">
      <el-form :model="formEditer" label-width="100px">
      <img :src="tableData.imageUrl" />
      <el-form-item label="说明">
        <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="formEditer.description" autocomplete="off">
          </el-input>
      </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="unApproved">未通过审核</el-button>
        <el-button type="primary" @click="approved">通过审核</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import Vue from "vue";
import TitleBar from "../TitleBar";
import mixins from "../mixins/common";
import fetch from "../../util/fetch";
import {formatDate,delHtmlTag} from "../../util/utils";

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor'

export default {
  name: "supplier-manage",
  components: { TitleBar,quillEditor },
  mixins:[mixins],
  props: {
    setHeights: {
      type: Number
    }
  },
  data() {
    return {
      value:'',
      pageSize:5,
      currentPage: 0,
      total:0,
      formEditer: {},
      dialogContent: '默认展示的内容',
      dialogEditerVisible: false,
      dialogContentVisible: false,
      keyWords: "",
      Dtitle:"",
      multipleSelection:[],
      deletAll: [],
      editorOption:{
         modules:{
            toolbar:[
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote', 'code-block'],
              [{ 'list': 'ordered' },{ 'list' : 'bullet' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [ {'color': [] } , {'background': [] } ],
              [{ 'font': [] }],['clean'],
              [{ 'align': [] }],
            ],
        }
      },
      tableData: [
        {
          id:'',
          title:'',
          hot:'',
          recommend:'',
          createTime:'',
          createUserId:'',
          createUserType:'',
          user:'',
          content:''
        }
      ]
    };
  },
  computed:{
    editor() {
      return this.$refs.myQuillEditor.quill
    }
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
      debugger
      let self = this;
      if (type === 1){
        var msg = "是否推荐此问题";
        var tag = 1

        if(row.recommend==1){
       var msg = "是否取消推荐此问题";
        var tag = 0
        }
     self.messageBox(msg,()=>{
          fetch("/question/recommand/"+ row.id+"/"+tag,row, "put").then(
            res => {
              this.loadData();
              this.$notify({
              title: '成功',
              message: '操作成功',
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
      }else if (type === 2) {
        self.Dtitle="添加";
        self.dialogEditerVisible = true;
      }else if (type === 3) {
        self.Dtitle="删除";
        self.messageBox("此操作将永久删除该条记录, 是否继续?",()=>{
          fetch("/question/del/"+ row.id,row, "delete").then(
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
      fetch("/question/getpage2/"+( self.currentPage)+"/"+self.pageSize+"?key="+self.keyWords,{}, "GET").then(
        res => {
        self.tableData=res[0].data.list;
        
        for(let i=0; i<self.tableData.length; i++){
          self.tableData[i].createTime = formatDate(self.tableData[i].createTime)
        }
        debugger
        for(let i=0; i<self.tableData.length; i++){
          self.tableData[i].user = self.tableData[i].user.realName
        }
        self.tableData
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
    showAdd(){
      this.formEditer={};
      this.Dtitle="添加";
      this.dialogEditerVisible=true;

    },
    // deleteD(){
    //   let self = this;
    //   for(let i = 0; i　< self.multipleSelection.length; i++){
    //     self.deletAll.push(self.multipleSelection[i].id)      
    //   }
    //   self.messageBox("此操作将永久删除选中记录, 是否继续?",()=>{
    //     debugger
    //     fetch("/agriculturalms/del/"+ JSON.stringify(self.deletAll), {}, "delete").then(
    //       res => {
    //         this.loadData();
    //         this.$notify({
    //         title: '成功',
    //         message: '删除成功',
    //         type: 'success'
    //       });
    //       },
    //       err => {
    //         self.$notify({
    //           title: "警告",
    //           message: err.msg,
    //           type: "warning"
    //         });
    //         // 请求失败
    //       }
    //     );
    //   })
    // },
    updateOrSave(){
      if(this.Dtitle=="编辑"){
        this.formEditer.content = delHtmlTag(this.formEditer.content);
        fetch("/question/update",this.formEditer, "PUT").then(
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
        this.formEditer.content = delHtmlTag(this.formEditer.content);
        fetch("/question/add",this.formEditer, "POST").then(
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



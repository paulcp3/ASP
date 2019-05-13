<template>
  <div class="company-msg box-padding customer-manage">
    <title-bar name="农业知识"></title-bar>
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
      <el-col :span="8" :offset="4" class="text-right">
        <el-button type="primary" icon="el-icon-plus" @click="showAdd()">添加</el-button>
         <!--  <el-button type="danger" icon="el-icon-delete" @click="deleteD()">批量删除</el-button>    -->         
      </el-col>
    </el-row>
    <div class="table-contair">
      <el-table :data="tableData" stripe :height="setHeights-170" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="55"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="visit" label="访问量" width="60"></el-table-column>
        <!-- <el-table-column prop="headPortrait" label="图片">
          <template slot-scope="scope">            
            <img :src="scope.row.headPortrait"  min-width="70" height="70" />
          </template>
        </el-table-column> -->
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        
        <el-table-column fixed="right" label="操作" width="80">
            <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button
                circle
                size="mini"
                type="success"
                icon="el-icon-edit"
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
         <el-form-item label="专家类型">
       <el-tree  ref="tree"
        :data="tableData2"
        :check-strictly="true"
        show-checkbox
        node-key="id"
        :default-checked-keys="[formEditer.industryTypeId || '']"
        default-expand-all
        @check="changeTree"
        :expand-on-click-node="false">
       
      </el-tree>
      </el-form-item>


               <el-form-item label="是否推荐">
          <el-select v-model="formEditer.recommend" placeholder="请选择">
    <el-option
      label="推荐"
      value="1">
    </el-option>
      <el-option
      label="普通"
      value="0">
    </el-option>
  </el-select>
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
       
        <el-form-item label="图片">
        <el-upload
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            action
            :file-list="fileList"
            multiple
          >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        </el-form-item>    
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
import Cookies from "js-cookie";
import TitleBar from "../TitleBar";
import mixins from "../mixins/common";
import fetch from "../../util/fetch";
import {formatDate,delHtmlTag} from "../../util/utils";
import config from "../../config";

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
      tableData2: [],
      value:'',
      pageSize: 10,
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
      industryTypeId: '0',
      uuid:'',
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
          visit:'',
          industryTypeId:'',
          createTime:'',
          uUserInfoId:'',
          content:'',
          recommend:''
        }
      ],
       fileList: []
    };
  },
  computed:{
    
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    changeTree(data, checked, indeterminate) {
      let self = this;
      let check = checked.checkedKeys;
      
      self.formEditer.pid = data.id;
      self.$refs.tree.setCheckedKeys([]);
      if(check.length>0){
         self.$refs.tree.setCheckedKeys([data.id]);
      }
    },
     loadFile(id) {
      fetch("/knowledgeimage/getfile/" + id, {}, "GET").then(res => {
        this.fileList = [];
        var list = [];
        var filePaths = res[0].data;
        if (filePaths.length > 0) {
          var obj = {};
          for (var i in filePaths) {
            var obj = {};
            obj.url =  config.hostUrl + filePaths[i];
            this.fileList.push(obj);
          }
        }
      });
    },
      handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
       beforeUpload(file) {
      let self = this;
      let formData = new FormData();
      formData.append("file", file, file.name);
      fetch("/file/upload", formData, "POST", true).then(
        res => {
          var fileObj = {};
          fileObj.name = res[0].data.name;
          fileObj.url = config.hostUrl + res[0].data.url;
          self.fileList.push(fileObj);
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
      // self.$refs.tree.setCheckedKeys([], true);
      self.fileList=[];
      if (type === 1){
          self.loadFile(row.id);
        self.Dtitle = "编辑";
        self.dialogEditerVisible = true;
        self.formEditer = {};
        let obj = {};
        for (let key in row) {
          obj[key] = row[key];
        }
         obj["recommend"]=row["recommend"]+"";
         self.formEditer = obj;
          var resourceList = row["industryTypeId"];
      
        self.$nextTick(() => {
               self.$refs.tree.setCheckedKeys([], true);
          for (var i = 0; i < resourceList.length; i++) {
            self.$refs.tree.setChecked(resourceList[i], true, false);
          }
        });
        // self.formEditer.recommend = obj.recommend;
      }else if (type === 2) {
        self.Dtitle="添加";
          self.dialogEditerVisible = true;
         
      
      }else if (type === 3) {
        self.Dtitle="删除";
        self.messageBox("此操作将永久删除该条记录, 是否继续?",()=>{
          fetch("/banner/del/"+ row.id,row, "delete").then(
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
      // debugger
      let self = this;
      self.uuid = Cookies.get('uuid');//+ self.uuid + '/'
      fetch("/knowledge/getpage/" + self.industryTypeId + '/' +( self.currentPage )+"/"+self.pageSize,{}, "GET").then(
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
       loadType(){
      let self = this;
      fetch("/industrytype/gettree",{}, "GET").then(
        res => {
        self.tableData2=res[0].data.list;
        debugger
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
          this.dialogEditerVisible=true;
      this.fileList=[];
      this.formEditer={};
      this.Dtitle="添加";
        this.$nextTick(() => {
               this.$refs.tree.setCheckedKeys([], true);
         
        });
  
    },
    updateOrSave(){
       let self = this;
      var list = this.fileList;
      var patharr = [];
      for (var i = 0; i < list.length; i++) {
        patharr.push(list[i].url);
      }
      this.formEditer.imgUrl = patharr.join(",");
      self.formEditer.createTime=null;
       var treeNode = this.$refs.tree.getCheckedKeys()[0];
// debugger
      this.formEditer.industryTypeId = treeNode;
      if(this.Dtitle=="编辑"){
        this.formEditer.content = delHtmlTag(this.formEditer.content);
        fetch("/knowledge/update",this.formEditer, "put").then(
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
        fetch("/knowledge/add",this.formEditer, "post").then(
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    }
  },
  mounted() {
    let self = this;
    self.loadType();
    self.loadData();
    window.onresize = function() {
      self.tableHeight = document.body.offsetHeight - 150;
    };
  }
};
</script>

<style scope>
  .ql-toolbar.ql-snow + .ql-container.ql-snow{  
    min-height: 200px;
  }
</style>



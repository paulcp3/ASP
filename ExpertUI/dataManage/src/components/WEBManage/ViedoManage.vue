<template>
  <div class="company-msg box-padding customer-manage">
    <title-bar name="视频管理"></title-bar>
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
        <el-button type="primary" icon="el-icon-edit" @click="showAdd()">添加</el-button>
        <!-- <el-button type="danger" icon="el-icon-delete" @click="deleteD()">删除</el-button>             -->
      </el-col>
    </el-row>
    <div class="table-contair">
      <el-table :data="tableData" stripe :height="setHeights-170" border style="width: 100%">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <!-- <el-table-column prop="id" label="ID" width="55"></el-table-column> -->
        <!-- <el-table-column prop="url" label="视频地址"></el-table-column> -->
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="createTime" label="发布时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
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
        <el-form-item label="类型">
          <el-tree  ref="tree"
        :data="tableData2"
        :check-strictly="true"
        show-checkbox
        node-key="id"
        :default-checked-keys="[formEditer.industryTypeId || '']"
        default-expand-all
        @check="changeTree"
        :expand-on-click-node="false"></el-tree>
        </el-form-item>   
        <el-form-item label="视频">
       <el-upload ref="videoUpload"
                class="upload-demo"
                action
            
                :before-upload="beforeUpload4"
                :limit="1"
       
                
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
              <div class="pictrue">
                <!-- <el-popover placement="top-start" trigger="hover"> -->
                <video width="320" height="240" 
                  :src="formEditer.url"
                  controls="controls"
                >your browser does not support the video tag</video>
                <!-- <el-button size="small" type="text" slot="reference" >立即查看</el-button> -->
                <!-- </el-popover> -->
              </div>
        </el-form-item>     
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditerVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOrSave">确 定</el-button>
      </div>
    </el-dialog>
   <!-- <el-dialog :title="Dtitle" :visible.sync="dialogContentVisible" center width="50%">
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
import Cookies from "js-cookie";
import TitleBar from "../TitleBar";
import mixins from "../mixins/common";
import fetch from "../../util/fetch";
import config from "../../config";
import {formatDate,delHtmlTag} from "../../util/utils";
export default {
  name: "supplier-manage",
  components: { TitleBar },
  mixins:[mixins],
  props: {
    setHeights: {
      type: Number
    }
  },
  data() {
    return {
      tableData2:[],
      value:'',
      pageSize:10,
      currentPage:1,
      total:0,
      fileList:[],
      formEditer: {},
      dialogContent: '默认展示的内容',
      dialogEditerVisible: false,
      dialogContentVisible: false,
      keyWords: "",
      Dtitle:"",
      multipleSelection:[],
      deletAll: [],
      industryType: '0',
      tableData: [
        {
          id:'',
          industryType:'',
          title:'',
          url:'',
          uUserInfoId:'',
          createTime:''
        }
      ]
    };
  },

  methods: {
     changeTree(data, checked, indeterminate) {
      let self = this;
      let check = checked.checkedKeys;
      
      self.formEditer.industryTypeId = data.id;
      self.$refs.tree.setCheckedKeys([]);
      if(check.length>0){
         self.$refs.tree.setCheckedKeys([data.id]);
      }
    },
       handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  beforeUpload4(file) {
      let self = this;
       self.loading = true;
      let formData = new FormData();
      formData.append("file", file, file.name);
      fetch("/file/upload", formData, "POST", true).then(
        res => {
         self.loading = false;
          // var fileObj = {};
          // fileObj.name = res[0].data.name;
          self.formEditer.url = config.hostUrl + res[0].data.url;

          // self.fileList.push(fileObj);
          //  return false;
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
        
      if (type === 1){
        self.dialogEditerVisible = true;
          self.$nextTick(() => {
               self.$refs.tree.setCheckedKeys([], true);
         
        });
        self.Dtitle = "编辑";
      
        let obj = {};
        for (let key in row) {
          obj[key] = row[key];
        }
         obj.url = config.hostUrl + row["url"];
         debugger
           var resourceList = row["industryTypeId"];
         self.$refs.tree.setCheckedKeys([], true);
        self.$nextTick(() => {
            self.$refs.tree.setChecked(resourceList, true, false);
           })
        self.formEditer = obj;
       
      }else if (type === 2) {
        self.Dtitle="添加";
        self.dialogEditerVisible = true;
      }else if (type === 3) {
      
        self.messageBox("此操作将永久删除该条记录, 是否继续?",()=>{
          fetch("/video/del/"+ row.id,row, "delete").then(
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
      self.uuid = Cookies.get('uuid');
      fetch("/video/getpage2/" + self.uuid + '/' + self.industryType + '/' +( self.currentPage )+"/"+self.pageSize+"?key="+self.keyWords,{}, "GET").then(
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
    showAdd(){
      this.formEditer={};
      this.Dtitle="添加";
      this.dialogEditerVisible=true;
         this.$nextTick(() => {
               this.$refs.tree.setCheckedKeys([], true);
         
        });
    },
    updateOrSave(){
      if(this.Dtitle=="编辑"){
        this.formEditer.createTime=null;
        fetch("/video/update",this.formEditer, "PUT").then(
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
        fetch("/video/add",this.formEditer, "POST").then(
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
        loadData2(){
      let self = this;
      fetch("/industrytype/gettree",{}, "GET").then(
        res => {
        self.tableData2=res[0].data.list;
        // self.total=res[0].data.total;
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
  },
  mounted() {
    let self = this;
    self.loadData2();
    self.loadData();
    window.onresize = function() {
      self.tableHeight = document.body.offsetHeight - 150;
    };
  }
};
</script>



<template>
  <div class="company-msg box-padding customer-manage">
    <title-bar name="专家管理"></title-bar>
    <el-row class="search-bar">
      <el-col :span="12">
        <el-input
          style="width:200px;"
          placeholder="请输入名称搜索"
          prefix-icon="el-icon-search"
          v-model="keyWords"
        ></el-input>
        <el-button type="primary" @click="loadData()" icon="el-icon-search" style="margin-left:10px;">搜索</el-button>
      </el-col>
      <el-col :span="8" :offset="4" class="text-right">
        <el-button type="primary" icon="el-icon-edit" @click="showAdd()">添加</el-button>
        <!-- <el-button type="danger" icon="el-icon-delete" @click="deleteD()">批量删除</el-button>             -->
      </el-col>
    </el-row>
    <div class="table-contair">
      <el-table :data="tableData" stripe :height="setHeights-170" border style="width: 100%">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
         <!-- <el-table-column prop="userId" label="ID"  width="55"></el-table-column> -->
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column prop="account" label="账户"></el-table-column>
        <el-table-column prop="telphone" label="联系方式"></el-table-column>
        
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
        <el-form-item label="专家账户">
          <el-input v-model="formEditer.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专家姓名">
          <el-input v-model="formEditer.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="formEditer.telphone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专家介绍">
          <el-input v-model="formEditer.introduce" type="textarea" autocomplete="off"></el-input>
        </el-form-item>
       <el-form-item label="专家类型">
       <el-tree  ref="tree"
        :data="tableData2"
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
        <el-form-item label="专家图片">
          <!-- <el-input v-model="formEditer.headPortrait" autocomplete="off"></el-input>
           -->
             <el-upload
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            action
            :file-list="fileList"
            multiple
          >
            <i class="el-icon-plus"></i>
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
import TitleBar from "../TitleBar";
import mixins from "../mixins/common";
import fetch from "../../util/fetch";
import config from "../../config";

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
            tableData2: [
        {
          id: 1,
          pid: 0,
          label: '一级 1',
          children: [{
            id: 4,
            pid: 0,
            label: '二级 1-1',
            children: [{
              id: 9,
              pid: 0,
              label: '三级 1-1-1'
            }, {
              id: 10,
              pid: 0,
              label: '三级 1-1-2'
            }]
          }]
        }
      ],
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
      fileList:[],
      tableData: [
        {
          id:'',
          userId:'',
          name:'',
          headPortrait:'',
          introduce:''
        }
      ]
    };
  },
  methods: {
        changeTree(data, checked, indeterminate) {
      // let self = this;
      // let check = checked.checkedKeys;
      
      // self.formEditer.industryTypeId = data.id;
      // self.$refs.tree.setCheckedKeys([]);
      // if(check.length>0){
      //    self.$refs.tree.setCheckedKeys([data.id]);
      // }
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
      self.fileList=[];
      if (type === 1){
        self.Dtitle = "编辑";
        self.dialogEditerVisible = true;
        let obj = {};
        for (let key in row) {
          obj[key] = row[key];

        }
        obj["recommend"]=row["recommend"]+"";
        self.formEditer = obj;
        if(obj["headPortrait"]!=""&&obj["headPortrait"]!=null){
         var path = obj["headPortrait"].split("/");
        self.fileList.push({name:path[path.length-1], url: config.hostUrl+obj["headPortrait"] });
        }
        var resourceList = row["industryTypeIdList"];
        self.$nextTick(() => {
          
           self.$refs.tree.setCheckedKeys([], true);
          for (var i = 0; i < resourceList.length; i++) {
            self.$refs.tree.setChecked(resourceList[i], true, false);
          }
        });
      }else if (type === 2) {
        self.Dtitle="添加";
        self.dialogEditerVisible = true;
      }else if (type === 3) {
        self.Dtitle="删除";
        self.messageBox("此操作将永久删除该条记录, 是否继续?",()=>{
          fetch("/expertlibrary/del/"+ row.id,row, "delete").then(
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
      fetch("/expertlibrary/getpage/"+( self.currentPage  )+"/"+self.pageSize+"?key="+self.keyWords,{}, "GET").then(
        res => {
        self.tableData=res[0].data.list;
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
      this.formEditer={};
      this.Dtitle="添加";
      this.dialogEditerVisible=true;
      this.fileList=[];
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
    updateOrSave(){
        var treeNode = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys());
          this.formEditer.industryTypeIdList = treeNode;
      if (this.fileList.length > 0) {
        var patharr = [];
        for (var i = 0; i < this.fileList.length; i++) {
          patharr.push(this.fileList[i].url);
        }
        this.formEditer["headPortrait"] = patharr.join(",");
      } else {
        this.formEditer["headPortrait"] = "";
      }
      if(this.Dtitle=="编辑"){
        fetch("/expertlibrary/update2",this.formEditer, "PUT").then(
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
        fetch("/expertlibrary/add",this.formEditer, "POST").then(
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
    self.loadType();
    self.loadData();
    window.onresize = function() {
      self.tableHeight = document.body.offsetHeight - 150;
    };
  }
};
</script>



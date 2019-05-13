<template>
  <div class="company-msg box-padding customer-manage">
    <title-bar name="审核结果"></title-bar>
    <el-row class="search-bar">
      <el-col :span="12">
        <el-input
          style="width:200px;"
          placeholder="请输入编号/名称搜索"
          prefix-icon="el-icon-search"
          v-model="keyWords"
        ></el-input>
        <el-select style="margin-left:10px;" v-model="viewValue" placeholder="请选择分类">
          <el-option
            label="已审核"
            value="已审核">
          </el-option>
          <el-option
            label="未审核"
            value="未审核">
          </el-option>
        </el-select>
        <el-button type="primary" @click="loadData()" icon="el-icon-search" style="margin-left:10px;">搜索</el-button>
      </el-col>
      <!-- <el-col :span="8" :offset="4" class="text-right">
        <el-button type="primary" icon="el-icon-edit" @click="showAdd()">批量审核</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteD()">批量删除</el-button>            
      </el-col> -->
    </el-row>
    <div class="table-contair">
      <el-table :data="tableData" stripe :height="setHeights-170" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="sourceId" label="标题"></el-table-column>
        <el-table-column prop="userId" label="上传人"></el-table-column>
        <el-table-column prop="sourceType" label="类型"></el-table-column>
        <el-table-column prop="result" label="内容结果"></el-table-column>
        <el-table-column prop="createTime" label="上传时间"></el-table-column>
        <el-table-column prop="status" label="审核状态" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0">
              新建
            </el-tag>
            <el-tag v-else-if="scope.row.status == 1">
              通过
            </el-tag>
            <el-tag v-else-if="scope.row.status == 2">
              失败
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column fixed="right" label="操作" width="160">
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
            <el-tooltip class="item" effect="dark" content="添加" placement="top-start">
              <el-button
                circle
                size="mini"
                type="info"
                icon="el-icon-plus"
                @click="handleClick(scope.row,2)"
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
        </el-table-column> -->
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
     <!-- <el-dialog :title="Dtitle" :visible.sync="dialogEditerVisible" center width="50%">
      <el-form :model="formEditer" label-width="100px">
        <input type="hidden" v-model="formEditer.id">
        <el-form-item label="标题">
          <el-input v-model="formEditer.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="formEditer.author.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="ID">
          <el-input v-model="formEditer.id" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="Hits">
          <el-input v-model="formEditer.hits" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="formEditer.createTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="formEditer.status">
            <el-option
              v-for="item in Options"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
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
    <!-- <el-dialog :title="Dtitle" :visible.sync="dialogContentVisible" center width="50%">
      <el-form :model="viewData" label-width="100px">
      <el-form-item label="未通过审核说明">
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
    </el-dialog> -->
  </div>
</template>
<script>
import Vue from "vue";
import TitleBar from "../TitleBar";
import mixins from "../mixins/common";
import fetch from "../../util/fetch";

export default {
  name: "supplier-manage",
  components: { TitleBar },
  mixins:[mixins],
  props: {
    setHeights: {
      type: Number
    },
  },
  data() {
    return {
    //   viewValue:[],
      pageSize:5,
      currentPage: 0,
      total:0,
    //   formEditer: {
    //     author:{
    //         account:'',
    //       }, 
    //       title:'',
    //       createTime:'',
    //       state:0,
    //       content:''
    //   },
    //   Options:[
    //     {
    //       value: "0",
    //       label: "新建"
    //     },
    //     {
    //       value: "1",
    //       label: "通过"
    //     },
    //     {
    //       value: "2",
    //       label: "失败"
    //     }
    //   ],
    //   viewData:{
    //     sourceId:"",
    //     sourceType: 0,
    //     status:"",
    //     result:""
    //   },
    //   dialogContent: '默认展示的内容',
    //   dialogEditerVisible: false,
    //   dialogContentVisible: false,
    //   keyWords: [],
    //   multipleSelection: [],
    //   deletAll: [],
    //   Dtitle:"",
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
    // handleSizeChange(val) {
    //   this.loadData();
    // },
    // handleCurrentChange(val) {
    //   this.loadData();
    // },
    // handleClick(row, type) {
    //   let self = this;
    //   if (type === 1){
    //     self.Dtitle = "编辑";
    //     self.dialogEditerVisible = true;
    //     let obj = {};
    //     for (let key in row) {
    //       obj[key] = row[key];
    //     }
    //     debugger
    //     self.formEditer = obj;
    //   }else if (type === 2) {
    //     self.Dtitle="添加";
    //     self.dialogEditerVisible = true;
    //     self.formEditer = {
    //       author:{
    //         account:'',
    //       }, 
    //       title:'',
    //       createTime:'',
    //       state:0,
    //       content:''
    //     };
    //   }else if (type === 3) {
    //     self.Dtitle="删除";
    //     self.messageBox("此操作将永久删除该条记录, 是否继续?",()=>{
    //       fetch("/agriculturalms/del/"+ row.id,row, "delete").then(
    //         res => {
    //           this.loadData();
    //           this.$notify({
    //           title: '成功',
    //           message: '删除成功',
    //           type: 'success'
    //         });
    //         },
    //         err => {
    //           self.$notify({
    //             title: "警告",
    //             message: err.msg,
    //             type: "warning"
    //           });
    //           // 请求失败
    //         }
    //       );
    //     })
    //   } else if (type === 4) {
    //     self.Dtitle="审核";
    //     self.dialogContentVisible = true;
    //     self.viewData["sourceId"] = row.id;
    //   } 
    // },
    loadData(){
      let self = this;
      fetch("/auditing/getpage/24acfc1215da435cbe76c69beb07f32b/"+(self.currentPage - 1)+"/"+self.pageSize,{}, "GET").then(
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



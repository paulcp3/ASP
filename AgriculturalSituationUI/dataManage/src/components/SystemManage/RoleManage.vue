<template>
  <div class="company-msg box-padding user-manage">
    <title-bar name="权限管理"></title-bar>
    <el-row class="search-bar">
      <el-col :span="12">
        <el-input
          style="width:240px;"
          placeholder="请输入关键字搜索"
          prefix-icon="el-icon-search"
          v-model="keyWords"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="loadData" style="margin-left:10px;">搜索</el-button>
      </el-col>
      <el-col :span="6" :offset="6" class="text-right">
        <el-button type="primary" icon="el-icon-edit" @click="handleClick">添加</el-button>
       
      </el-col>
    </el-row>
    <div class="table-contair">
      <el-table :data="tableData" stripe :height="setHeights-170" border style="width: 100%">
        <!-- <el-table-column type="selection" width="55"></el-table-column>/ -->
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="roleName" label="帐号" width="150"></el-table-column>
        <el-table-column prop="resourceName" label="角色">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.resourceName" size="mini" style="margin-right:5px;">{{item}}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="group" label="用户组" width="120"></el-table-column> -->
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
      <!-- <div class="text-center" style="padding:10px 0;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div> -->
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogEditerVisible" center width="40%">
      <el-form :model="formEditer" label-width="100px">
        <el-form-item label="角色：">
          <el-input v-model="formEditer.roleName"></el-input>
        </el-form-item>
        <el-form-item label="资源：">
          <!-- <el-popover placement="bottom-start" width="400" trigger="focus"> -->
            <el-tree
            ref="tree"
              :data="roleData"
              show-checkbox
              node-key="id"
              :props="defaultProps" 
           
              @check-change="handleCheck"
            ></el-tree>
            <!-- <el-input v-model="formEditer.role" slot="reference" autocomplete="off"></el-input> -->
          <!-- </el-popover> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditerVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrupdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import TitleBar from "../TitleBar";
import mixins from "../mixins/common";
import fetch from "../../util/fetch";

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
      resourceId:[],
      roleData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
      dialogVisible: false,
      groupOption: [
        {
          value: "企业用户",
          label: "企业用户"
        }
      ],
      formEditer: {
      resourceId: "",
        roleName: ""
      },
      dialogTitle: "编辑",
      currentPage: 1,
      pageSize:5,
      total:0,
      dialogEditerVisible: false,
      keyWords: "",
      tableData: [
        // {
        //   roleName: "aogu",
        //   resourceName: ["权限一", "权限二", "权限三", "权限四", "权限五", "权限六"]
        // },
        // {
        //   roleName: "aogu2",
        //   resourceName: ["权限一", "权限二", "权限三"]
        // }
      ]
    };
  },
  methods: {
   
    handleCheck(obj,state){
      //如果state 为true 就代表这个节点被勾选了
      // console.log("1")
    },
     getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes());
      },
    tabHandleClick() {},
    changeQR(val) {
      if (val === "1") {
        this.formEditer.QRnumber = 1;
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleDelete() {},
    handleClick(row, type) {
     
      let self = this;
      // self.$refs.tree.setCheckedKeys([]);
      if (type === 1) {
        self.dialogEditerVisible = true;
        self.dialogTitle = "编辑";
        for (let i in row) {
          self.formEditer[i] = row[i];
        }
        debugger
       var resourceList = row["resourceList"];
        var arr = [];
       for(var i=0;i<resourceList.length;i++){
         arr.push(  resourceList[i]["id"])
       }
       debugger
        self.$refs.tree.setCheckedKeys(arr);
      } else if (type == 2) {
        self.messageBox("此操作将永久删除该条记录, 是否继续?", () => {
               fetch("/role/del/"+row.id, {}, "delete").then(
            res => {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success"
              });
              this.loadData();
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
        });
      } else {
        // self.$refs.tree.getCheckedKeys().length=0;
        
        self.dialogEditerVisible = true;
        self.dialogTitle = "添加";
        self.$nextTick(() => {
    self.$refs.tree.setCheckedKeys([]);
});
      }
    },
    loadSourceTree(){
       fetch("/source/getallsource", {}, "get").then(
          res => {
            this.roleData=res[0].data;
          }
        );
    },saveOrupdate(){
     var treeNode = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
     if(this.dialogTitle == "添加"){
       this.formEditer.resourceId = treeNode;
       fetch("/role/add", this.formEditer, "post").then(
          res => {
            // this.roleData=res[0].data;
            this.loadData();
            this.dialogEditerVisible = false;
            this.$notify({
              title: "成功",
              message: "添加成功",
              type: "success"
            });
          }
        );
     }
    },
   loadData(){
   let self = this;
      fetch(
        "/role/getpage/" +
          self.currentPage +
          "/" +
          self.pageSize +
          "?param=" +
          self.keyWords,
        {},
        "GET"
      ).then(
        res => {
          var list = res[0].data.list;
          // for (var i = 0; i < list.length; i++) {
          //   var time = formatDate(list[i].sellTime);
          //   list[i].sellTime = time;
          //   list[i].sellTime = formatDate(list[i].sellTime);
          // }
          //
          this.tableData = list;
          this.total = res[0].data.total;
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
    }
  },
  mounted() {
    let self = this;
    self.loadSourceTree();
    self.loadData();
    window.onresize = function() {
      self.tableHeight = document.body.offsetHeight - 150;
    };
  }
};
</script>

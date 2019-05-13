<template>
  <div class="company-msg box-padding user-manage">
    <title-bar name="分类管理"></title-bar>
    
    <div class="custom-tree-container">
      <div class="block">
      <el-tree
        :data="tableData"

        node-key="id"
        default-expand-all
        :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="info" 
              icon="el-icon-edit"
              size="mini"
              @click="() => edit(data)">
              编辑
            </el-button>
            <el-button
              type="primary" 
              icon="el-icon-plus"
              size="mini"
              @click="() => append(data)">
              添加
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="() => remove(node, data)">
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
      <el-dialog :title="Dtitle" :visible.sync="dialogEditerVisible" center width="50%">
        <el-form :model="formEditer" label-width="100px">
          <!-- <input type="hidden" v-model="formEditer.id"> -->
           <el-form-item label="名称">
            <el-input v-model="formEditer.name" autocomplete="off"></el-input>   
          </el-form-item>  
        
              <el-form-item label="父类">
       <el-tree  ref="tree"
        :data="tableData"
        :check-strictly="true"
        show-checkbox
        node-key="id"
        default-expand-all
        @check="changeTree"
        :expand-on-click-node="false">
       
      </el-tree>
      </el-form-item >
        
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditerVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateOrSave">确 定</el-button>
        </div>
      </el-dialog>
      </div>
    </div>

  </div>
</template>
<script>
import Vue from "vue";
import TitleBar from "../TitleBar";
import mixins from "../mixins/common";
import fetch from "../../util/fetch";

let id = 1000;

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
      pageSize:5,
      currentPage: 0,
      total:0,
      Dtitle:"添加栏目",
      formEditer: {},
      dialogVisible: false,
      formEditer: {},
      dialogTitle: "编辑",
      dialogEditerVisible: false,
      tableData: []
    };
  },

  methods: {
    tabHandleClick() {},
    edit(data){
        let self = this;
      debugger
      self.Dtitle = "编辑"
      self.dialogEditerVisible = true;
      var obj = {};
          var resourceList = data["pid"];
        self.$nextTick(() => {
            self.$refs.tree.setCheckedKeys([], true);
       
            self.$refs.tree.setChecked(resourceList, true, false);
          
        });
      // this.formEditer.id = data.id;
      // this.formEditer.pid = data.pid;
      obj.name = data.label;
      obj.id=data.id;
      self.formEditer = obj;

    },
    append(data) {
      debugger
      this.Dtitle = "添加"
      this.dialogEditerVisible = true;
      this.formEditer.id = data.id;
      this.formEditer.pid = data.pid;
      this.formEditer.name = data.label;

    },
     changeTree(data, checked, indeterminate) {
      let self = this;
      let check = checked.checkedKeys;
      self.formEditer.pid = data.id;
      self.$refs.tree.setCheckedKeys([]);
      if(check.length>0){
         self.$refs.tree.setCheckedKeys([data.id]);
      }
    },
    updateOrSave() { 
 var treeNode = this.$refs.tree.getCheckedKeys()[0];
 debugger
      this.formEditer.pid = treeNode;
        if(this.Dtitle=="添加"){
      debugger
          fetch("/industrytype/add", this.formEditer , "POST").then(
          res => {
            this.loadData();
            this.dialogEditerVisible = false;
            this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success'
          });
          },
          err => {
            this.dialogEditerVisible = false;
            this.$notify({
              title: "警告",
              message: err.msg,
              type: "warning"
            });
            // 请求失败
          }
        );

        }else {
        fetch("/industrytype/update", this.formEditer, "PUT").then(
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
        }
        
    },

    remove(node, data) {
      let self = this;
      // const parent = node.parent;
      // const children = parent.data.children || parent.data;
      // const index = children.findIndex(d => d.id === data.id);
      // children.splice(index, 1);
      self.messageBox("此操作将永久删除该栏目, 是否继续?", () => {
        fetch("/industrytype/del/"+ data.id,{}, "delete").then(
        res => {
          debugger
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

    renderContent(h, { node, data, store }) {
      return (
        `<span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button type="info" icon="el-icon-edit" on-click={ () => this.edit(data) }>添加</el-button>
            <el-button type="primary" icon="el-icon-plus" on-click={ () => this.append(data) }>添加</el-button>
            <el-button type="danger" icon="el-icon-delete" on-click={ () => this.remove(node, data) }>删除</el-button>
          </span>
        </span>`);
    },

    changeQR(val) {
      if (val === "1") {
        this.formEditer.QRnumber = 1;
      }
    },
    handleSizeChange(val) {
      this.loadData()
    },
    handleCurrentChange(val) {
      this.loadData()
    },
    handleDelete() {},
    // handleClick(row, type) {
    //   let self = this;
    //   if (type === 1) {
    //     self.dialogEditerVisible = true;
    //     this.dialogTitle = "编辑";
    //     for (let i in row) {
    //       self.formEditer[i] = row[i];
    //     }
    //   } else if (type == 2) {
    //     self.messageBox("此操作将永久删除该条记录, 是否继续?", () => {
    //       self.$message({
    //         type: "success",
    //         message: "删除成功!"
    //       });
    //     });
    //   } else {
    //     self.dialogEditerVisible = true;
    //     this.dialogTitle = "添加批次";
    //   }
    // },
    loadData(){
      let self = this;
      fetch("/industrytype/gettree",{}, "GET").then(
        res => {
        self.tableData=res[0].data.list;
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


<style scope>
  .block{
    width: 98%;
    max-height: 500px;
    margin: 20px auto;
    border: 1px solid #eee;
    padding: 15px;
    overflow: scroll;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-tree-node{
    margin: 10px 0;
  }
</style>

<template>
  <div class="company-msg box-padding user-manage">
    <title-bar name="区域管理"></title-bar>
    <el-row class="search-bar">
      <el-col :span="12">
        <el-input placeholder="请输入区域名称" v-model="keyWords" class="input-with-select">
          <el-select style="width:100px;" v-model="select" slot="prepend" placeholder="请选择">
            <el-option :label="item.label" :value="item.value" v-for="item in options" :key="item.id"></el-option>
    
          </el-select>
          <el-button slot="append" icon="el-icon-search" type="primary">搜索</el-button>
        </el-input>
      </el-col>
      <el-col :span="6" :offset="6" class="text-right">
        <el-button type="primary" icon="el-icon-edit" @click="handleClick">添加</el-button>
      </el-col>
    </el-row>
    <div class="table-contair">
      <el-table :data="tableData" stripe :height="setHeights-170" border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="code" label="行政区域代码"></el-table-column>
        <el-table-column prop="company" label="行政单位"></el-table-column>
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
          :current-page.sync="currentPage3"
          :page-size="100"
          layout="prev, pager, next, jumper"
          :total="1000"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogEditerVisible" center width="40%">
      <el-form :model="formEditer" label-width="100px">
        <el-form-item label="基地：">
          <el-select v-model="formEditer.group">
            <el-option
              :key="item.value"
              v-for="item in options"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域：">
          <el-input v-model="formEditer.company"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditerVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogEditerVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import TitleBar from "../TitleBar";
import mixins from "../mixins/common";
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
      select:'',
      options: [
        {
          value: "datian",
          label: "大田地块"
        },
        {
          value: "sc",
          label: "水产基地"
        },
        {
          value: "bz",
          label: "泵站"
        }
      ],
      dialogVisible: false,
      groupOption: [
        {
          value: "企业用户",
          label: "企业用户"
        }
      ],
      formEditer: {
          group:'',
          company: "屯溪区",
          code: "tx22114"
      },
      dialogTitle: "编辑",
      currentPage3: 5,
      dialogEditerVisible: false,
      keyWords: "",
      tableData: [
        {
          company: "屯溪区",
          code: "tx22114"
        },
        {
          company: "屯溪区",
          code: "tx22114"
        }
      ]
    };
  },
  methods: {
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
      if (type === 1) {
        self.dialogEditerVisible = true;
        this.dialogTitle = "编辑";
        for (let i in row) {
          self.formEditer[i] = row[i];
        }
      } else if (type == 2) {
        self.messageBox("此操作将永久删除该条记录, 是否继续?", () => {
          self.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      } else {
        self.dialogEditerVisible = true;
        this.dialogTitle = "添加";
      }
    }
  },
  mounted() {
    let self = this;
    window.onresize = function() {
      self.tableHeight = document.body.offsetHeight - 150;
    };
  }
};
</script>

<template>
  <div class="company-msg box-padding customer-manage">
    <title-bar name="文章发布"></title-bar>
    <div class="item">
      <label for="" class="item-lable">
        标题：
      </label>
      <input type="text" class="item-input">
    </div>
    <div class="item">
      <label for="" class="item-lable">
        关键词：
      </label>
      <input type="text" class="item-input">
    </div>
    <div class="item">
      <label for="" class="item-lable">
        描述：
      </label>
      <input type="text" class="item-input">
    </div>
    <div class="item">
      <label for="" class="item-lable">
        作者：
      </label>
      <input type="text" class="item-input">
    </div>
  
    <div class="item">
      <label for=""  class="item-lable">正文：</label>
      <UEditor :config = config ref="ue" class="item-input item-input-txt"></UEditor>
      <!-- <div id="editor" ></div>    -->
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogEditerVisible = false">重 置</el-button>
      <el-button type="primary" @click="updateOrSave">提 交</el-button>
    </div>
      
  </div>
</template>
<script>
import Vue from "vue";
import UEditor from '../Ueditor';
import TitleBar from "../TitleBar";
import mixins from "../mixins/common";
import fetch from "../../util/fetch";


export default {
  name: "ue",
  components: { TitleBar, UEditor},
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
        initialFrameWidth: 1000,
        initialFrameHeight: 200
      }
    }
  },
  methods: {
    // getUEContent() {
    //     let content = this.editor.getUEContent();
    //     console.log(content);
    // }
  },
  mounted (){
    // this.editor = UE.getEditor('editor',this.config);
    // this.editor.execCommand('insertHtml', " <h2> <input placeholder='请在这里输入标题' /> </h2> <hr/>",true);
  },
  destroyed() {
// 　　this.editor.destroy();
  }

};
</script>

<style scoped>
  .company-msg{
    overflow: scroll;
  }
  .item{
    width: 100%;
    margin:10px auto 10px;
  }
  .item-lable,.item-input{
    display: inline-block;
    vertical-align: middle;
  }
  .item-lable{
    width: 100px;
    text-align: left;
    font-size: 14px;
    color: #666;
    padding-left: 20px;
  }
  .item-input{
    width: 1000px;
    padding: 5px;
    border: 1px solid #ddd;
  }
  .item-input-txt{
    border: none;
  }
  .dialog-footer{
    text-align: center;
    margin-top: 20px;
  }
</style>


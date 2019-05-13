<template>
  <div class="title-bar">
    <div class="tip">{{name}}</div>
  </div>
</template>
<script>
import Vue from "vue";
export default {
  name: "title-bar",
  props: {
    name: {
      type: String
    }
  },
  data() {
    return {};
  }
};
</script>
<style scoped>
.tip {
  padding: 8px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: #50bfff 5px solid;
  font-weight: bold;
}
</style>
>

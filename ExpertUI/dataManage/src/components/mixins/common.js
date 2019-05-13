import moment from 'moment';
import Vue from "vue";
import $ from "jquery";
export default {
  data() {
    return {
      clientHeight: 600,
      clientWidth: 1000,
      height:0
    }
  },
  filters: {
    tovideoPlayerOption(value) {
      return {
        start: 0,
        sources: [{
          type: 'video/mp4',
          src: value.Path
        }]
        // ,
        // poster:util.buildUrl('/upload/small/'+value.SourcePath+'.jpg')
      }
    },
    dateString(value) {
      return moment(value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY年MM月DD日')
    },
    datetimeString(value) {
      return moment(value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY年MM月DD日 HH:mm')
    },
    joinList(value) {
      return value.join('、')
    },
    joinListObj(value) {
      let arr = []
      for (let i = 0; i < value.length; i++) {
        arr.push(value[i].Name)
      }
      return arr.join('、');
    }
  },
  methods: {
    messageBox(msg, callback) {
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (typeof callback == "function") {
            return callback();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    resize() {
      this.clientWidth = this.windowResize().width;
      this.clientHeight = this.windowResize().height;
      
    },
    windowResize() {
      var documentW = document.body.offsetWidth;
      var documentH = document.body.offsetHeight;
      // var leftW = document.getElementById("leftMenu").width;
      this.height = documentH;
      return {
        width: documentW - 205,
        height: documentH - 65
      };
     
    }
  },
 
  mounted() {
    let self = this;
   
    self.resize();
    $(window).resize(function() {
      self.resize();
    });
    
  }
}

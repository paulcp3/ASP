

/**
 * 获取网站网址
 */
$(function(){
  
    window.getBaseUrl = function(){
        // return 'http://localhost:16000/api/expert/file/';
        return 'http://36.7.159.225:16000/expert/expert/file/';
    }
    window.getApiRoot = function(){
        // return 'http://localhost:16000/api/expert';
      return 'http://36.7.159.225:16000/api/expert';
    }
    window.getUuid = function(){
        return '24acfc1215da435cbe76c69beb07f32b';
    }
    window.getRegionId = function(){
        return '101221002';
    }
})





/**
 * 获取url参数
 * @param {*} sProp 
 */
function getParameters(sProp) { // 获取url键值 传入key 返回 value
    var re = new RegExp(sProp + "=([^\&]*)", "i");
    var a = re.exec(document.location.search);
    if (a == null)
        return null;
    return a[1];//parseInt
};


function html2Text(content) { // 
    var dd=s.replace(/<\/?.+?>/g,"");
    var dds=dd.replace(/ /g,"");//dds为得到后的内容
    return dds;
};


/**
 * 格式化时间
 * @param {*} date 
 * @param {*} fmt 
 */
function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (var k in o) {
        if (new RegExp('('+k+')').test(fmt)) {
 
            var str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

//提示框
function showAlert(obj, title, msg, btnTitle) {
    obj.$alert(msg, '提示', {
        confirmButtonText: btnTitle,
        callback: function(action) {
            
        }
    });
}

//提示语
function showMsg(obj, msg){
    obj.$message({
        type: 'info',
        message:msg
    });
}



$(function(){
    $('.menu-box-wrap').mouseover(function(){
        $(this).addClass('active');
    })
    $('.menu-box-wrap').mouseleave(function(){
        $(this).removeClass('active');
    })
/**
 * 获取网站网址
 */
    window.getBaseUrl = function(){
        return 'http://36.7.159.225:16000/api/as/file/';
        //return 'http://36.7.159.225:16000/api/as/file/';
    }
    window.getApiRoot = function(){
        return 'http://36.7.159.225:16000/api/as';
      //return 'http://36.7.159.225:16000/api/as';;
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
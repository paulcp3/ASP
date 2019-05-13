/**
 * 工具类
 */

/**
 * 读取sessionStorage
 * @param {String} key 为需要读取的Storage的key
 * @param {Object} type 读取出错时需要返回的数据
 */

export function GetStorage(key, type) {

    try {
        const result = JSON.parse(sessionStorage.getItem(key));
        if (result === null || result === '') {
            return type;
        }
        return result;
    } catch (err) {
        return type;
    }
}

function add0(m) { return m < 10 ? '0' + m : m }
export function formatDate(date) {
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(date);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}


// 去除左右空格
export function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}

// 删除左边的空格
export function ltrim(str) {
    return str.replace(/(^\s*)/g, '');
}

// 删除右边的空格
export function rtrim(str) {
    return str.replace(/(\s*$)/g, '');
}

// 判断字符串是否为空
export function isStrEmpty(text) {
    if (text === undefined || text === null || text === '' || text === 'null' || text === 'undefined') {
        return true;
    }
    return text.replace(/(\s*$)/g, '') === '';
}

// 判断对象是否为空
export function isObjEmpty(obj) {
    if (obj != null && obj !== undefined && typeof(obj) === 'object') {
        for (let p in obj) {
            return false;
        }
        return true;
    }
    return true;
}

/**
 * 通过传入的时间计算年月日和季度
 * @param {Date} time 传入的时间
 */
export function calcYearMonthDay(time) {
    const today = time ? new Date(time) : new Date();
    const _year = today.getFullYear();
    const _month = today.getMonth() + 1;
    const _quarter = parseInt(_month / 4) + 1;
    const _day = today.getDate();
    const _formatToday = `${_year}/${_month < 10 ? '0' + _month : _month}/${_day < 10 ? '0' + _day : _day}`;

    return {
        year: _year,
        month: _month,
        quarter: _quarter,
        day: _day,
        format: _formatToday
    };
}

/**
 * 数字处理
 * @param {Number} number 需要处理的数字
 * @param {Number} max 数字允许的最大值
 */
export function largeNumber(number, max) {
    if (number > max) {
        return max;
    } else {
        return number;
    }
}

/**
 * 过滤字符串,清除左右空格、特殊字符、emoji表情
 * @param {String} str 字符串
 */
export function stringFilter(str) {
    str = str.replace(/(^\s*)|(\s*$)/g, ''); // 清除左右空格
    str = str.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ''); // 清除emoji表情符号
    str = str.replace(/[-_,!|\\/~`()#$%^&*{}:;"L<>?]/g, ''); // 清除特殊字符

    return str;
}

/**
 * 获取设备DPI值
 * @param {Object} context canvas对象
 * @return {Number} 设备DPI值
 */
export function getPixelRatio(context) {
    let backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;

    return (window.devicePixelRatio || 1) / backingStore;
}

/**
 * 获取url中的参数
 * @param {String} hash url中?以后的字符串; 可选
 * @return {Object} 参数集合的对象
 */
export function getQueryString(hash) {
    let qs = hash ? hash.slice(hash.indexOf('?') + 1) : window.location.href.slice(window.location.href.indexOf('?') + 1); // 获取url中"?"符后的字串

    if (Object.prototype.toString.call(qs) !== '[object String]') return {};

    let args = {}; // 保存参数数据的对象
    let items = qs.length ? qs.split('&') : []; // 取得每一个参数项
    let item = null;
    let len = items.length;

    try {
        for (let i = 0; i < len; i++) {
            item = items[i].split('=');

            let name = decodeURIComponent(item[0]);
            let value = decodeURIComponent(item[1]);

            if (name) {
                args[name] = value;
            }
        }
    } catch (err) {
        console.log(err);
        return args;
    }

    return args;
}


/**
 * 清楚html标签
 * 
 * 
*/ 

export function delHtmlTag(str){
    return str.replace(/<[^>]+>/g,"");
}
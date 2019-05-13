/**
 * axios 请求配置文档
 */

// 打包到App中运行
import {
    getQueryString
} from './utils';
let BASEURL = '';
if (process.env.NODE_ENV) {
    // 开发环境
    BASEURL = 'http://36.7.159.225:16000/api/expert';
} else {
    // 生产环境
    BASEURL = 'http://36.7.159.225:16000/api/expert';
}

// BASEURL += '';

// API文档


export default {
    baseURL: BASEURL,
    timeout: 60000, // 超时时间
    withCredentials: true // 允许cookie
}
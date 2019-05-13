import axios from 'axios'
import axiosConfig from './axios.config'
import Cookies from 'js-cookie'
import {
    Loading
} from 'element-ui'

//del by liulei 移动下位置
// let Token = Cookies.get('Token')

const wxRequest = function (url, data, method, file) {

  //modi by liulei
  let Token = Cookies.get('Token')

  let loadingInstance = Loading.service({
    text: '正在加载中，请稍后...'
  })
  return new Promise((resolve, reject) => {
    data = data || {}
    console.log('===== 数据请求开始 =====')
    let _dataStorage = {}
        // debugger
    if (!file) {
      if (/GET/i.test(method) || /DELETE/i.test(method)) {
        _dataStorage = {
          params: data
        }
      } else if (/POST/i.test(method) || /PUT/i.test(method)) {
        _dataStorage = JSON.stringify(data)
      };
    } else {
      _dataStorage = data
    }
    let _params = {
      data: _dataStorage,
      ...axiosConfig,
      url: url,
      method: method,
      headers: {
        // modi by liulei token 小写
        'token': Token || 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJ0eXBlIjoxLCJleHAiOjE1NTYwNDI1NTd9.Qe2KcPDLslM_7iipsVacFnHFMAndp1ZZ_vLhC2Dlezs',
        'Content-type': file ? 'multipart/form-data' : 'application/json;charset=UTF-8'
      }
    }
    axios(_params).then((response) => {
      if (response.data.code === 1000000 || response.data.code === 1000001 || response.data.code === 1000002) {
                // console.log('===== 数据请求成功 =====');
        loadingInstance.close()
        resolve([response.data, response.headers])
      } else {
                // console.log('===== 数据请求失败 =====', response);
                debugger
        loadingInstance.close()
        response.data['message'] = response.data.errMsg || response.data.message || response.data.msg
        reject(response.data)
      }
    }, (error) => {
            // console.log('===== 网络错误=====', error);
      loadingInstance.close()
      error.msg = '网络错误'
      reject(error)
    })
  })
}

export default wxRequest

import Tips from './tips';
import md5 from '../libs/md5';
import {randomStr} from './tools';
import store from '../store/index';
const regeneratorRuntime = require('../libs/runtime.js');

import {baseUrl} from "../api/config";

/**
 * 根据params生成签名
 * @param params
 * @returns {*|string}
 */
const sign = function (params = {}) {
  const keys = Object.keys(params);
  keys.sort();
  let _sign = keys.map(key => {
    return `${key}=${params[key]}`
  }).join('&') + '&v__s_k_=xh_default';
  const random = '_xh' + randomStr();
  _sign = md5(_sign, random).toUpperCase();
  return _sign;
};

/**
 * 清除空值字段
 * @param data
 */
const clearBlank = function (data) {
  let params = {};
  for (let i in data) {
    let item = data[i];
    if (item !== null && item !== undefined) {
      params[i] = data[i]
    }
  }
  return params
};

const addToken = function (params, url) {
  const withoutToken = ['auth/session'];
  if (withoutToken.indexOf(url) < 0) {
    params.userToken = store.data.token || undefined;
    return !!store.data.token
  }
  return true
};

/**
 * 判断请求是否成功
 * @param res
 * @returns {*}
 */
const isSuccess = function (res) {
  // return res && res.statusCode == 200;
  const wxCode = res.statusCode;
  if (wxCode === 200) {
    const wxData = res.data;
    if (wxData && wxData.code === 200) {return true}
    Tips.error(wxData && wxData.msg ? wxData.msg : '请求错误');
    return false;
  } else if (wxCode === 500) {
    Tips.error(res.data && res.data.data ? res.data.data.message : '请求错误');
    return false;
  } else if (wxCode === 400){
    const message = res.data && res.data.data ? res.data.data.message : '请求错误';
    try {
      let msg = JSON.parse(message);
      Tips.error(msg[0] ? msg[0].message : '请求错误');
    } catch (e) {
      Tips.error(message);
    }
    return false
  } else if (wxCode === 403){
    Tips.error('请重试一次');
    return false
  } else {
    return false
  }
};

/**
 * 请求失败的处理
 * @param res
 */
const exception = async function (res) {
  switch (res.statusCode) { // 请求状态码
    case 400:
      console.log(400);
      Tips.error('错误请求');
    case 403:
      console.log(403);
      Tips.error('token过期');
      break;
    case 404:
      console.log(404);
      await Tips.error('请求路径不存在');
      break;
    case 500:
      console.log(500);
      Tips.error('服务器错误');
      break;
    default:
      break;
  }
};

export default {

  async request (method, url, data, loading = false) {
    loading && Tips.loading();
    let params = clearBlank(data);
    addToken(params, url);
    const res = await new Promise((resolve, reject) => {
      wx.request({
        url: `${baseUrl}/${url}`,
        method: method,
        header: {
          'content-type': 'application/json',
          // 'content-type': 'application/x-www-form-urlencoded',
          // login_code: app.globalData.auth.login_code,
          // userToken: app.globalData.auth.userToken,
          // _sign: sign(params)
        },
        data: params,
        complete: res => {
          resolve(res)
        }
      })
    });
    loading && Tips.loaded();
    // console.log(res, 0);
    if (isSuccess(res)) {
      return res.data.data;
    } else {
      return null
    }
  },

  get (url, data, loading = false) {
    return this.request('GET', url, data, loading);
  },

  post (url, data, loading = false) {
    return this.request('POST', url, data, loading);
  },

  async upload (url, {filePath, formData}) {
    const res = await new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${baseUrl}/${url}?session_key=${store.data.token || undefined}`,
        filePath: filePath,
        name: 'file',
        formData: formData,
        complete: res => {
          resolve(res)
        }
      })
    });
    if (isSuccess(res)) {
      // console.log(res.data, typeof res.data)
      return res.data;
    } else {
      exception(res);
    }
  }
}

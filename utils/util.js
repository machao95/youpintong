import Tips from './tips';
import store from '../store/index';
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n
};

const mock = function(data = {}, time = 500) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, time);
  });
};

// 检测接口返回是否正确
const ToOperationResult = function(res, codeMsg = {}, successCodes = ["0"]) {
  if (res) {
    if (successCodes.indexOf(res.errcode) >= 0) {
      return {
        success: true,
        errMsg: null
      };
    } else if (res.errcode == "-9999" || res.errcode == "-8888") {
      Tips.error('登录过期');
      wx.setStorageSync('token', undefined);
      store.data.token = '';
      wx.reLaunch({
        url: '/pages/mine/mine'
      })
    } else {
      console.log(typeof res, 'else');
      return {
        success: false,
        errMsg: res.msg || codeMsg[res.code] || '未知错误'
      };
    }
  }
  return {
    success: false,
    errMsg: '无结果'
  };
};

const ToPageTableData = function(data) {
  console.log(data, 'table res')
  const result = {
    data: [],
    page: {}
  };
  if (data && data.data) {
    result.data = data.data.data;
    result.page = data.data.page;
    result.page.isLastPage = result.page.pageNo === Math.ceil(result.page.total / result.page.pageSize)
  }
  console.log(result, 'table data');
  return result;
};

module.exports = {
  formatTime: formatTime,
  mock: mock,
  ToOperationResult,
  ToPageTableData
};

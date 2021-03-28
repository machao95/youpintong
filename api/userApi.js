import request from '../utils/request';
import wxUtils from '../utils/wxUtils';
import Tips from '../utils/tips';
import store from '../store/index';
import {mock, ToOperationResult} from '../utils/util';
import {formatDate} from "../utils/tools";

const regeneratorRuntime = require('../libs/runtime.js');
const app = getApp();

module.exports = {

  // 收货地址
  async getAddressList(params) {
    Tips.loading();
    const data = await request.get('user/address/info/list', params);
    Tips.loaded();
    return data
  },

  // 添加地址
  async addAddress(params) {
    Tips.loading('正在提交');
    const data = await request.post('user/address/info/save', params);
    Tips.loaded();
    return data
  },

  // 修改地址
  async editAddress(params) {
    Tips.loading('正在提交');
    const data = await request.post('user/address/info/update', params);
    Tips.loaded();
    return data
  },

  // 删除地址
  async removeAddress(params) {
    Tips.loading('正在删除');
    const data = await request.post('user/address/info/remove', params);
    Tips.loaded();
    return data
  },


  // 登录
  async login(params) {
    Tips.loading('正在登录');
    const data = await request.get('auth/session', params);
    Tips.loaded();
    return data
  },

  // 更新用户信息
  async updateUser(params) {
    const data = await request.post('auth/updateUser', params);
    return data
  },

  // 获取用户详情
  async getUserDetail(params) {
    Tips.loading('获取用户信息');
    const data = await request.get('auth/getUserInfo', params);
    Tips.loaded();
    return data
  },

  // 提交反馈
  async feedBack(params) {
    Tips.loading('正在提交');
    const data = await request.post('opinion/info/save', params);
    Tips.loaded();
    return data
  },

  // 收藏点赞数量
  async getNumberStatistics(params) {
    Tips.loading();
    const data = await request.get('like/info/statistics', params);
    Tips.loaded();
    return data
  },

  // 添加点赞收藏
  async saveCollectUp(params) {
    Tips.loading();
    const data = await request.post('like/info/save', params);
    Tips.loaded();
    return data
  },

  // 取消点赞收藏
  async cancelCollectUp(params) {
    Tips.loading();
    const data = await request.post('like/info/cancel', params);
    Tips.loaded();
    return data
  },

  // 点赞收藏是否存在
  async exitCollectUp(params) {
    Tips.loading();
    const data = await request.get('like/info/exist', params);
    Tips.loaded();
    return data
  },

  // 积分明细记录
  async getIntegralRecord(params) {
    Tips.loading();
    const data = await request.get('user/integral/info/page', params);
    Tips.loaded();
    if (data && data.data) {
      data.data.forEach(item => {
        item.createTime = formatDate(new Date(item.createTime), 'YYYY-MM-DD')
      })
    }
    return data
  },

};

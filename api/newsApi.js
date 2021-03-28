import request from '../utils/request';
import wxUtils from '../utils/wxUtils';
import Tips from '../utils/tips';
import store from '../store/index';
import {mock, ToOperationResult} from '../utils/util';
import {formatDate} from "../utils/tools";

const regeneratorRuntime = require('../libs/runtime.js');
module.exports = {

  // 资讯列表
  async getNewsList(params) {
    Tips.loading('正在加载');
    const data = await request.get('article/info/page', params);
    Tips.loaded();
    return data
  },

  // 单个详情
  async getNewsDetail(params) {
    Tips.loading();
    const data = await request.get('article/info/detail', params);
    Tips.loaded();
    return data
  },

  // 评论列表
  async getCommentList(params) {
    Tips.loading();
    const data = await request.get('comment/info/listByCommentId', params);
    Tips.loaded();
    return data
  },

  // 发表评论
  async publishComment(params) {
    Tips.loading('正在发送');
    const data = await request.post('comment/info/save', params);
    Tips.loaded();
    return data
  },

  // 收藏列表
  async getCollection(params) {
    Tips.loading();
    const data = await request.get('like/info/article/list', params);
    Tips.loaded();
    return data
  },

  // 点赞列表
  async getUpList(params) {
    Tips.loading();
    const data = await request.get('like/info/article/up/list', params);
    Tips.loaded();
    return data
  },



};

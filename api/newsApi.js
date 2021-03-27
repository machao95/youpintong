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
    Tips.loading('发送中...');
    const data = await request.post('comment/info/save', params);
    Tips.loaded();
    return data
  },



  async getCollection(data) {
    Tips.loading('正在加载');
    const res = await request.post('news/c', data);
    Tips.loaded();
    const {success, errMsg} = ToOperationResult(res, {}, ["0"]);
    if (!success) Tips.info({title: '错误', content: errMsg});
    return []
  },



};

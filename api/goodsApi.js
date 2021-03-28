import request from '../utils/request';
import wxUtils from '../utils/wxUtils';
import Tips from '../utils/tips';
import store from '../store/index';
import {mock, ToOperationResult} from '../utils/util';
import {formatDate} from "../utils/tools";

const regeneratorRuntime = require('../libs/runtime.js');
module.exports = {

  // 收藏列表
  async getCollection(params) {
    Tips.loading();
    const data = await request.get('like/info/goods/list', params);
    Tips.loaded();
    return data
  },

  // 类别列表
  async getGoodsTypeList(params) {
    Tips.loading();
    const data = await request.get('goods/type/info/list', params);
    Tips.loaded();
    return data
  },

  // 商品列表
  async getGoodsList(params) {
    Tips.loading();
    const data = await request.get('goods/info/page', params);
    Tips.loaded();
    return data
  },

  // 商品详情
  async getGoodsDetail(params) {
    Tips.loading();
    const data = await request.get('goods/info/detail', params);
    Tips.loaded();
    return data
  },

  // 积分商品列表
  async getIntegralGoodsList(params) {
    Tips.loading();
    const data = await request.get('goods/integral/info/page', params);
    Tips.loaded();
    return data
  },

  // 积分商品详情
  async getIntegralGoodsDetail(params) {
    Tips.loading();
    const data = await request.get('goods/integral/info/detail', params);
    Tips.loaded();
    return data
  },

};

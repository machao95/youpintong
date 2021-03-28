import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import goodsApi from '../../api/goodsApi';
import userApi from '../../api/userApi';
import {LIKE_KIND, LIKE_TYPE} from "../../utils/constant";

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

  use: ['userInfo', 'token'],

  data: {
    userInfo: {},
    goodsDetail: {},
    collect: false,
    show: false,
    goodsType: 'normal' // normal or integral 普通或积分商品
  },

  onLoad(options) {
    const goodsType = options.type || 'normal';
    this.setData({goodsType: goodsType});
    this.getGoodsDetail(options.id, goodsType);
    goodsType === 'normal' && this.store.data.token && this.getCollectStatus(options.id);
  },

  showParamPanel() {
    this.setData({show: true})
  },

  closeParamPanel() {
    this.setData({show: false})
  },

  async getGoodsDetail(goodsId, goodsType) {
    const method = goodsType === 'integral' ? 'getIntegralGoodsDetail' : 'getGoodsDetail';
    const goodsDetail = await goodsApi[method]({goodsId});
    this.setData({goodsDetail: goodsDetail || {}});
  },

  async getCollectStatus(goodsId) {
    const collect = await userApi.exitCollectUp({
      userId: this.store.data.userInfo.userId,
      likeId: goodsId,
      likeKind: LIKE_KIND.COLLECT,
      likeType: LIKE_TYPE.GOODS
    });
    this.setData({collect: collect || false});
  },

  async handleCollect() {
    const method = this.data.collect ? 'cancelCollectUp' : 'saveCollectUp';
    const r = await userApi[method]({
      userId: this.store.data.userInfo.userId,
      likeId: this.data.goodsDetail.id,
      likeKind: LIKE_KIND.COLLECT,
      likeType: LIKE_TYPE.GOODS
    });
    r && this.setData({
      collect: !this.data.collect,
    });
  },

  toCar() {
    wxUtils.backOrNavigate('/pages/car/car')
  },

  addIntoCar(e) {
    let goodsList = [...this.store.data.cart];
    const {goodsDetail} = this.data;
    const index = goodsList.findIndex(item => item.id === goodsDetail.id);
    if (index >= 0) goodsList[index].number = goodsList[index].number + 1;
    // if (index >= 0) return Tips.success('加入成功');
    else goodsList.push({...goodsDetail, number: 1});
    this.store.data.cart = goodsList;
    wx.setStorageSync('cart', goodsList);
    Tips.success('加入成功');
  },

  handleBuy() {
    if (!this.store.data.token) {
      return wxUtils.backOrNavigate('/pages/mine/mine')
    }
    this.store.data.confirmOrderGoods = [{...this.data.goodsDetail, number: 1}];
    wxUtils.backOrNavigate(`/pages/orderConfirm/orderConfirm?goodsType=${this.data.goodsType}`);
  },

  handleExchange() {
    if (!this.store.data.token) {
      return wxUtils.backOrNavigate('/pages/mine/mine')
    }
    this.store.data.confirmOrderGoods = [{...this.data.goodsDetail, number: 1}];
    wxUtils.backOrNavigate(`/pages/orderConfirm/orderConfirm?goodsType=${this.data.goodsType}`);
  }


});

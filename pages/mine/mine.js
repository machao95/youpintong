import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import userApi from '../../api/userApi'
import newsApi from "../../api/newsApi";
import goodsApi from '../../api/goodsApi';

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {
  use: ['userInfo', 'token'],
  data: {
    canIUseGetUserProfile: false,
    goodsCollectCount: 0, // 商品收藏数量
    articleCollectCount: 0, // 文章收藏数量
    articleUpCount: 0, // 文章点赞数量
    integralRecord: [], // 积分记录
  },

  onShow() {
    if (this.store.data.token) {
      this.getCollectUpNum();
      this.getIntegralRecord();
      this.getUserIntegral()
    }
  },

  onLoad(options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  getUserInfo(e) {
    const {userInfo} = e.detail;
    userInfo && this.doLogin(userInfo);
  },

  async getUserProfile() {
    const res = await wxUtils.wxFuncSync('getUserProfile', {desc: '获取头像、昵称等公开信息'});
    res.userInfo && this.doLogin(res.userInfo);
  },

  async doLogin(userInfo) {
    console.log(userInfo, 'user');
    wx.setStorageSync('userInfo', this.store.data.userInfo);
    // 登录
    const {code} = await wxUtils.wxFuncSync('login');
    if (!code) return Tips.error('微信登录失败');
    const data = await userApi.login({code: code});
    if (data) {
      // 保存token
      this.store.data.token = data.userToken;
      wx.setStorageSync('token', data.userToken);
      // 保存用户信息
      const user = {
        ...this.store.data.userInfo,
        ...userInfo,
        openId: data.openId,
        userId: data.user ? data.user.id : null,
        integral: data.user ? data.user.integral : 0
      };
      // 更新用户
      if (!data.user) {
        await userApi.updateUser({
          openId: data.openId,
          ...userInfo,
          portrait: userInfo.avatarUrl
        });
        // 获取id
        const userInfoInDb = await userApi.getUserDetail({
          openId: data.openId
        });
        if (userInfoInDb) {
          user.userId = userInfoInDb.id;
          user.integral = userInfoInDb.integral;
        }
      }
      this.store.data.userInfo = user;
      wx.setStorageSync('userInfo', user);
      this.getCollectUpNum();
      this.getIntegralRecord();
    }
  },

  async getCollectUpNum() {
    const userId = this.store.data.userInfo.userId;
    const numObj = await userApi.getNumberStatistics({userId});
    numObj && this.setData(numObj);
  },

  async getIntegralRecord() {
    const userId = this.store.data.userInfo.userId;
    const data = await userApi.getIntegralRecord({
      userId,
      page: 1,
      pageSize: 2
    });
    data && this.setData({integralRecord: data.data || []});
  },

  async getUserIntegral() {
    const {userId, openId} = this.store.data.userInfo;
    const data = await userApi.getUserDetail({
      userId,
      openId
    });
    this.store.data.userInfo.integral = data.integral;
    wx.setStorageSync('userInfo', this.store.data.userInfo)
  },


  toGoodsCollection() {
    wxUtils.backOrNavigate('/pages/goodsCollection/goodsCollection')
  },

  toNewsCollection() {
    wxUtils.backOrNavigate('/pages/newsCollection/newsCollection')
  },

  toNewsThumbs() {
    wxUtils.backOrNavigate('/pages/newsThumbs/newsThumbs')
  },

  // 积分
  toGradeRecord() {
    this.data.integralRecord.length && wxUtils.backOrNavigate('/pages/integralRecord/integralRecord')
  },

  // 积分商城
  toIntegralGoods() {
    wxUtils.backOrNavigate('/pages/integralGoods/integralGoods')
  },

  toAddress() {
    wxUtils.backOrNavigate('/pages/addressList/addressList')
  },

  toSettings() {
    wxUtils.backOrNavigate('/pages/settings/settings')
  },

  toFeedBack() {
    wxUtils.backOrNavigate('/pages/feedback/feedback')
  },

  toOrderList(e) {
    const {status} = e.currentTarget.dataset;
    wxUtils.backOrNavigate(`/pages/orderList/orderList?status=${status}`)
  }

});

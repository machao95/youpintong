import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import userApi from '../../api/userApi'

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {
  use: ['userInfo', 'token'],
  data: {
    canIUseGetUserProfile: false
  },

  onShow() {
    this.setData({userInfo: this.store.data.userInfo})
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
        userId: data.user ? data.user.id : null
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
        userInfoInDb && (user.userId = userInfoInDb.id)
      }
      this.store.data.userInfo = user;
      wx.setStorageSync('userInfo', user);
    }
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

  toGradeRecord() {
    wxUtils.backOrNavigate('/pages/gradeRecord/gradeRecord')
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

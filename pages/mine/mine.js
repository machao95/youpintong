import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import userApi from '../../api/userApi'

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {
  use: ['userInfo', 'token'],
  data: {
    userInfo: {},
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
    // 保存用户信息
    this.store.data.userInfo = {...userInfo, ...this.store.data.userInfo};
    wx.setStorageSync('userInfo', this.store.data.userInfo);
    // 登录
    const {code} = await wxUtils.wxFuncSync('login');
    if (!code) return Tips.error('微信登录失败');
    const data = await userApi.login({code: code});
    if (data) {
      // 保存token
      this.store.data.token = data.userToken;
      wx.setStorageSync('token', data.userToken);
      // 保存用户信息到数据库
      // userApi.saveUserInfo(userInfo)
    }
  },

  async handleLogin(e) {
    const res = await wxUtils.wxFuncSync('getUserProfile');
    console.log(res);
    return;
    const {encryptedData, iv, signature, userInfo} = e.detail;
    if (userInfo) {
      // 保存用户信息
      this.store.data.userInfo = {...userInfo, ...this.store.data.userInfo};
      wx.setStorageSync('userInfo', this.store.data.userInfo);
      // 获取code
      const {code} = await wxUtils.wxFuncSync('login');
      if (code) {
        // 登录
        const data = await userApi.login({code: code});
        if (data) {
          // 保存token
          this.store.data.token = data.userToken;
          wx.setStorageSync('token', data.userToken);
          //
          // this.store.data.userInfo.openId = res.openid;
          // this.store.data.userInfo.mobile = res.mobile;
          // wx.setStorageSync('userInfo', this.store.data.userInfo);
          // 获取用户信息
          const raw = await wxUtils.wxFuncSync('getUserInfo');
          console.log(raw, 'raw')
          const userInfo = await userApi.getUserInfo({
            openId: 'odVCA5X80oxVG-K27NyPw-pRM3Y4',
            encryptedData: raw.encryptedData,
            iv: raw.iv
          });
          console.log(userInfo)
        }
      } else {
        Tips.error('微信登录失败')
      }
    } else {
      Tips.error('拒绝授权')
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

});

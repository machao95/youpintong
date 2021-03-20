import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import userApi from '../../api/userApi'
const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {
    use: ['userInfo', 'token'],
    data: {
        userInfo: {}
    },

    onShow() {
        this.setData({userInfo: this.store.data.userInfo})
    },

    onLoad(options) {

    },

    async handleLogin(e) {
        const {encryptedData, iv, signature, userInfo} = e.detail;
        if (userInfo) {
            // 保存用户信息
            this.store.data.userInfo = {...userInfo, ...this.store.data.userInfo};
            wx.setStorageSync('userInfo', this.store.data.userInfo);
            // 获取code
            const {code} = await wxUtils.wxFuncSync('login');
            if (code) {
                // 去往登录
                const res = await userApi.login({jscode: code});
                if (res) {
                    const notBindPhoneNum = res.errcode === "-1002" || res.errcode === "-1003";
                    // 保存token、openId、是否已绑定手机号
                    this.store.data.token = res.session_key;
                    wx.setStorageSync('token', res.session_key);
                    this.store.data.userInfo.openId = res.openid;
                    this.store.data.userInfo.bindStatus = !notBindPhoneNum;
                    this.store.data.userInfo.mobile = res.mobile;
                    wx.setStorageSync('userInfo', this.store.data.userInfo);
                    // 未绑定手机号，前往绑定
                    if (notBindPhoneNum) {
                        wxUtils.backOrNavigate('/pages/validate/validate')
                    } else {
                        wxUtils.backOrNavigate('/pages/index/index')
                    }
                }
            } else {
                Tips.error('微信登录失败')
            }
        } else {
            Tips.error('拒绝授权')
        }
    },

    async handleNavigate(e) {
        const {name} = e.currentTarget.dataset;
        const pages = {
            apply: '/pages/apply-list/apply-list',
            appeal: '/pages/appeal-list/appeal-list',
            validate: '/pages/validate/validate',
            vote: '/pages/vote-result/vote-result'
        };
        wxUtils.backOrNavigate(pages[name])
    },

    async handleLogout(e) {
        const {success} = await userApi.logout({});
        if (success) {
            wx.setStorageSync('token', undefined);
            this.store.data.token = ''
        }
    }
});
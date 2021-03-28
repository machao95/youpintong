import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import commonApi from '../../api/commonApi';
import oilsApi from '../../api/olisApi';

var amapFile = require('../../libs/amap-wx.js');
const regeneratorRuntime = require('../../libs/runtime.js');
const DAYS = ['日', '一', '二', '三', '四', '五', '六'];
create.Page(store, {
  use: ['userInfo'],
  data: {
    today: {},
    city: {},
    region: [],
    noticeList: [],
    oilInfoList: [],
    scrollAnimate: true,
    activeNoticeIndex: 0, // 当前显示的通知索引
    activeNotice: undefined // 当前显示的通知id
  },

  timeout: undefined,

  onShow() {
    const date = new Date();
    const today = {};
    today.date = date.getDate();
    today.day = '星期' + DAYS[date.getDay()];
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    today.yearMonth = month + '/' + (date.getFullYear());
    const city = this.store.data.city;
    this.setData({
      today,
      userInfo: this.store.data.userInfo,
      city
    });
    this.getCityWeather(city.name);
    this.getBannerInfoList();
    this.getOilInfoList();
  },

  onHide() {
    clearTimeout(this.timeout)
  },

  async getCityWeather(city) {
    // return;
    wx.request({
      url: `https://v0.yiketianqi.com/api?city=${city.replace('市', '')}&version=v61&appid=22578458&appsecret=23W79rC9`,
      method: 'GET',
      success: res => {
        console.log(res)
        this.setData({
          ['city.weather']: res.data.wea,
          ['city.temperature']: res.data.tem2 + '~' + res.data.tem1 + ' ℃'
        })
      }
    });
    // const r = await noticeApi.weather(city.replace('市', ''));
    // console.log(r);
  },

  async getBannerInfoList() {
    const data = await commonApi.getBannerInfoList();
    if (data) this.setData({noticeList: data})
  },

  async getOilInfoList() {
    let data = await oilsApi.getOilInfoList({
      userId: this.store.data.userInfo.userId
    });
    data.forEach(item => {
      item.oilUp = Number(item.oilUp)
    });
    if (data) this.setData({oilInfoList: data})
  },


  handleRegionChange(e) {
    console.log(e);
    const city = {name: e.detail.value[1], code: e.detail.code[0], weather: '', temperature: ''};
    this.setData({
      region: e.detail.value,
      city
    });
    this.store.data.city = city;
    wx.setStorageSync('city', city);
    this.getCityWeather(city.name);
    this.getOilInfoList();
  },

  startNoticeScroll() {
    const self = this;
    const {activeNoticeIndex, noticeList} = this.data;
    // 取得下一个应该显示的消息的index和id
    const nextIndex = (activeNoticeIndex + 1) >= noticeList.length ? 0 : (activeNoticeIndex + 1);
    const nextNotice = 'notice-' + noticeList[nextIndex].id;
    // 设值使页面滚动
    this.setData({
      activeNotice: nextNotice,
      activeNoticeIndex: nextIndex,
      scrollAnimate: true,
    });
    // 滚动到最后一项时
    if (nextIndex === noticeList.length - 1) {
      // 暂时设置无滚动动画
      self.setData({scrollAnimate: false,});
      // 无动画滚动到第一项（最后一项与第一项相同，无动画下看不到变化，之后便可继续向下滚动）
      setTimeout(function () {
        self.setData({
          activeNotice: 'notice-' + noticeList[0].id,
          activeNoticeIndex: 0,
          scrollAnimate: true
        });
      }, 500)
    }
    // 下一轮
    this.timeout = setTimeout(function () {
      self.startNoticeScroll()
    }, 2000)
  },

  toNoticeDetail(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index, e)
    this.store.data.noticeDetail = this.data.noticeList[index].fcontent;
    wxUtils.backOrNavigate(`/pages/notice-detail/notice-detail`)
  },

  handleMenuClick(e) {
    const pages = [
      "/pages/validate/validate",
      "/pages/apply/apply",
      // "/pages/appeal/appeal",
      "/pages/appeal-middle/appeal-middle",
      "/pages/vote/vote"
    ];
    const {index} = e.currentTarget.dataset;
    // 验证是否已登录
    if (this.store.data.token) {
      // 验证是否已经验证过了
      // if (index === 0 && this.store.data.userInfo.bindStatus) Tips.info({content: '您的手机号已通过验证'});
      if (index !== 0 && !this.store.data.userInfo.bindStatus) {
        Tips.confirm({
          title: '温馨提示',
          confirmText: '去绑定',
          content: '请先绑定手机号再进行此操作'
        }).then(() => {
          wxUtils.backOrNavigate("/pages/validate/validate")
        }).catch(() => {
        });
      } else {
        wxUtils.backOrNavigate(pages[index])
      }
    } else {
      Tips.confirm({
        title: '温馨提示',
        confirmText: '去登陆',
        content: '请先到个人中心进行登录'
      }).then(() => {
        wxUtils.backOrNavigate("/pages/mine/mine")
      }).catch(() => {
      })
    }
  }
});

const a = [{
  linkname: 'a',
  linktel: '15899996666',
  linkmobile: '15899996666',
  linkidcardno: '453434',
  identitystate: '已确认',
  ismain: '是'
}];
export default {
  data: {
    userInfo: wx.getStorageSync('userInfo') || {}, // 退出后也不清除
    token: wx.getStorageSync('token') || '', // token
    city: wx.getStorageSync('city') || {code: '', name: '北京', weather: '', temperature: ''},
    oilData: {},
    cart: wx.getStorageSync('cart') || [],
    confirmOrderGoods: [],
    confirmAddress: null
  },
  // 无脑全部更新，组件或页面不需要声明 use
  // updateAll: true,
  debug: true
}

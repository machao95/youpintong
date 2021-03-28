import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import goodsApi from '../../api/goodsApi'

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

  use: ['userInfo', 'token', 'cart'],

  data: {
    userInfo: {},
    checkedObj: {3: false, 9: false},
    checkedAll: false,
    manageMode: false,
    totalPrice: 0
  },

  onShow() {
    this.initCheckAll(this.store.data.cart);
    this.calcTotalPrice(this.store.data.cart);
  },

  initCheckAll(cart) {
    this.setData({
      checkedAll: cart.every(item => item.checked)
    });
  },

  triggerManage() {
    this.setData({manageMode: !this.data.manageMode})
  },

  handleCheck(e) {
    Tips.loading();
    const {index} = e.currentTarget.dataset;
    const cart = this.store.data.cart.concat([]);
    cart[index].checked = !cart[index].checked;
    this.store.data.cart = cart;
    wx.setStorageSync('cart', cart);
    this.initCheckAll(cart);
    this.calcTotalPrice(cart);
    Tips.loaded();
  },

  handleCheckAll() {
    Tips.loading();
    const next = !this.data.checkedAll;
    const cart = this.store.data.cart.concat([]);
    cart.forEach(item => item.checked = next);
    this.store.data.cart = cart;
    wx.setStorageSync('cart', cart);
    this.setData({ checkedAll: next });
    this.calcTotalPrice(cart);
    Tips.loaded();
  },

  handleRemove() {
    let cart = this.store.data.cart.concat([]);
    const hasChecked = cart.some(item => item.checked);
    if (!hasChecked) return false;
    Tips.confirm({
      content: '确定删除选中的商品吗？'
    }).then(r => {
      Tips.loading();
      cart = cart.filter(item => !item.checked);
      this.store.data.cart = cart;
      wx.setStorageSync('cart', cart);
      this.setData({checkAll: false});
      cart.length === 0 && this.setData({manageMode: false});
      this.initCheckAll(cart);
      this.calcTotalPrice(cart);
      Tips.loaded();
    }).catch(e => {});
  },

  handleChangeNumber(e) {
    Tips.loading();
    const {id, value} = e.detail;
    const cart = this.store.data.cart.concat([]);
    const index = cart.findIndex(item => item.id == id);
    if (index >= 0) {
      cart[index].number = value;
    }
    this.store.data.cart = cart;
    wx.setStorageSync('cart', cart);
    this.calcTotalPrice(cart);
    Tips.loaded();
  },

  calcTotalPrice(cart) {
    const totalPrice = cart.filter(item => item.checked).reduce((sum, item) => {
      return sum + item.goodsPrice * (item.number || 1)
    }, 0);
    this.setData({totalPrice})
  },

  handleSubmit() {
    if (!this.store.data.token) {
      return wxUtils.backOrNavigate('/pages/mine/mine')
    }
    let cart = this.store.data.cart;
    const goods = cart.filter(item => item.checked);
    if (!goods.length) return false;
    this.store.data.confirmOrderGoods = goods;
    wxUtils.backOrNavigate(`/pages/orderConfirm/orderConfirm?goodsType=normal&cart=true`);
  },



});

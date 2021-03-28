import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import userApi from '../../api/userApi';
import orderApi from '../../api/orderApi';
import validate from "../../utils/validate";

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

  use: ['userInfo', 'token', 'confirmOrderGoods', 'confirmAddress'],

  data: {
    goodsType: undefined,
    total: 0,
    remark: '',
    formCart: false
  },

  onLoad(options) {
    this.setData({
      goodsType: options.goodsType || 'normal',
      formCart: !!options.cart
    });
    const list = this.store.data.confirmOrderGoods;
    this.calcTotal(list, options.goodsType);
    this.getDefaultAddress();
  },

  calcTotal(list, goodsType) {
    const field = goodsType === 'integral' ? 'goodsIntegral' : 'goodsPrice';
    const total = list.reduce((sum, item) => {
      return sum + item[field] * (item.number || 1);
    }, 0);
    this.setData({total});
  },

  async getDefaultAddress() {
    if (this.store.data.confirmAddress) return false;
    const list = await userApi.getAddressList({
      userId: this.store.data.userInfo.userId
    });
    this.store.data.confirmAddress = (list || []).find(item => item.isDefault == 1) || {};
  },

  changeAddress() {
    wxUtils.backOrNavigate('/pages/addressList/addressList?type=choose')
  },

  changeRemark(e) {
    this.setData({remark: e.detail.value})
  },

  cancelOrder() {
    Tips.confirm({
      content: '确认取消订单吗？'
    }).then(() => {
      wx.navigateBack();
    }).catch(e => {})
  },

  async handleSubmit() {
    if (!this.store.data.confirmAddress) return Tips.error('请选择地址');
    const data = await orderApi.createOrder({
      userId: this.store.data.userInfo.userId,
      addressId: this.store.data.confirmAddress.id,
      goodsType: this.data.goodsType === 'normal' ? 1 : 2,
      goodsIds: this.store.data.confirmOrderGoods.map(item => {
        return new Array(item.number || 1).fill(item.id).join(',');
      }).join(','),
      remark: this.data.remark
    });
    if (data) {
      Tips.confirm({
        title: data.orderType == 1 ? '微信支付' : '积分兑换',
        content: data.orderType == 1 ? `需支付${data.price}元` : `需扣除${data.price}积分`,
        confirmText: data.orderType == 1 ? '确认支付' : '确认兑换',
        cancelText: data.orderType == 1 ? '取消支付' : '取消兑换',
      }).then(async () => {
        const r = await orderApi.changeOrderStatus({
          orderId: data.orderId,
          integralType: '1', // 支付
          tip: data.orderType == 1 ? '正在支付' : '正在兑换'
        });
        if (r) {
          await Tips.success(data.orderType == 1 ? '支付成功' : '兑换成功');
          wxUtils.backOrRedirect('/pages/orderList/orderList?status=wait_send')
        }
      }).catch( async err => {
        await Tips.error(data.orderType == 1 ? '支付取消' : '兑换取消');
        wxUtils.backOrRedirect('/pages/orderList/orderList?status=wait_pay')
      });
      if (this.data.formCart) {
        const cart = this.store.data.cart.filter(item => !item.checked);
        this.store.data.cart = cart;
        wx.setStorageSync('cart', cart);
      }
    }
  }

});

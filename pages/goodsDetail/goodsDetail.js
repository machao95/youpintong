import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import goodsApi from '../../api/goodsApi'

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

  use: ['userInfo', 'token'],

  data: {
    userInfo: {},
    goodsDetail: {},
    show: false
  },

  onShow() {
    // this.getGoodsList()
  },

  showParamPanel() {
    this.setData({show: true})
  },

  closeParamPanel() {
    this.setData({show: false})
  },

  handleCar() {
    wxUtils.backOrNavigate('/pages/car/car')
  },

  handleBuy() {
    wxUtils.backOrNavigate(`/pages/orderConfirm/orderConfirm?id=${Math.random()}`)
  }


});

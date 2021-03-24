import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import userApi from '../../api/userApi';
import validate from "../../utils/validate";

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

  use: ['userInfo', 'token'],

  data: {
    userInfo: {},
    detail: {}
  },

  onLoad(options) {

  },

  onUnload() {

  },

  changeAddress() {
    wxUtils.backOrNavigate('/pages/addressList/addressList?type=choose')
  },

  cancelOrder() {
    Tips.confirm({
      content: '确认取消订单吗？'
    }).then(() => {
      wx.navigateBack();
    }).catch(e => {})
  }

});

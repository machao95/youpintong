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
    goodsList: []
  },

  onShow() {
    // this.getGoodsList()
  },

  async getGoodsList() {
    const goodsList = goodsApi.getCollection({});
    console.log(goodsList)
    this.setData({goodsList});
  },

  handleDetail(e) {
    console.log(e.detail);
    wxUtils.backOrNavigate()
  }
});

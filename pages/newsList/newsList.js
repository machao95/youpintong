import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import newsApi from '../../api/newsApi'

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

  use: ['userInfo', 'token'],

  data: {
    userInfo: {},
    status: 'price',
    newsList: {
      price: [1,2,3,4],
      car: [2,3,4,5,4],
      history: [2,45,3,3,45,3,5,36,3,56]
    }
  },

  onShow() {
    // this.getAddressList()
  },

  async getNewsList() {
    return;
    const addressList = newsApi.getAddressList({});
    this.setData({addressList});
  },

  async handleDefault(e) {
    const r = await userApi.setDefaultAddress({});
    this.getAddressList();
  },

  handleCollect(e) {
    console.log(e)
  },

  handleComment(e) {
    console.log(e, 'comment');
  },

  handleThumbs() {
    this.triggerEvent('thumbs', this.detail.id)
  }

});

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
    list: []
  },

  onShow() {
    this.getNewsList()
  },

  async getNewsList() {
    const list = await newsApi.getUpList({
      userId: this.store.data.userInfo.userId
    });
    this.setData({list: list || []});
  },

  handleDetail(e) {
    console.log(e)
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

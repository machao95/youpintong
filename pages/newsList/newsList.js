import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import newsApi from '../../api/newsApi';
import userApi from '../../api/userApi';
import {formatDate} from "../../utils/tools";
import {LIKE_KIND, LIKE_TYPE} from "../../utils/constant";

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

  use: ['userInfo', 'token'],

  data: {
    status: 'price',
    newsList: {
      'price': [], // 油价
      'car': [], // 汽车
      history: [2,45,3,3,45,3,5,36,3,56]
    }
  },

  onShow() {

    if (!this.store.data.token) {
      wxUtils.backOrNavigate('/pages/mine/mine')
    } else {
      this.getNewsList();
    }
  },

  changeTab(e) {
    const status = e.detail.name;
    this.setData({status});
    this.getNewsList(status)
  },

  async getNewsList(status) {
    const s = status || this.data.status;
    const articleKind = s === 'price' ? 1 : 2;
    const data = await newsApi.getNewsList({
      articleKind: articleKind,
      page: 1,
      pageSize: 999,
      userId: this.store.data.userInfo.userId
    });
    console.log(data, '90');
    data.data.forEach(item => {
      item.createTime = formatDate(new Date(item.createTime), 'YYYY-MM-DD HH:mm:ss')
    });
    data && this.setData({
      ['newsList.' + s]: data.data
    });
  },

  async handleCollect(e) {
    const method = e.detail.collect ? 'cancelCollectUp' : 'saveCollectUp';
    const r = await userApi[method]({
      userId: this.store.data.userInfo.userId,
      likeId: e.detail.id,
      likeKind: LIKE_KIND.COLLECT,
      likeType: LIKE_TYPE.ARTICLE
    });
    r && this.getNewsList();
  },

  async handleThumbs(e) {
    const method = e.detail.up ? 'cancelCollectUp' : 'saveCollectUp';
    const r = await userApi[method]({
      userId: this.store.data.userInfo.userId,
      likeId: e.detail.id,
      likeKind: LIKE_KIND.UP,
      likeType: LIKE_TYPE.ARTICLE
    });
    r && this.getNewsList();
  },

  handleComment(e) {
    wxUtils.backOrNavigate(`/pages/newsDetail/newsDetail?id=${e.detail.id}&showComment=true`);
  },

});

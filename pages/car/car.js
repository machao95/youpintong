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
    goodsList: [{id: 0}, {id: 3}, {id: 9}, {id: 90}],
    checkedObj: {3: false, 9: false},
    checkedAll: true,
    manageMode: false
  },

  onShow() {
    // this.getGoodsList()
  },

  async getGoodsList() {
    const goodsList = goodsApi.getCollection({});
    console.log(goodsList);
    this.setData({goodsList});
  },

  triggerManage() {
    this.setData({manageMode: !this.data.manageMode})
  },

  getCheckedGoodsId() {
    const result = [];
    for(let id in this.data.checkedObj) {
      if (this.data.checkedObj[id]) {
        result.push(id);
      }
    }
    return result;
  },

  handleRemove() {
    const ids = this.getCheckedGoodsId();
    if (!ids.length) return Tips.info({content: '您美欧选择'});
    console.log(ids);
  },

  handleDetail(e) {
    console.log(e.detail);
    wxUtils.backOrNavigate()
  }
});

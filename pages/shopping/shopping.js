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
    typeConfig: [
      {value: 1, label: '营业区'}, { value: 2, label: '配电室' }, { value: 3, label: '油罐区' },
      {value: 4, label: '办公室'}, { value: 5, label: '活动室' }, { value: 6, label: '厨房用品' },
      {value: 7, label: '卫浴用品'}, { value: 8, label: '其他' }
    ],
    activeTypeIndex: 0,
    goods: {}
  },

  onLoad(options) {
    this.getGoodsList(this.data.typeConfig[0].value);
  },

  onUnload() {

  },

  handleChangeType(e) {
    const index = e.detail;
    this.setData({activeTypeIndex: index});
    this.getGoodsList(this.data.typeConfig[index].value)
  },

  getGoodsList(typeValue) {
    const list = [1,2,3,4,5,6,7,8,11,22,33,44,55,66].map(item => ({url: 'https://img.xiaopiu.com/userImages/img525317678d80e10.jpg'}))
    this.setData({
      ['goods.' + typeValue]: list
    })
  },

  toDetail(e) {
    wxUtils.backOrNavigate(`/pages/goodsDetail/goodsDetail?id=${Math.random()}`)
  },

  toCart() {
    wxUtils.backOrNavigate(`/pages/car/car?id=${Math.random()}`)
  }

});

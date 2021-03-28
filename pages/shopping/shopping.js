import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import goodsApi from '../../api/goodsApi';
import validate from "../../utils/validate";

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

  use: ['userInfo', 'token'],

  data: {
    userInfo: {},
    typeConfig: [],
    activeTypeIndex: 0,
    goods: {}
  },

  onLoad(options) {
    this.getGoodsTypeList();
  },

  onUnload() {

  },

  async getGoodsTypeList() {
    const list = await goodsApi.getGoodsTypeList();
    this.setData({typeConfig: list || []});
    list && list.length && this.getGoodsList(list[0].id);
  },

  handleChangeType(e) {
    const index = e.detail;
    this.setData({activeTypeIndex: index});
    this.getGoodsList(this.data.typeConfig[index].id)
  },

  async getGoodsList(typeValue) {
    const list = await goodsApi.getGoodsList({
      page: 1,
      pageSize: 999,
      goodsTypeId: typeValue
    });
    this.setData({
      ['goods.' + typeValue]: list ? list.data : []
    })
  },

  toDetail(e) {
    wxUtils.backOrNavigate(`/pages/goodsDetail/goodsDetail?id=${e.currentTarget.dataset.id}`)
  },

  toCart() {
    wxUtils.backOrNavigate(`/pages/car/car?id=${Math.random()}`)
  }

});

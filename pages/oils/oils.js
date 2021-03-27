import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import oilsApi from '../../api/olisApi';
import validate from "../../utils/validate";

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

  use: ['userInfo', 'token'],

  data: {
    filterVisible: false,
    animationData: '',
    typeConfig: [
      {label: '汽油', value: '汽油'}, {label: '柴油', value: '柴油'}, {label: '国VI标准', value: '国VI标准'},
    ],
    sortConfig: [
      {label: '按工厂距离排序', value: 1}, {label: '按油品价格排序', value: 2}
    ],
    filters: {
      type: null,
      sort: null
    },
    list: []
  },

  onLoad(options) {
    this.getList()
  },

  onUnload() {

  },

  changeVisible() {
    const c = this.data.filterVisible;
    const height = c ? 0 : 150;
    if (!this.animation) {
      this.animation = wx.createAnimation({duration: 200});
    }
    this.animation.height(height).step();
    this.setData({
      filterVisible: !c,
      animationData: this.animation.export()
    });
  },

  handleFilter(e) {
    const {name, value} = e.currentTarget.dataset;
    this.setData({
      ['filters.' + name]: this.data.filters[name] == value ? null : value
    }, this.getList);
  },

  async getList() {
    const data = await oilsApi.getOilsPage({
      page: 1,
      pageSize: 999,
      oilName: this.data.filters.type,
      order: this.data.filters.sort === 2
    });
    data && this.setData({list: data.data})
  }

});

import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import userApi from '../../api/userApi'

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

  use: ['userInfo', 'token'],

  data: {
    userInfo: {},
    addressList: []
  },

  onShow() {
    // this.getAddressList()
  },

  async getAddressList() {
    const addressList = userApi.getAddressList({});
    this.setData({addressList});
  },

  async handleDefault(e) {
    const r = await userApi.setDefaultAddress({});
    this.getAddressList();
  },

  handleEdit(e) {
    console.log(e);
    const {item} = e.currentTarget.dataset;
    this.store.data.editingAddress = {name: '名称', phone: '3443', address:'dfsdfd'};
    wxUtils.backOrNavigate("/pages/addressEdit/addressEdit?type=edit")
  },

  handleAdd(e) {
    wxUtils.backOrNavigate("/pages/addressEdit/addressEdit?type=add")
  },

  handleRemove(e) {
    const {id} = e.currentTarget.dataset;
    Tips.confirm({
      content: '确定删除该地址吗？'
    }).then(r => {
      console.log(9)
    }).catch(_ => {})
  },

});

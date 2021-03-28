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

  onLoad(options) {
    this.setData({type: options.type})
  },

  onShow() {
    this.getAddressList()
  },

  async getAddressList() {
    const addressList = await userApi.getAddressList({
      userId: this.store.data.userInfo.userId
    });
    this.setData({addressList : addressList || []});
  },

  async handleDefault(e) {
    const r = await userApi.editAddress({
      ...this.data.addressList[e.currentTarget.dataset.index],
      isDefault: '1'
    });
    r && this.getAddressList();
  },

  handleEdit(e) {
    const {item} = e.currentTarget.dataset;
    this.store.data.editingAddress = {
      ...item,
      region: item.addressProvince + item.addressCity + item.addressArea
    };
    wxUtils.backOrNavigate("/pages/addressEdit/addressEdit?type=edit")
  },

  handleAdd(e) {
    wxUtils.backOrNavigate("/pages/addressEdit/addressEdit?type=add")
  },

  handleRemove(e) {
    const {id, index} = e.currentTarget.dataset;
    Tips.confirm({
      content: '确定删除该地址吗？'
    }).then(r => {
      userApi.removeAddress({id}).then(r => {
        r && Tips.success('删除成功');
        r && this.getAddressList();
      })
    }).catch(_ => {})
  },

  handleChoose(e) {
    if (this.data.type === 'choose') {
      this.store.data.confirmAddress = e.currentTarget.dataset.item;
      wxUtils.backOrNavigate('/pages/orderConfirm/orderConfirm');
    }
  }

});

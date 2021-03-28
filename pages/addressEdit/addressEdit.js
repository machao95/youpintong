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
    formValue: {},
    type: undefined,
    fieldsConfig: [
      {name: 'addressUser', type: 'text', label: '收货人'},
      {name: 'mobile', type: 'text', label: '手机号码'},
      {name: 'region', type: 'text', label: '省市区'},
      {name: 'addressDetail', type: 'text', label: '详细地址'}
    ]
  },

  onLoad(options) {
    this.setData({
      formValue: this.store.data.editingAddress || {},
      type: options.type
    });
  },

  onUnload() {
    this.store.data.editingAddress = null
  },

  // 表单change
  handleNameChange(e) {
    const value = e.detail;
    this.setData({
      ['formValue.addressUser']: value
    });
  },

  handlePhoneChange(e) {
    const value = e.detail;
    this.setData({
      ['formValue.mobile']: value
    });
  },

  handleRegionChange(e) {
    const {value} = e.detail;
    this.setData({
      ['formValue.addressProvince']: value[0],
      ['formValue.addressCity']: value[1],
      ['formValue.addressArea']: value[2],
      ['formValue.region']: value.join('/')
    })
  },

  handleAddressChange(e) {
    const value = e.detail;
    this.setData({
      ['formValue.addressDetail']: value
    });
  },

  validateForm() {
    const fields = [];
    const msg = {selector: '请选择', text: '请输入', number: '请输入', digit: '请输入'};
    this.data.fieldsConfig.forEach(item => {
      const field = {value: this.data.formValue[item.name], rules: []};
      field.rules.push({method: 'required', message: `${msg[item.type]}${item.label}`});
      if (field.rules.length) fields.push(field)
    });
    return validate(fields, 'address')
  },

  async handleSubmit() {
    if (!this.validateForm()) return false;
    const method = this.data.type === 'edit' ? 'editAddress' : 'addAddress';
    const r = await userApi[method]({
      isDefault: '2', // 编辑时formValue有isDefault，此项在前保证修改时正确
      ...this.data.formValue,
      userId: this.store.data.userInfo.userId,
    });
    if (r) {
      wxUtils.backOrNavigate('/pages/addressList/addressList')
    }
  }

});

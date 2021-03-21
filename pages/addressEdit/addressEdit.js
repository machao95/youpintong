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
      {name: 'name', type: 'text', label: '收货人'},
      {name: 'phone', type: 'text', label: '手机号码'},
      {name: 'address', type: 'text', label: '详细地址'}
    ]
  },

  onLoad(options) {
    this.setData({
      formValue: this.store.data.editingAddress || {name: 'maf'},
      type: options.type
    });
  },

  onUnload() {
    this.store.data.editingAddress = null
  },

  // 表单change
  handleNameChange(e) {
    console.log(e);
    const value = e.detail;
    this.setData({
      ['formValue.name']: value
    });
  },
  handlePhoneChange(e) {
    const value = e.detail;
    this.setData({
      ['formValue.phone']: value
    });
  },
  handleAddressChange(e) {
    const value = e.detail;
    this.setData({
      ['formValue.address']: value
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

  handleSubmit() {
    if (!this.validateForm()) return false;
  }

});

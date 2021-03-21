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
    form: {
      problem: undefined,
      phone: undefined,
      imgUrls: []
    },
    userInfo: {},
    formValue: {},
    type: undefined,
    fieldsConfig: [
      {name: 'name', type: 'text', label: '收货人'},
      {name: 'phone', type: 'text', label: '手机号码'},
      {name: 'address', type: 'text', label: '详细地址'}
    ]
  },

  maxNums: 4,

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
  handleProblemChange(e) {
    console.log(e);
    const {value} = e.detail;
    this.setData({
      ['form.problem']: value
    });
  },

  handlePhoneChange(e) {
    const {value} = e.detail;
    this.setData({
      ['formValue.phone']: value
    });
  },

  async handleChooseImg() {
    // 选择图片
    let res =await wxUtils.wxFuncSync('chooseImage', {
      count: this.maxNums - this.data.form.imgUrls.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    });
    // 存入form
    this.setData({
      ['form.imgUrls']: this.data.form.imgUrls.concat(res.tempFilePaths)
    });
  },

  handleDelImage(e) {
    const index = e.currentTarget.dataset.index;
    const imgUrls = this.data.form.imgUrls.slice();
    imgUrls.splice(index, 1);
    this.setData({
      ['form.imgUrls']: imgUrls
    });
  },

  handlePreview(e) {
    const index = e.currentTarget.dataset.index;
    const url = this.data.form.imgUrls[index];
    wx.previewImage({
      urls: [url]
    })
  },

  handleSubmit() {
    console.log(this.data.form);
    if (!this.data.form.problem) return Tips.info({content: '请输入您的问题或意见'});
  }

});

import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import commonApi from '../../api/commonApi';
import userApi from '../../api/userApi';

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

  use: ['userInfo', 'token'],

  data: {
    form: {
      problem: undefined,
      phone: undefined,
      imgUrls: []
    }
  },

  maxNums: 4,

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
    const all = res.tempFiles.map(item => {
      return commonApi.uploadImage({filePath: item.path})
    });
    Promise.all(all).then(results => {
      console.log(results);
      // 存入form
      this.setData({
        ['form.imgUrls']: this.data.form.imgUrls.concat(results.filter(url => !!url))
      });
    }).catch(e => {

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

  async handleSubmit() {
    console.log(this.data.form);
    if (!this.data.form.problem) return Tips.info({content: '请输入您的问题或意见'});
    const r = await userApi.feedBack({
      userId: this.store.data.userInfo.userId,
      opinionContent: this.data.form.problem,
      mobile: this.data.form.phone,
      opinionImgs: this.data.form.imgUrls.join(',')
    });
    if (r) {
      Tips.success('提交成功');
    }
  }

});

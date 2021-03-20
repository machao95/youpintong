import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import validate from "../../utils/validate";
import userApi from '../../api/userApi'
const regeneratorRuntime = require('../../libs/runtime.js');

create.Page(store, {
    use: ['userInfo'],
    data: {
        countdown: 0,
        formValue: {
            phone: '',
            validateNum: '',
            name: '',
            idno: ''
        }
    },

    onLoad() {
      if (this.store.data.userInfo.mobile) {
          console.log(this.store.data.userInfo.mobile);
          this.setData({
              ['formValue.phone']: this.store.data.userInfo.mobile
          });
          console.log(this.data)
      }
    },

    // 表单change
    handleFormItemChange(e) {
        const {name, value} = e.detail;
        this.setData({
            ['formValue.' + name]: value
        });
    },

    // 表单验证
    validateForm(isPhone) {
        let fields = [{
            value: this.data.formValue.phone,
            rules: [
                {method: 'required', message: '请先输入手机号码'},
                {method: 'mobilePhone', message: '手机号格式不正确'}
            ]
        }];
        if (!isPhone) {
            fields = fields.concat([
                {
                    value: this.data.formValue.validateNum,
                    rules: [{method: 'required', message: '请输入验证码'}]
                }
            ]);
            if (!this.store.data.userInfo.bindStatus) {
                fields = fields.concat([
                    {
                        value: this.data.formValue.name,
                        rules: [{method: 'required', message: '请输入真实姓名'}]
                    }, {
                        value: this.data.formValue.idno,
                        rules: [
                            {method: 'required', message: '请输入身份证号'},
                            {method: 'idno', message: '身份证号格式错误'}
                        ]
                    }
                ])
            }
        }
        return validate(fields, 'validate')
    },

    // 获取验证码
    async getValidateNum() {
        if (this.data.countdown === 0) {
            // 验证手机号先
            if (this.validateForm(true)) {
                const result = await userApi.getValidateNum({
                    mobile: this.data.formValue.phone
                });
                if (result) this.startCountDown(60);
            }
        }
    },

    // 倒计时开始
    startCountDown(num) {
        this.setData({countdown: num});
        if (num === 0) {
            clearTimeout(this.timeout)
        } else {
            this.timeout = setTimeout(() => {
                this.startCountDown(num-1)
            }, 1000)
        }
    },

    async handleBind(e) {
        if (this.validateForm()) {
            Tips.loading('正在提交');
            const mobileResult = await userApi.bindPhone({
                mobile: this.data.formValue.phone,
                code: this.data.formValue.validateNum
            });
            const nameResult = this.store.data.userInfo.bindStatus ? {success: true} : await userApi.bindName({
                identityno: this.data.formValue.idno,
                username: this.data.formValue.name
            });
            Tips.loaded();
            if (mobileResult.success && nameResult.success) {
                this.store.data.userInfo.mobile = this.data.formValue.phone;
                this.store.data.userInfo.bindStatus = true;
                wx.setStorageSync('userInfo', this.store.data.userInfo);
                wxUtils.backOrNavigate("/pages/index/index")
            } else {
                Tips.info({
                    content: mobileResult.errMsg || nameResult.errMsg || '绑定失败'
                })
            }
        }
    }
});

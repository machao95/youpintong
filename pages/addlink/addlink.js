import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import validate from "../../utils/validate";
import userApi from '../../api/userApi'
const regeneratorRuntime = require('../../libs/runtime.js');

create.Page(store, {
    use: ['linkFields'],
    data: {
        formValue: {}, // 联系人信息
        type: undefined,
        index: undefined
    },

    onLoad(options) {
        const {value, type, index} = options;
        if (value) {
            console.log(options.value);
            this.setData({
                formValue: JSON.parse(options.value)
            })
        }
        this.setData({type, index})
    },

    // 表单change
    handleFormItemChange(e) {
        const {name, value} = e.detail;
        this.setData({
            ['formValue.' + name]: value
        });
    },

    validateForm() {
        const fields = [];
        const msg = {selector: '请选择', text: '请输入', number: '请输入', digit: '请输入'};
        this.store.data.linkFields.forEach(item => {
            const field = {value: this.data.formValue[item.name], rules: []};
            if (item.required) field.rules.push({method: 'required', message: `${msg[item.type]}${item.label}`});
            if (item.methods && this.data.formValue[item.name]) {
                item.methods.forEach(method => {
                    field.rules.push({method, message: `${item.label}格式不正确`})
                })
            }
            if (field.rules.length) fields.push(field)
        });
        return validate(fields, 'addlink')
    },

    handleSubmit() {
        if (this.validateForm()) {
            if (this.data.type === 'add') {
                this.store.data.linkValue = this.store.data.linkValue.concat([this.data.formValue]);
            } else {
                this.store.data.linkValue[this.data.index] = {
                    ...this.store.data.linkValue[this.data.index],
                    ...this.data.formValue
                }
            }
            wxUtils.backOrNavigate('/pages/apply/apply')
        }
    }
});

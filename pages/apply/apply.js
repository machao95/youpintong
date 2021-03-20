import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import validate from "../../utils/validate";
import applyApi from '../../api/applyApi'
import Notify from "../../components/vant/notify/notify";
import appealApi from "../../api/appealApi";
import {imgUrl} from "../../api/config";
const regeneratorRuntime = require('../../libs/runtime.js');

create.Page(store, {
    use: ['companyFields', 'fileFields', 'linkFields', 'linkValue'],
    data: {
        range: {
            suppliertype: ['个人', '企业'],
        },
        imgUrl,
        formValue: {}, // 供应商信息值
        type: 'add',
        // 上传好的文件们
        files: {} // {a: [{filename, id}], b: []}
    },

    onLoad() {
        console.log('申报load');
        this.setData({
            formValue: this.store.data.applyEditDetail || {},
            type: this.store.data.applyEditDetail ? 'edit' : 'add'
        });
        // 修改 整理files
        if (this.store.data.applyEditDetail) {
            const files = {};
            const fileFields = this.store.data.fileFields;
            this.store.data.applyEditDetail._ftzf_yj_supplier_fileList.forEach(file => {
                const item = fileFields.find(item => item.label === file.btype);
                if (item) {
                    if (!files[item.name]) files[item.name] = [];
                    files[item.name].push({...file})
                }
            });
            this.setData({files})
        }
    },

    onUnload() {
        this.store.data.applyEditDetail = undefined;
        this.store.data.linkValue = []
    },

    // 表单change
    handleFormItemChange(e) {
        // console.log(e.detail);
        const {name, value} = e.detail;
        this.setData({
            ['formValue.' + name]: value
        });
    },

    handleAddLink() {
        wxUtils.backOrNavigate(`/pages/addlink/addlink?type=add&random=${Math.random()}`)
    },

    handleEditLink(e) {
        const index = e.currentTarget.dataset.index;
        const value = JSON.stringify(this.store.data.linkValue[index]);
        wxUtils.backOrNavigate(`/pages/addlink/addlink?type=edit&value=${value}&index=${index}`)
    },

    /* --------------------------- 文件相关 -------------------------- */

    async handleAddFile(e) {
        const item = e.currentTarget.dataset.item;
        const res = await wxUtils.wxFuncSync('chooseImage', {});
        if (res.errMsg === "chooseImage:ok") {
            Tips.loading('正在上传');
            const all = [];
            res.tempFilePaths.forEach(filePath => {
                all.push(applyApi.uploadFile(filePath, {filetype: item.label}))
            });
            Promise.all(all).then(result => {
                Tips.loaded();
                const imgs = result.filter(item => item !== undefined);
                this.setData({
                    [`files.${item.name}`]: (this.data.files[item.name] || []).concat(imgs)
                })
            })
        }
    },

    handleDelFile(e) {
        const {name, index} = e.currentTarget.dataset;
        const files = this.data.files[name].slice();
        files.splice(index, 1);
        this.setData({
            [`files.${name}`]: files
        })
    },

    previewImage(e) {
        const {name, index} = e.currentTarget.dataset;
        const urls = this.data.files[name].map(item => `${imgUrl}/${item.filename}`);
        wx.previewImage({
            urls,
            current: urls[index]
        })
    },

    /* --------------------------- 验证提交 -------------------------- */

    // 验证表单
    validateForm() {
        const fields = [];
        const msg = {selector: '请选择', text: '请输入', number: '请输入', digit: '请输入'};
        this.store.data.companyFields.forEach(item => {
           const field = {value: this.data.formValue[item.name], rules: []};
           if (item.required) field.rules.push({method: 'required', message: `${msg[item.type]}${item.label}`});
           if (item.methods && this.data.formValue[item.name]) {
               item.methods.forEach(method => {
                   field.rules.push({method, message: `${item.label}格式不正确`})
               })
           }
           if (field.rules.length) fields.push(field)
        });
/*        const fields = [{
            value: this.data.formValue.suppliertype,
            rules: [{method: 'required', message: '请选择供应商类型'}]
        }, {
            value: this.data.formValue.supplieraddr,
            rules: [{method: 'required', message: '请输入供应商地址'}]
        }, {
            value: this.data.formValue.supplierregion,
            rules: [{method: 'required', message: '请输入供应商区域'}]
        }, {
            value: this.data.formValue.payoffnum,
            rules: [{method: 'required', message: '请输入清除金额'}]
        }];
        if (this.data.formValue.legalpersoncardno) { // 法人身份证
            fields.push({
                value: this.data.formValue.legalpersoncardno,
                rules: [{method: 'idno', message: '法人身份证号格式不正确'}]
            })
        }
        if (this.data.formValue.legalpersontel) { // 法人电话
            fields.push({
                value: this.data.formValue.legalpersontel,
                rules: [{method: 'telPhone', message: '法人电话格式不正确'}]
            })
        }
        if (this.data.formValue.legalpersonmobile) { // 法人手机
            fields.push({
                value: this.data.formValue.legalpersonmobile,
                rules: [{method: 'mobilePhone', message: '法人手机号格式不正确'}]
            })
        }*/
        return validate(fields, 'apply')
    },

    // 验证文件
    validateFiles() {
        let err = false;
        for(let i = 0; i< this.store.data.fileFields.length; i++) {
            const field = this.store.data.fileFields[i]
            if (field.required && (!this.data.files[field.name] || !this.data.files[field.name].length)) {
                err = true;
                Notify({
                    duration: 1000,
                    message: `请上传 ${field.label}`,
                    selector: '#apply',
                    safeAreaInsetTop: false
                });
                break;
            }
        }
        return !err
    },

    // 验证联系人
    validateLinks() {
      const err = this.store.data.linkValue.length <= 0;
      if (err) {
          Notify({
              duration: 1000,
              message: '联系人信息为空',
              selector: '#apply',
              safeAreaInsetTop: false
          });
      }
      return !err
    },

    async handleApply() {
        if (!this.validateForm()) return ;
        if (!this.validateFiles()) return ;
        if (!this.validateLinks()) return ;
        const params = {};
        Object.keys(this.data.formValue).forEach(key => {
            if (this.data.formValue[key]) params[key] = this.data.formValue[key]
        });
        // 文件
        params._ftzf_yj_supplier_fileList = [];
        Object.keys(this.data.files).forEach(name => {
            // const btype = this.
            this.data.files[name].forEach(file => {
                params._ftzf_yj_supplier_fileList.push({...file})
            })
        })
        // 联系人
        params._ftzf_yj_supplier_linkList = this.store.data.linkValue;
        console.log(params);
        const applyStr = JSON.stringify(params)
        const success = await applyApi[`${this.data.type}Apply`]({applyStr});
        if (success) {
            Tips.success('提交成功');
            this.store.data.linkValue = [];
            this.store.data.applyEditDetail = undefined;
            wxUtils.backOrRedirect('/pages/mine/mine')
        }
        /*
        if (this.validateForm()) {
            if (this.store.data.linkValue.length) {
                const params = {};
                Object.keys(this.data.formValue).forEach(key => {
                    if (this.data.formValue[key]) params[key] = this.data.formValue[key]
                });
                params._ftzf_yj_supplier_linkList = this.store.data.linkValue;
                console.log(params);
                const applyStr = JSON.stringify(params)
                const success = await applyApi[`${this.data.type}Apply`]({applyStr});
                if (success) {
                    Tips.success('提交成功');
                    this.store.data.linkValue = [];
                    this.store.data.applyEditDetail = undefined;
                    wxUtils.backOrRedirect('/pages/mine/mine')
                }
            } else {
                Notify({
                    duration: 1000,
                    message: '联系人信息为空',
                    selector: '#apply',
                    safeAreaInsetTop: false
                });
            }
        }
        */
    }
});

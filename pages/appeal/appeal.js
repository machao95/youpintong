import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import validate from "../../utils/validate";
import appealApi from '../../api/appealApi';
import {imgUrl} from "../../api/config";
const regeneratorRuntime = require('../../libs/runtime.js');

create.Page(store, {
    use: ['appealFields'],
    data: {
        imgUrl,
        formValue: {}, // 供应商信息值
        type: 'add',
        oldImages: [], // '/assets/images/me.png'
        newImages: []
    },

    onLoad() {
        const {appealEditDetail} = this.store.data;
        if (appealEditDetail && appealEditDetail.appealpayoffnum) { // 修改
            this.setData({
                formValue: {
                    appealpayoffnum: appealEditDetail.appealpayoffnum,
                    appealreason: appealEditDetail.appealreason
                },
                oldImages: appealEditDetail._ftzf_yj_supplier_fileList.slice(),
                type: 'edit'
            });
        } else {
            this.setData({
                formValue: {},
                type: 'add'
            });
        }
        const self = this;
        setTimeout(() => {
            console.log(self.data.oldImages)
        }, 500)
    },

    onUnload() {
        this.store.data.appealEditDetail = undefined
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
        this.store.data.appealFields.forEach(item => {
            const field = {value: this.data.formValue[item.name], rules: []};
            if (item.required) field.rules.push({method: 'required', message: `${msg[item.type]}${item.label}`});
            if (item.methods && this.data.formValue[item.name]) {
                item.methods.forEach(method => {
                    field.rules.push({method, message: `${item.label}格式不正确`})
                })
            }
            if (field.rules.length) fields.push(field)
        });
        return validate(fields, 'appeal')
    },

    // 选图
    chooseImage(e) {
        wx.chooseImage({
            success: (res) => {
                this.setData({
                    newImages: this.data.newImages.concat(res.tempFilePaths)
                })
            }
        })
    },

    // 删图
    handleDelImage(e) {
        const {index, type} = e.currentTarget.dataset;
        const images = this.data[type].slice();
        images.splice(index, 1);
        this.setData({
            [type]: images
        })
    },

    // 预览
    previewImage(e) {
        const {index, type} = e.currentTarget.dataset;
        wx.previewImage({
            urls: this.data.oldImages.concat(this.data.newImages),
            current: this.data[type][index]
        })
    },

    async handleSubmit() {
        if (this.validateForm()) {
            if (this.data.newImages.length) this.handleUploadImages();
            else this.handleAppeal();
        }
    },

    async handleUploadImages() {
        Tips.loading('正在上传');
        const all = [];
        this.data.newImages.forEach(filePath => {
            all.push(appealApi.uploadImg(filePath))
        });
        Promise.all(all).then(result => {
            Tips.loaded();
            const imgs = result.filter(item => item !== undefined);
            if (imgs.length === result.length) {
                this.handleAppeal(imgs)
            } else {
                Tips.error('图片上传失败')
            }
        })
    },

    async handleAppeal(imgs) {
        const {type} = this.data;
        const params = { ...this.data.formValue, _ftzf_yj_supplier_fileList: (imgs || []) };
        if (type === 'add') {
            params.applycode = this.store.data.appealEditDetail.applycode // this.store.data.appealEditDetail.applycode
        } else {
            params.id = this.store.data.appealEditDetail.id;
            params._ftzf_yj_supplier_fileList = this.data.oldImages.concat(params._ftzf_yj_supplier_fileList)
        }
        const appealStr = JSON.stringify(params);
        const success = await appealApi[`${type}Appeal`]({appealStr: appealStr});
        if (success) {
            Tips.success('提交成功');
            this.store.data.appealEditDetail = undefined;
            wxUtils.backOrRedirect(`/pages/appeal-list/appeal-list`)
        }
    }
});

import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import {imgUrl} from "../../api/config";
const regeneratorRuntime = require('../../libs/runtime.js');

create.Page(store, {
    use: ['appealFields'],
    data: {
        detail: {},
        imgUrl
    },

    onLoad(options) {
        const detail = JSON.parse(options.detail);
        this.setData({detail});
        console.log(detail, 'detial')
    },

    handleEdit() {
        this.store.data.appealEditDetail = {...this.data.detail};
        wxUtils.backOrNavigate('/pages/appeal/appeal')
    },

    // 预览
    previewImage(e) {
        const {index} = e.currentTarget.dataset;
        const urls = this.data.detail._ftzf_yj_supplier_fileList.map(item => `${imgUrl}/${item.filename}`);
        wx.previewImage({
            urls,
            current: urls[index]
        })
    },
});

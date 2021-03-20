import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import validate from "../../utils/validate";
import applyApi from '../../api/applyApi'
import Notify from "../../components/vant/notify/notify";
import {imgUrl} from "../../api/config";
const regeneratorRuntime = require('../../libs/runtime.js');

create.Page(store, {
   use: ['companyFields', 'fileFields', 'linkFields'],
   data: {
       detail: {},
       files: {},
       imgUrl
   },

   onLoad(options) {
       const detail = JSON.parse(options.detail);
       this.setData({detail});
       // 组合files
       const files = {};
       const fileFields = this.store.data.fileFields;
       detail._ftzf_yj_supplier_fileList.forEach(file => {
           const item = fileFields.find(item => item.label === file.btype);
           if (item) {
               if (!files[item.name]) files[item.name] = [];
               files[item.name].push({...file})
           }
       });
       // console.log(files, 'files')
       this.setData({files})
   },

    previewImage(e) {
        const {name, index} = e.currentTarget.dataset;
        const urls = this.data.files[name].map(item => `${imgUrl}/${item.filename}`);
        wx.previewImage({
            urls,
            current: urls[index]
        })
    },

    handleEdit() {
       this.store.data.applyEditDetail = {...this.data.detail};
       this.store.data.linkValue = this.data.detail._ftzf_yj_supplier_linkList.slice();
       wxUtils.backOrNavigate('/pages/apply/apply')
    },

    handleAppeal() {
       this.store.data.appealEditDetail = {
           applycode: this.data.detail.id
       };
        wxUtils.backOrNavigate('/pages/appeal/appeal')
    }
});

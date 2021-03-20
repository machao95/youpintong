import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import applyApi from '../../api/applyApi'
const regeneratorRuntime = require('../../libs/runtime.js');

create.Page(store, {
    data: {
        list: []
    },

    onShow() {
        this.getApplyList()
    },

    async getApplyList() {
        const data = await applyApi.getApplyList();
        if (data) {
            const list = data.filter(item => item.applystate === '已提交了' || item.applystate === '申报通过');
            this.setData({list})
        }
    },

    handleAppeal(e) {
        this.store.data.appealEditDetail = {
            applycode: e.currentTarget.dataset.item.id
        };
        wxUtils.backOrNavigate('/pages/appeal/appeal')
    }
});

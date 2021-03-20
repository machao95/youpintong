import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import appealApi from '../../api/appealApi'
const regeneratorRuntime = require('../../libs/runtime.js');

create.Page(store, {
    data: {
        status: 'submited',
        submited: [],
        verify: [],
        complete: []
    },

    onLoad(options) {
        if (options.status) {
            this.setData({status: options.status});
        }
    },
    onShow() {
        this.getAppealList()
    },

    async getAppealList() {
        const data = await appealApi.getAppealList();
        if (data) {
            // console.log(data, 'ui')
            const submited = [], verify = [], complete = [];
            data.forEach(item => {
                switch (item.appealstate) {
                    case '已提交':
                    case '提交审核':
                        submited.push(item);
                        break;
                    case '审核中':
                        verify.push(item);
                        break;
                    case '申诉通过':
                    case '申诉失败':
                        complete.push(item);
                        break
                }
            });
            this.setData({submited, verify, complete})
        }
    },

    handleDetail(e) {
        const detail = e.currentTarget.dataset.item;
        wxUtils.backOrNavigate(`/pages/appeal-detail/appeal-detail?detail=${JSON.stringify(detail)}`)
    }
});

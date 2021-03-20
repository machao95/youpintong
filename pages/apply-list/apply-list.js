import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import applyApi from '../../api/applyApi'
const regeneratorRuntime = require('../../libs/runtime.js');

create.Page(store, {
    data: {
        status: 'submited',
        submited: [],
        verify: [],
        complete: []
    },

    onLoad(options) {
        if (options.status) this.setData({status: options.status});
    },
    onShow() {
        this.getApplyList()
    },

    async getApplyList() {
        const data = await applyApi.getApplyList();
        if (data) {
            const submited = [], verify = [], complete = [];
            data.forEach(item => {
                switch (item.applystate) {
                    case '已提交':
                    case '提交审核':
                        submited.push(item);
                        break;
                    case '审核中':
                        verify.push(item);
                        break;
                    case '申报通过':
                    case '申报失败':
                        complete.push(item);
                        break
                }
            });
            this.setData({submited, verify, complete})
        }
    },

    handleDetail(e) {
        const detail = e.currentTarget.dataset.item;
        wxUtils.backOrNavigate(`/pages/apply-detail/apply-detail?detail=${JSON.stringify(detail)}`)
    }
});

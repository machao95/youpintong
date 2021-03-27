import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import orderApi from '../../api/orderApi.js'

const regeneratorRuntime = require('../../libs/runtime.js');

create.Page(store, {
    data: {
        status: 'all',
        all: [{id: 0}, {id: 1},{id: 3}, {id: 7},{id: 5}, {id: 4},{id: 6}, {id: 2}],
        wait_pay: [{id: 0}, {id: 1}],
        wait_send: [{id: 3}, {id: 7},{id: 5}],
        wait_receive: [{id: 4},{id: 6}],
        complete: [{id: 5}, {id: 4},{id: 6}, {id: 2}],
    },

    onLoad(options) {
        options.status && this.setData({status: options.status});
    },
    onShow() {
        this.getOrderList(this.data.status)
    },

    async getOrderList(status) {
        return ;
        const data = await orderApi.getOrderList();
        if (data) {

        }
    },

    handleDetail(e) {
        const detail = e.currentTarget.dataset.item;
        wxUtils.backOrNavigate(`/pages/apply-detail/apply-detail?detail=${JSON.stringify(detail)}`)
    }
});

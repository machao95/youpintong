
import request from '../utils/request';
import wxUtils from '../utils/wxUtils';
import Tips from '../utils/tips';
import store from '../store/index';
import {mock, ToOperationResult} from '../utils/util';
import {formatDate} from "../utils/tools";
import {ORDER_STATUS_LABEL} from "../utils/constant";

const regeneratorRuntime = require('../libs/runtime.js');
module.exports = {

    // 创建订单
    async createOrder(params) {
        Tips.loading();
        const data = await request.post('order/info/createOrder', params);
        Tips.loaded();
        return data
    },

    // 切换状态
    async changeOrderStatus(params) {
        Tips.loading(params.tip);
        const data = await request.post('order/info/orderPayment', params);
        Tips.loaded();
        return data
    },

    // 订单列表
    async getOrderList(params) {
        Tips.loading(params.tip);
        const data = await request.get('order/info/page', params);
        Tips.loaded();
        if (data && data.data) {
            data.data.forEach(item => {
                item.statusName = ORDER_STATUS_LABEL[item.integralType];
                item.createTime = formatDate(new Date(item.createTime), 'YYYY-MM-DD HH:mm:ss')
            })
        }
        return data
    }

};

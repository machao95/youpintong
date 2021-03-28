import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import orderApi from '../../api/orderApi.js'
import {ORDER_STATUS} from "../../utils/constant";

const regeneratorRuntime = require('../../libs/runtime.js');

create.Page(store, {
    data: {
        status: 'all',
        all: [],
        wait_pay: [],
        wait_send: [],
        wait_receive: [],
        complete: [],
    },

    onLoad(options) {
        options.status && this.setData({status: options.status});
    },
    onShow() {
        this.getOrderList(this.data.status)
    },

    async getOrderList() {
        const data = await orderApi.getOrderList({
            userId: this.store.data.userInfo.userId,
            page: 1,
            pageSize: 999
        });
        if (data && data.data) {
            this.setData({
                all: data.data,
                wait_pay: data.data.filter(item => item.integralType == ORDER_STATUS.WAIT_PAY),
                wait_send: data.data.filter(item => item.integralType == ORDER_STATUS.WAIT_SEND),
                wait_receive: data.data.filter(item => item.integralType == ORDER_STATUS.WAIT_RECEIVE),
                complete: data.data.filter(item => item.integralType == ORDER_STATUS.COMPLETE)
            });
        }
    },

    async changeState(e) {
        console.log(e)
        const {type, id, goodsType} = e.detail;
        const r = await orderApi.changeOrderStatus({
            orderId: id,
            integralType: type === 'pay' ? '1' : '3', // 支付 or 收货
            tip: type === 'receive' ? '正在提交' : (goodsType == 1 ? '正在支付' : '正在兑换')
        });
        if (r) {
            await Tips.success(type === 'receive' ? '确认成功' : (goodsType == 1 ? '支付成功' : '兑换成功'));
            this.getOrderList();
        }
    }
});

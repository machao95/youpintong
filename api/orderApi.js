
import request from '../utils/request';
import wxUtils from '../utils/wxUtils';
import Tips from '../utils/tips';
import store from '../store/index';
import {mock, ToOperationResult} from '../utils/util';
import {formatDate} from "../utils/tools";

const regeneratorRuntime = require('../libs/runtime.js');
module.exports = {

    // 提交申报
    async getOrderList(data) {
        Tips.loading('正在提交');
        const res = await request.post('apply/applyadd', data);
        // const res = await mock({errcode: '0'});
        Tips.loaded();
        const {success, errMsg} = ToOperationResult(res, {}, ["0"]);
        if (!success) Tips.info({title: '错误', content: errMsg});
        return success
    },

};

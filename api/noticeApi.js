import request from '../utils/request';
import wxUtils from '../utils/wxUtils';
import Tips from '../utils/tips';
import store from '../store/index';
import {mock, ToOperationResult} from '../utils/util';
import {formatDate} from "../utils/tools";

const regeneratorRuntime = require('../libs/runtime.js');
module.exports = {

    // 通知列表
    async noticeList(data) {
        Tips.loading('正在加载');
        const res = await request.get('news/newsgetlist', data);
        Tips.loaded();
        const {success, errMsg} = ToOperationResult(res, {}, ["0"]);
        if (!success) {
            Tips.info({title: '错误', content: errMsg});
            return []
        }
        return res.msg
    }
};

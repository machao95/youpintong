import request from '../utils/request';
import wxUtils from '../utils/wxUtils';
import Tips from '../utils/tips';
import store from '../store/index';
import {mock, ToOperationResult} from '../utils/util';
import {formatDate} from "../utils/tools";

const regeneratorRuntime = require('../libs/runtime.js');
const app = getApp();
module.exports = {
    // 登录
    async login(data) {
        Tips.loading('正在登录');
        const res = await request.get('WX/WXLogin', data);
        Tips.loaded();
        const {success, errMsg} = ToOperationResult(res, {}, ["0", "-1002", "-1003"]);
        if (!success) Tips.info({title: '错误', content: errMsg});
        return success ? res : false
    },

    // 登出
    async logout(data) {
        Tips.loading('正在退出');
        // const res = await request.post('Member/Login', data);
        const res = await mock({errcode: "0"});
        Tips.loaded();
        return ToOperationResult(res);
    },

    // 获取验证码
    async getValidateNum(data) {
        Tips.loading('正在发送验证码');
        const res = await request.get('Verfrication/SendCode', data);
        Tips.loaded();
        const {success, errMsg} = ToOperationResult(res, {});
        !success && Tips.info({title: '错误', content: errMsg});
        return success;
    },

    // 提交绑定手机号，验证手机号
    async bindPhone(data) {
        const res = await request.post('Verfrication/VerfricationCode', data);
        return ToOperationResult(res, {}, ["0", "-1000"]);
    },

    // 绑定姓名身份证号码
    async bindName(data) {
        const res = await request.post('Verfrication/VerfricationIdentity', data);
        return ToOperationResult(res, {});
    },

    // 单选投票
    async voteRadio(data) {
        const res = await request.post('Vote/VoteSetChoice', data);
        return ToOperationResult(res, {})
    },

    // 问答投票
    async voteText(data) {
        const res = await request.post('Vote/VoteSetSubject', data);
        return ToOperationResult(res, {})
    },

};

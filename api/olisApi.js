import request from '../utils/request';
import wxUtils from '../utils/wxUtils';
import Tips from '../utils/tips';
import store from '../store/index';
import {mock, ToOperationResult} from '../utils/util';
import {formatDate} from "../utils/tools";

const regeneratorRuntime = require('../libs/runtime.js');
module.exports = {

    // 首页油价
    async getOilInfoList(params) {
        Tips.loading();
        const data = await request.get('oil/info/list', params);
        Tips.loaded();
        return data
    },

    // 油品列表
    async getOilsPage(params) {
        Tips.loading();
        const data = await request.get('oil/info/page', params);
        Tips.loaded();
        return data
    },

    // 提交申报
    async addApply(data) {
        Tips.loading('正在提交');
        const res = await request.post('apply/applyadd', data);
        // const res = await mock({errcode: '0'});
        Tips.loaded();
        const {success, errMsg} = ToOperationResult(res, {}, ["0"]);
        if (!success) Tips.info({title: '错误', content: errMsg});
        return success
    },

    // 修改申报
    async editApply(data) {
        Tips.loading('正在提交');
        const res = await request.post('apply/applyupdate', data);
        // const res = await mock({errcode: '0'});
        Tips.loaded();
        const {success, errMsg} = ToOperationResult(res, {}, ["0"]);
        if (!success) Tips.info({title: '错误', content: errMsg});
        return success
    },

    // 申报列表
    async getApplyList(data) {
        Tips.loading('正在加载');
        const res = await request.get('apply/applygetlist', data);
        Tips.loaded();
        const {success, errMsg} = ToOperationResult(res, {}, ["0", "-1001"]);
        if (!success) Tips.info({title: '错误', content: errMsg});
        return success && Array.isArray(res.msg) ? (res.msg || []) : false
    },

    // 上传
    async uploadFile(filePath, formData) {
        const res = await request.upload('Apply/UploadApplyFile', {filePath, formData});
        try {
            const jsonRes = JSON.parse(res);
            const {success, errMsg} = ToOperationResult(jsonRes, {}, ["0"]);
            return success ? jsonRes.msg : undefined
        } catch (e) {
            return undefined
        }
    }
};

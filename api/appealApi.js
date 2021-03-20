import request from '../utils/request';
import wxUtils from '../utils/wxUtils';
import Tips from '../utils/tips';
import store from '../store/index';
import {mock, ToOperationResult} from '../utils/util';
import {formatDate} from "../utils/tools";

const regeneratorRuntime = require('../libs/runtime.js');
module.exports = {

    // 提交申诉
    async addAppeal(data) {
        Tips.loading('正在提交');
        const res = await request.post('appeal/appealadd', data);
        // const res = await mock({errcode: '0'});
        Tips.loaded();
        const {success, errMsg} = ToOperationResult(res, {}, ["0"]);
        if (!success) Tips.info({title: '错误', content: errMsg});
        return success
    },

    // 修改申诉
    async editAppeal(data) {
        Tips.loading('正在提交');
        const res = await request.post('appeal/appealupdate', data);
        // const res = await mock({errcode: '0'});
        Tips.loaded();
        const {success, errMsg} = ToOperationResult(res, {}, ["0"]);
        if (!success) Tips.info({title: '错误', content: errMsg});
        return success
    },

    // 申诉列表
    async getAppealList(data) {
        Tips.loading('正在加载');
        const res = await request.get('appeal/appealgetlist', data);
        Tips.loaded();
        const {success, errMsg} = ToOperationResult(res, {}, ["0", "-1001"]);
        if (!success) Tips.info({title: '错误', content: errMsg});
        return success && Array.isArray(res.msg) ? (res.msg || []) : false
    },

    // 上传单个图片
    async uploadImg(filePath) {
        const res = await request.upload('appeal/UploadAppealImg', {filePath});
        try {
            const jsonRes = JSON.parse(res);
            const {success, errMsg} = ToOperationResult(jsonRes, {}, ["0"]);
            return success ? jsonRes.msg : undefined
        } catch (e) {
            return undefined
        }
    }
};

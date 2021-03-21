import request from '../utils/request';
import wxUtils from '../utils/wxUtils';
import Tips from '../utils/tips';
import store from '../store/index';
import {mock, ToOperationResult} from '../utils/util';
import {formatDate} from "../utils/tools";

const regeneratorRuntime = require('../libs/runtime.js');
module.exports = {

  async getCollection(data) {
    Tips.loading('正在加载');
    const res = await request.post('news/c', data);
    Tips.loaded();
    const {success, errMsg} = ToOperationResult(res, {}, ["0"]);
    if (!success) Tips.info({title: '错误', content: errMsg});
    return []
  },

};

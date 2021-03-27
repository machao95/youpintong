

import request from '../utils/request';
import wxUtils from '../utils/wxUtils';
import Tips from '../utils/tips';
const regeneratorRuntime = require('../libs/runtime.js');

module.exports = {

    // 首页轮播图
    async getBannerInfoList(params) {
        Tips.loading('正在加载');
        const data = await request.get('banner/info/list', params);
        Tips.loaded();
        return data
    },

};

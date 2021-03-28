import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import userApi from '../../api/userApi'

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

    use: ['userInfo', 'token'],

    data: {
        userInfo: {},
        list: []
    },

    onShow() {
        this.getList()
    },

    async getList() {
        const data = await userApi.getIntegralRecord({
            userId: this.store.data.userInfo.userId,
            page: 1,
            pageSize: 999
        });
        data && this.setData({list: data.data});
    }
});

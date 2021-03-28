import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import goodsApi from '../../api/goodsApi';
import validate from "../../utils/validate";

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

    use: ['userInfo', 'token'],

    data: {
        userInfo: {},
        goodsList: [],
    },

    onShow() {
        this.getGoodsList();
    },


    async getGoodsList(typeValue) {
        const data = await goodsApi.getIntegralGoodsList({
            page: 1,
            pageSize: 999
        });
        this.setData({
            goodsList: data ? data.data : []
        })
    },

    handleDetail(e) {
        const {item} = e.currentTarget.dataset;
        wxUtils.backOrNavigate(`/pages/goodsDetail/goodsDetail?id=${item.id}&type=integral`)
    },

    handleExchange(e) {
        this.store.data.confirmOrderGoods = [{...e.currentTarget.dataset.item, number: 1}];
        wxUtils.backOrNavigate(`/pages/orderConfirm/orderConfirm?goodsType=integral`);
    }

});

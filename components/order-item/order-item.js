import wxUtils from '../../utils/wxUtils';
Component({
    properties: {
        detail: {type: Object, value: {id: 999} }
    },
    data: {

    },

    methods: {
        handleDetail() {
            wxUtils.backOrNavigate(`/pages/oilsDetail/oilsDetail?id=${Math.random()}`)
        },

        handlePay(e) {
            this.triggerEvent('changeState', {type: 'pay', ...this.data.detail})
        },

        handleReceive(e) {
            this.triggerEvent('changeState', {type: 'receive', ...this.data.detail}) // 3 收货
        }

    }

});

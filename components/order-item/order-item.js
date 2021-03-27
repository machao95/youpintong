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
        }
    }

});

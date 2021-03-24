import wxUtils from '../../utils/wxUtils';
Component({
  properties: {
    showNum: {type: Boolean, value: false},
    showNumStep: {type: Boolean, value: false},
    detail: {type: Object, value: {id: 999} }
  },
  data: {

  },

  methods: {
    handleDetail() {
      if (!this.data.showNum) {
        wxUtils.backOrNavigate(`/pages/goodsDetail/goodsDetail?id=${Math.random()}`)
      }
    }
  }

});

import wxUtils from '../../utils/wxUtils';
import create from '../../libs/create';
import store from '../../store/index';

create.Component(store, {
  properties: {
    showAddress: {type: Boolean, value: true},
    detail: {type: Object, value: {id: 999} }
  },
  data: {

  },

  methods: {
    handleDetail() {
      this.store.data.oilData = {...this.data.detail};
      wxUtils.backOrNavigate(`/pages/oilsDetail/oilsDetail?id=${this.data.detail.id}`)
    }
  }
});

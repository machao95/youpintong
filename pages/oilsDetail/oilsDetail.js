import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import userApi from '../../api/userApi';
import validate from "../../utils/validate";
const wxParse = require('../../wxParse/wxParse');

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

  use: ['oilData'],

  data: {

  },

  onLoad(options) {
    wxParse.wxParse('content', 'html', this.store.data.oilData.oilContent, this, 50);
  },

  onUnload() {

  }

});

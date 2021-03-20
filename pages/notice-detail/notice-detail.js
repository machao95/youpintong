import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {
    use: ['noticeDetail'],
   data: {
       detail: {},
   },
});

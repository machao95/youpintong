import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import userApi from '../../api/userApi'
const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {
    data: {
        formValue: {
            '1': undefined,
            '2': undefined
        },
        questions: [
          {
              questioncode: '1',
              questiontitle: '是否同意云集品供货商债权分配方案？',
              questiontype: '单选',
              options: [
                { itemcode: '1', itemprefix: '', itemtitle: 'A：同意' },
                { itemcode: '2', itemprefix: '', itemtitle: 'B：不同意' },
                { itemcode: '3', itemprefix: '', itemtitle: 'C：弃权' },
              ]
          }, {
                questioncode: '2',
                questiontitle: '大家是否有其他建议？',
                questiontype: '填空',
            }
        ]
    },

    handleFormItemChange(e) {
        console.log(e.detail);
        const {name, value} = e.detail;
        this.setData({
            ['formValue.' + name]: value
        });
    },

    async handleSubmit() {
        console.log(this.data.formValue);
        const {formValue, questions} = this.data;
        const all = [];
        if (formValue["1"]) all.push(userApi.voteRadio({
            questioncode: '1',
            questiontitle: questions[0].questiontitle,
            itemcode: formValue["1"],
            itemtitle: questions[0].options[Number(formValue["1"]) - 1].itemtitle
        }));
        if (formValue["2"]) all.push(userApi.voteText({
            questioncode: '2',
            questiontitle: questions[1].questiontitle,
            result: formValue["2"]
        }));
        if (all.length) {
            Tips.loading('正在提交');
            Promise.all(all).then(result => {
                console.log(result);
                Tips.loaded();
                if (result.every(item => item && item.success)) {
                    Tips.success('投票成功');
                    setTimeout(() => {
                        wxUtils.backOrNavigate('/pages/index/index')
                    }, 500)
                } else {
                    Tips.error(result[0].errMsg || result[1].errMsg || '提交失败')
                }
            })
        }
    }
});

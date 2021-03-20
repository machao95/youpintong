
Component({
    properties: {
        index: {type: Number, value: 0},
        value: {type: String | Number | Array, value: ''},
        question: {type: Object, value: {}},
    },

    data: {
        checkboxChecked: {}
    },

    observers: {
        'value': function (value) {
            if (this.data.question.questiontype === '多选') {
                const checkboxChecked = {};
                console.log(value)
                value.forEach(val => {
                    checkboxChecked[val] = true
                });
                this.setData({checkboxChecked})
            }
        }
    },

    methods: {
        radioTextTap(e) {
            this.triggerEvent('change', {
                name: this.data.question.questioncode,
                value: e.currentTarget.dataset.itemcode
            })
        },
        radioChange(e) {
            this.triggerEvent('change', {
                name: this.data.question.questioncode,
                value: e.detail.value
            })
        },

        checkTextTap(e) {
            const {itemcode} = e.currentTarget.dataset;
            let value = this.data.value.slice();
            const index = value.indexOf(itemcode);
            if (index >= 0) { // 取消选择
                value.splice(index, 1)
            } else { // 选择
                value.push(itemcode)
            }
            this.triggerEvent('change', {
                name: this.data.question.questioncode,
                value
            })
        },
        checkboxChange(e) {
            this.triggerEvent('change', {
                name: this.data.question.questioncode,
                value: e.detail.value
            })
        },

        textChange(e) {
            this.triggerEvent('change', {
                name: this.data.question.questioncode,
                value: e.detail.value
            })
        }
    }
});

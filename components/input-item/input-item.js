import wxUtils from '../../utils/wxUtils'

Component({
    properties: {
        label: {type: String, value: ''},
        type: {type: String, value: 'text'},
        name: {
            type: String,
            value: ''
        },
        value: {
            type: String,
            value: undefined
        },
        range: {type: Array, value: []},
        items: {type: Array, value: []}, // radio
        placeholder: {type: String, value: ''},
        required: {type: Boolean, value: false}
    },
    data: {
        contentStyle: ''
    },

    onLoad() {
        if (this.data.type === textarea) this.setData({contentStyle: 'border: none'})
    },

    methods: {

        handleChange(e) {
            const name = this.data.name;
            let value = e.detail.value;
            if (this.data.type === 'selector') {
                value = this.data.range[value]
            }
            this.triggerEvent('change', {name, value})
        }
    }
});

import create from '../../libs/create'
import store from '../../store/index'
import collectionApi from '../../api/collectionApi'
import orderApi from '../../api/orderApi'
import userApi from '../../api/userApi'
import Tips from "../../utils/tips";
import wxUtils from "../../utils/wxUtils";
import Events from '../../utils/event';

const regeneratorRuntime = require('../../libs/runtime.js');

create.Page(store, {
    data: {
        status: 'storing', // storing, expire, takeout 洞藏中，快到期，已取出
        storingList: {page: {}, data: []},
        expireList: {page: {}, data: []},
        takeoutList: {page: {}, data: []},
        checkAll: {storing: false, expire: false, takeout: false},
        checkState: {storing: {}, expire: {}, total: {storing: 0, expire: 0}}, // 各个藏酒的check状态 {id1: false, id2: true}
        renewPrice: {storing: {}, expire: {}}, // 续期价格 {藏酒id: 120,}
        action: { // 操作栏数据
            storing: {count: 0, year: 1, amount: 0},
            expire: {count: 0, year: 1, amount: 0}
        },
        emptyTip: {
            storing: '您暂时没有洞藏中藏酒',
            expire: '您暂时没有快到期藏酒',
            takeout: '您还没有已取出的藏酒'
        },
        loadMore: false,
        showAction: {
            storing: false, // false, 'renew', 'takeout'
            expire: false
        }
    },
    onLoad(options) {
        console.log(options.status, 'list-options');
        const {status} = options || {};
        status && this.setData({status});
        // 监听active change
        Events.addListener(Events.collection_list_active_change, (status) => {
            this.setData({status})
        }, 'cjlist')
    },

    onShow(e) {
        ['storing', 'expire', 'takeout'].forEach(item => this.getCollectList(item, 1))
    },

    // 触底继续拉取
/*    onReachBottom() {
        const {status} = this.data;
        const dataList = this.data[`${status}List`];
        if (!dataList.page.isLastPage) {
            this.setData({loadMore: true})
            this.getCollectList(status, dataList.page.pageNo + 1)
        }
    },*/

    // tab切换，判断获取数据
    handleTabChange(e) {
        const {name} = e.detail;
        this.setData({
            status: name
        });
        // this.getCollectList(name, 1)
        if (!this.data[`${name}List`].data.length) {
            this.getCollectList(name, 1)
        }
    },

    // 藏酒勾选或取消勾选
    handleCheck(e) {
        const {procode, checked} = e.detail;
        const {status, checkState, renewPrice, action} = this.data;
        console.log(procode, status, action);
        if (checked) {
            // 勾选：添加状态、计算金额、添加总数、计算全选
            checkState[status][procode] = true;
            checkState.total[status] = checkState.total[status] + 1;
            action[status] = {
                ...action[status],
                count: action[status].count + 1,
                amount: action[status].amount + (renewPrice[status][procode] * action[status].year)
            };
            this.setData({checkState, action})
        } else {
            // 取消：添加状态、计算金额、减小总数、取消全选
            checkState[status][procode] = false;
            checkState.total[status] = checkState.total[status] - 1;
            action[status] = {
                ...action[status],
                count: action[status].count - 1,
                amount: action[status].amount - (renewPrice[status][procode] * action[status].year)
            };
            this.setData({checkState, action})
        }
    },

    handleCheckAll(e) {
        const checked = e.detail;
        const {status, checkState, action} = this.data;
        // 每个CheckBox选中
        Object.keys(checkState[status]).forEach(key => {
            checkState[status][key] = checked
        });
        checkState.total[status] = checked ? this.data[`${status}List`].data.length : 0;
        action[status] = {
            year: action[status].year,
            count: checked ? checkState.total[status] : 0,
            amount: checked ? (
                this.data[`${status}List`].data
                    .map(item => Number(item.yearprice))
                    .reduce((sum, price) => (sum + price), 0) * action[status].year
            ) : 0
        };
        this.setData({checkState, action})
    },

    // 洞藏年change
    handleYearChange(e) {
        const {status, action, checkState, renewPrice} = this.data;
        action[status].year = e.detail;
        action[status].amount = Object.keys(checkState[status])
            .filter(key => checkState[status][key])
            .reduce((sum, key) => (sum + renewPrice[status][key]), 0) * e.detail
        this.setData({action});
    },

    async getCollectList(status, pageNo = 1) {
        const stateObj = {expire: '1', storing: '2', takeout: '3'};
        Tips.loading('正在加载');
        const data = await collectionApi.getCollectList({state: stateObj[status]});
        // 保存列表数据
        if (pageNo > 1) {
            this.setData({
                [`${status}List`]: {
                    page: data.page,
                    data: this.data[`${status}List`].data.concat(data.data)
                }
            })
        } else {
            this.setData({
                [`${status}List`]: data
            })
        }
        if (status !== 'takeout') {
            // 保存续费价格数据、勾选状态数据，总的计算数据
            const {renewPrice, checkState, action, showAction} = this.data;
            checkState[status] = {}; // 先置空，因为取出后会导致列表中不再有已取出的数据，而此时原来勾选状态依然存在
            data.data.forEach(item => {
                renewPrice[status][item.procode] = Number(item.yearprice);
                checkState[status][item.procode] = false
            });
            action[status].count = 0;
            action[status].amount = 0;
            showAction[status] = false;
            this.setData({
                renewPrice,
                checkState,
                action,
                showAction
            });
        }
        this.setData({loadMore: false});
        Tips.loaded();
    },

    // 点击续费 勾选
    handleRenewClick(e) {
        const {procode} = e.detail;
        this.setData({
            showAction: {...this.data.showAction, [this.data.status]: 'renew'}
        });
        if (!this.data.checkState[this.data.status][procode]) {
            this.handleCheck({detail: {procode, checked: true}})
        }
    },

    // 点击取出 勾选
    handleTakeoutClick(e) {
        const {procode} = e.detail;
        this.setData({
            showAction: {...this.data.showAction, [this.data.status]: 'takeout'}
        });
        if (!this.data.checkState[this.data.status][procode]) {
            this.handleCheck({detail: {procode, checked: true}})
        }
    },

    // 取消操作
    handleCancel() {
        this.setData({
            showAction: {...this.data.showAction, [this.data.status]: false}
        });
    },

    // 提交创建续费订单
    async submitRenew(e) {
        const {currentTarget: {dataset: {status}}} = e;
        const orderId = await orderApi.createRenewOrder({
            year: this.data.action[status].year,
            codeid: Object.keys(this.data.checkState[status])
                .filter(key => this.data.checkState[status][key])
                .join(',')
        });
        if (orderId) {
            wx.navigateTo({
                url: `/pages/order-renew-confirm/order-renew-confirm?orderId=${orderId}`
            })
        }
    },

    // 提交取出订单
    async submitTakeout(e) {
        const {detail: {procode, data}, currentTarget: {dataset: {status}}} = e;
        let ids = [];
        // 操作栏点击
        if (status) {
            ids = Object.keys(this.data.checkState[status])
                .map(key => this.data.checkState[status][key] ? key : null)
                .filter(key => !!key)
        } else {
            ids = [procode]
        }
        console.log(ids, 'ids');
        if (ids.length) {
            const billInfo = await orderApi.createTakeoutOrder({codeid: ids.join(',')});
            if (billInfo) {
                this.store.data.takeoutConfirm.billInfo = billInfo;
                wxUtils.backOrNavigate('/pages/order-takeout-confirm/order-takeout-confirm')
            }
            // const wines = ids.map(procode => this.data[`${this.data.status}List`].data.find(item => item.procode == procode)).filter(a => !!a);
        }
    },

    handleToTakeDetail(e) {
        const {billnum} = e.detail;
        wxUtils.backOrNavigate(`/pages/order-takeout-detail/order-takeout-detail?orderId=${billnum}`)
    }
});

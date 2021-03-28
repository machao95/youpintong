// 类别:1.文章,2.商品
export const LIKE_TYPE = {
    ARTICLE: 1,
    GOODS: 2
};

// 类型:1.点赞,2.收藏
export const LIKE_KIND = {
    UP: 1,
    COLLECT: 2
};

// 1.待支付 2.已支付 待发货 3.已发货 待收货 4.已签收 完成
export const ORDER_STATUS = {
    WAIT_PAY: 1,
    WAIT_SEND: 2,
    WAIT_RECEIVE: 3,
    COMPLETE: 4
};

export const ORDER_STATUS_LABEL = {
    1: '待付款',
    2: '待发货',
    3: '待收货',
    4: '已完成'
};

// 1.价格商品 2.积分兑换商品
export const GOODS_TYPE = {
    PRICE: 1,
    INTEGRAL: 2
};

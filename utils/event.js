
// 所有正在监听的事件
const _events = [];

export default {

  /**
   * 所有事件名称
   */
  collection_list_active_change: 'collection_list_active_change', // 需要改变洞藏列表页active tab

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param params 给监听回调的参数
   */
  emitEvent: function (eventName, params) {
    for (let i = 0; i < _events.length; i++) {
      if (_events[i].eventName === eventName) {
        _events[i].callback(params)
      }
    }
  },

  /**
   * 删除事件监听
   * @param eventName 事件名称
   * @param observer 监听页
   */
  removeEvent: function (eventName, observer) {
    for(let i = 0; i < _events.length; i++) {
      if (_events[i].eventName === eventName && _events[i].observer === observer) {
        _events.splice(i, 1);
        break;
      }
    }
  },

  /**
   * 添加事件监听
   * @param eventName 事件名
   * @param callback 事件触发后的回调函数
   * @param observer 触发监听的页面,String类型，一个页面一个，注意重复冲突
   */
  addListener: function (eventName, callback, observer) {
    this.removeEvent(eventName, observer); // 添加监听之前清除此observer对此事件的其他监听
    if (eventName && callback && observer) {
      console.log('添加监听')
      _events.push({
        eventName,
        callback,
        observer
      })
    } else {
      console.warn(`[Event: ${eventName}]: 添加事件监听必须包含事件名、回调函数、观察者`)
    }
  }
}

import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import noticeApi from '../../api/noticeApi';
var amapFile = require('../../libs/amap-wx.js');
const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {
    use: ['userInfo'],
    data: {
        userInfo: {},
        noticeList: [{url: '/assets/images/me.png'}, {url: '/assets/images/index.png'}],
        scrollAnimate: true,
        activeNoticeIndex: 0, // 当前显示的通知索引
        activeNotice: undefined // 当前显示的通知id
    },

    timeout: undefined,

    onShow() {
      this.setData({userInfo: this.store.data.userInfo});// this.getNoticeList();
      var myAmapFun = new amapFile.AMapWX({key:'e2aeaa506f26abb07c4e08a5c1c7f328'});
      myAmapFun.getWeather({
        success: function(data){
          //成功回调
          console.log(data)
        },
        fail: function(info){
          //失败回调
          console.log(info)
        }
      })
    },

    onHide() {
        clearTimeout(this.timeout)
    },

    async getNoticeList() {
      const noticeList = await noticeApi.noticeList({});
      // 把第一条通知复制到最后项
      noticeList.length > 1 && noticeList.push({...noticeList[0], id: 'last'});
      // console.log(noticeList, 'noticeList');
      // 设置当前显示的消息索引和id
      this.setData({
          noticeList,
          activeNoticeIndex: 0,
          activeNotice: noticeList[0] ? 'notice-' + noticeList[0].id : undefined
      });
      clearTimeout(this.timeout);
      // 通知数量大于2，2秒后开始滚动
      if (noticeList.length > 2) {
          const _this = this;
          setTimeout(() => {
              _this.startNoticeScroll()
          }, 2000)
      }
    },

    startNoticeScroll() {
      const self = this;
      const {activeNoticeIndex, noticeList} = this.data;
      // 取得下一个应该显示的消息的index和id
      const nextIndex = (activeNoticeIndex + 1) >= noticeList.length ? 0 : (activeNoticeIndex + 1);
      const nextNotice = 'notice-' + noticeList[nextIndex].id;
      // 设值使页面滚动
      this.setData({
          activeNotice: nextNotice,
          activeNoticeIndex: nextIndex,
          scrollAnimate: true,
      });
      // 滚动到最后一项时
      if (nextIndex === noticeList.length - 1) {
          // 暂时设置无滚动动画
          self.setData({scrollAnimate: false,});
          // 无动画滚动到第一项（最后一项与第一项相同，无动画下看不到变化，之后便可继续向下滚动）
          setTimeout(function () {
              self.setData({
                  activeNotice: 'notice-' + noticeList[0].id,
                  activeNoticeIndex: 0,
                  scrollAnimate: true
              });
          }, 500)
      }
      // 下一轮
      this.timeout = setTimeout(function () {
          self.startNoticeScroll()
      }, 2000)
    },

    toNoticeDetail(e) {
        const index = e.currentTarget.dataset.index;
        console.log(index, e)
        this.store.data.noticeDetail = this.data.noticeList[index].fcontent;
        wxUtils.backOrNavigate(`/pages/notice-detail/notice-detail`)
    },

    handleMenuClick(e) {
        const pages = [
            "/pages/validate/validate",
            "/pages/apply/apply",
            // "/pages/appeal/appeal",
            "/pages/appeal-middle/appeal-middle",
            "/pages/vote/vote"
        ];
        const {index} = e.currentTarget.dataset;
        // 验证是否已登录
        if (this.store.data.token) {
            // 验证是否已经验证过了
            // if (index === 0 && this.store.data.userInfo.bindStatus) Tips.info({content: '您的手机号已通过验证'});
            if (index !== 0 && !this.store.data.userInfo.bindStatus) {
                Tips.confirm({
                    title: '温馨提示',
                    confirmText: '去绑定',
                    content: '请先绑定手机号再进行此操作'
                }).then(() => {
                    wxUtils.backOrNavigate("/pages/validate/validate")
                }).catch(() => {});
            } else {
                wxUtils.backOrNavigate(pages[index])
            }
        } else {
            Tips.confirm({
                title: '温馨提示',
                confirmText: '去登陆',
                content: '请先到个人中心进行登录'
            }).then(() => {
                wxUtils.backOrNavigate("/pages/mine/mine")
            }).catch(() => {})
        }
    }
});

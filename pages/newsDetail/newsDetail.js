import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import newsApi from '../../api/newsApi';
import userApi from '../../api/userApi';
import {formatDate} from "../../utils/tools";
import {LIKE_KIND, LIKE_TYPE} from "../../utils/constant";
const wxParse = require('../../wxParse/wxParse');

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

  use: ['userInfo', 'token'],

  data: {
    detail: {},
    commentVisible: false,
    commentList: [],
    commentValue: '',
    animationData: '',
  },

  animation: wx.createAnimation({duration: 100}),

  onLoad(options) {
    const {id, showComment} = options;
    console.log(id, showComment);
    this.getDetail(id, showComment);
    this.getCollectUpInfo(id);
  },

  onUnload() {

  },

  async getDetail(id, showComment) {
    const detail = await newsApi.getNewsDetail({id});
    if (detail) {
      detail.createTime = formatDate(new Date(detail.createTime));
      wxParse.wxParse('content', 'html', detail.articleContent, this, 50);
      this.setData({detail: detail}, () => {
        if (showComment === 'true') {
          this.handleComment()
        } else {
          this.getCommentList()
        }
      });
    }
  },

  handleChange(e) {
    this.setData({
      commentValue: e.detail.value
    })
  },

  async handleSend() {
    if (!this.data.commentValue) return false;
    const r = await newsApi.publishComment({
      commentId: this.data.detail.id,
      userId: this.store.data.userInfo.userId,
      commentContent: this.data.commentValue
    });
    if (r) {
      this.setData({commentValue: ''});
      await this.getCommentList();
    }
  },

  handleComment(e) {
    console.log(e, 'comment');
    const current = this.data.commentVisible;
    this.animation.height(current ? 0 :'80vh').step();
    this.setData({
      // animationData: this.animation.export(),
      commentVisible: !current
    });
    !current && this.getCommentList();
  },

  closeComment() {
    this.setData({commentVisible: false});
  },

  async getCommentList() {
    const commentList = await newsApi.getCommentList({commentId: this.data.detail.id});
    this.setData({commentList});
  },

  async getCollectUpInfo(id) {
    const collect = await userApi.exitCollectUp({
      userId: this.store.data.userInfo.userId,
      likeId: id,
      likeKind: LIKE_KIND.COLLECT,
      likeType: LIKE_TYPE.ARTICLE
    });
    const up = await userApi.exitCollectUp({
      userId: this.store.data.userInfo.userId,
      likeId: id,
      likeKind: LIKE_KIND.UP,
      likeType: LIKE_TYPE.ARTICLE
    });
    this.setData({
      ['detail.collect']: collect || false,
      ['detail.up']: up || false
    })
  },

  async handleCollect(e) {
    const method = this.data.detail.collect ? 'cancelCollectUp' : 'saveCollectUp';
    const r = await userApi[method]({
      userId: this.store.data.userInfo.userId,
      likeId: this.data.detail.id,
      likeKind: LIKE_KIND.COLLECT,
      likeType: LIKE_TYPE.ARTICLE
    });
    r && this.setData({
      ['detail.collect']: !this.data.detail.collect,
    });
  },

  async handleThumbs() {
    const method = this.data.detail.up ? 'cancelCollectUp' : 'saveCollectUp';
    const r = await userApi[method]({
      userId: this.store.data.userInfo.userId,
      likeId: this.data.detail.id,
      likeKind: LIKE_KIND.UP,
      likeType: LIKE_TYPE.ARTICLE
    });
    r && this.setData({
      ['detail.up']: !this.data.detail.up,
    });
  }


});

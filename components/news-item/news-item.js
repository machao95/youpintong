import wxUtils from '../../utils/wxUtils';
Component({
  properties: {
    type: {type: String, value: 'normal'}, // normal or first
    detail: {type: Object, value: {id: 999} }
  },
  data: {

  },

  methods: {
    handleDetail() {
      // const {id} = this.data.detail;
      wxUtils.backOrNavigate(`/pages/newsDetail/newsDetail?id=${56}`);
      // this.triggerEvent('detail', this.data.detail)
    },

    handleCollect() {
      this.triggerEvent('collect', {newsId: this.data.detail.id})
    },

    handleComment() {
      this.triggerEvent('comment', {newsId: this.data.detail.id})
    },

    handleThumbs() {
      this.triggerEvent('thumbs', {newsId: this.data.detail.id})
    }
  }

});

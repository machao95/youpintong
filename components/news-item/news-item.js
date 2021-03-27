import wxUtils from '../../utils/wxUtils';
Component({
  properties: {
    type: {type: String, value: 'normal'}, // normal or first
    detail: {type: Object, value: {} }
  },
  data: {

  },

  methods: {
    handleDetail() {
      // const {id} = this.data.detail;
      wxUtils.backOrNavigate(`/pages/newsDetail/newsDetail?id=${this.data.detail.id}`);
      // this.triggerEvent('detail', this.data.detail)
    },

    handleCollect() {
      this.triggerEvent('collect', this.data.detail)
    },

    handleComment() {
      this.triggerEvent('comment', this.data.detail)
    },

    handleThumbs() {
      this.triggerEvent('thumbs', this.data.detail)
    }
  }

});

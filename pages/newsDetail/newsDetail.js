import create from '../../libs/create'
import store from '../../store/index'
import wxUtils from '../../utils/wxUtils';
import Tips from '../../utils/tips';
import userApi from '../../api/userApi';
const wxParse = require('../../wxParse/wxParse');

const regeneratorRuntime = require('../../libs/runtime.js');
create.Page(store, {

  use: ['userInfo', 'token'],

  data: {
    detail: {
      body: '<p>我炸了</p>'
    },
    commentVisible: false,
    commentValue: '',
    animationData: '',
  },

  animation: wx.createAnimation({duration: 100}),

  onLoad(options) {
    const data = {
      content: (
        '<blockquote>争做国内使用体验Z好的开源 Web 富文本编辑器！</blockquote>\n' +
        '                        <h1>为何选择 wangEditor</h1>\n' +
        '                        <ul>\n' +
        '                            <li>万星项目 <a href="https://github.com/wangeditor-team/wangEditor/releases">Github Star 1w+</a></li>\n' +
        '                            <li>简洁、轻量级、<a href="//doc.wangeditor.com/">文档</a>齐全</li>\n' +
        '                            <li>QQ 群及时答疑</li>\n' +
        '                            <li><a href="//doc.wangeditor.com/#开发人员">开源团队</a>维护，非个人单兵作战</li>\n' +
        '                        </ul>\n' +
        '                        <h1>初见</h1>\n' +
        '                        <p>npm 安装 <code>npm i wangeditor --save</code> ，几行代码即可创建一个编辑器。</p>\n' +
        '                        <pre type="JavaScript"><code>import E from \'wangeditor\'\n' +
        'const editor = new E(\'#div1\')\n' +
        'editor.create()</code></pre>\n' +
        '                        <p>更多使用配置，请阅读<a href="//doc.wangeditor.com/">使用文档</a>。</p>\n' +
        '                        <h1>demo</h1>\n' +
        '                        <p>在线体验 demo 可到 <a href="https://codepen.io/collection/DNmPQV">codepen.io/collection/DNmPQV</a> 。</p>\n' +
        '                        <p>注意，如果打不开，可以去查看 <a href="https://github.com/wangeditor-team/wangEditor/tree/master/examples">github examples</a> 的源码。</p>\n' +
        '                        <h1>浏览器兼容性</h1>\n' +
        '                        <ul>\n' +
        '                            <li>兼容主流 PC 浏览器，IE11+</li>\n' +
        '                            <li>不支持移动端和 ipad</li>\n' +
        '                        </ul>\n' +
        '                        <h1>遇到问题</h1>\n' +
        '                        <ul>\n' +
        '                            <li>加入 QQ 群：164999061(人已满)，710646022(人已满)，901247714</li>\n' +
        '                            <li>\n' +
        '                                <a href="https://github.com/wangeditor-team/wangEditor/issues" target="_blank">\n' +
        '                                    提交问题和建议\n' +
        '                                </a>\n' +
        '                            </li>\n' +
        '                        </ul>\n' +
        '                        <h1>贡献代码</h1>\n' +
        '                        <p>欢迎非团队成员贡献代码，提交 Pull Request，请一定参考<a href="https://github.com/wangeditor-team/wangEditor/blob/master/docs/contribution.md" target="_blank">贡献代码流程</a>。</p>\n' +
        '                        <h1>谁在维护</h1>\n' +
        '                        <p>wangEditor 现有一个开源团队在维护，团队可以保证答疑、bug 修复和迭代效率。</p>\n' +
        '                        <p><a href="//doc.wangeditor.com/#开发人员">查看开发团队，或想加入开发团队</a></p>\n' +
        '                        <h1>为我们点赞</h1>\n' +
        '                        <p>如果你感觉有收获，欢迎给我打赏，以激励我们更多输出优质开源内容。</p>\n' +
        '                        '
      )
    };
    wxParse.wxParse('content', 'html', data.content, this, 50);
  },

  onUnload() {

  },

  handleChange(e) {
    this.setData({
      commentValue: e.detail.value
    })
  },

  handleSend() {
    if (!this.data.commentValue) return false;
    console.log(999);
    this.setData({commentValue: ''});
  },

  handleCollect(e) {
    console.log(e)
  },

  handleComment(e) {
    console.log(e, 'comment');
    const current = this.data.commentVisible;
    this.animation.height(current ? 0 :'80vh').step();
    this.setData({
      animationData: this.animation.export(),
      commentVisible: !current
    })
  },

  handleThumbs() {
    this.triggerEvent('thumbs', this.detail.id)
  }


});

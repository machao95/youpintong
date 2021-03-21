const a = [{
  linkname: 'a',
  linktel: '15899996666',
  linkmobile: '15899996666',
  linkidcardno: '453434',
  identitystate: '已确认',
  ismain: '是'
}];
export default {
  data: {
    userInfo: wx.getStorageSync('userInfo') || {}, // 退出后也不清除
    token: wx.getStorageSync('token') || 'xxx', // token
    city: wx.getStorageSync('city') || {code: '', name: '北京', weather: '', temperature: ''},
    editingAddress: null,
    // 申报 企业信息
    companyFields: [
      {type: 'selector', name: 'suppliertype', label: '供货商类型', range: ['个人', '企业'], required: true},
      {type: 'text', name: 'entname', label: '企业名称', required: true},
      {type: 'number', name: 'entno', label: '企业注册号'},
      {type: 'text', name: 'legalpersonname', label: '法人名称', required: true},
      {type: 'idcard', name: 'legalpersoncardno', label: '法人身份证号码', methods: ['idno']},
      {type: 'number', name: 'legalpersontel', label: '法人电话', methods: ['telPhone']},
      {type: 'number', name: 'legalpersonmobile', label: '法人手机', required: true, methods: ['mobilePhone']},
      {type: 'text', name: 'supplieraddr', label: '供货商地址'},
      {type: 'text', name: 'supplierregion', label: '供货商区域'},
      {type: 'digit', name: 'payoffnum', label: '清偿金额 (元)', required: true},
    ],
    // 申报 文件信息
    fileFields: [
      {name: 'a', label: '债权申报书', required: 'true'},
      {name: 'b', label: '营业执照复印件', required: 'true'},
      {name: 'c', label: '组织机构代码证复印件', required: 'true'},
      {name: 'd', label: '法定代表人身份证明', required: 'true'},
      {name: 'e', label: '法定代表人身份证复印件', required: 'true'},
      {name: 'f', label: '授权委托书', required: 'true'},
      {name: 'g', label: '受托人身份证复印件', required: 'true'},
      {name: 'h', label: '送达地址确认书', required: 'true'},
      {name: 'i', label: '与云集品公司签订的供货合同', required: 'true'},
      {name: 'j', label: '供货（发货）凭证', required: 'true'},
      {name: 'k', label: '与云集品公司的对账资料', required: 'true'},
      {name: 'l', label: '发票', required: 'true'},
      {name: 'm', label: '交付发票凭证', required: 'true'},

      {name: 'n', label: '利息计算表', required: false},
      {name: 'o', label: '生效法律文书', required: false},
      {name: 'p', label: '债权如有偿还或其他抵债情形', required: false},
      {name: 'q', label: '其他能够证明债权成立的证据材料', required: false},
    ],
    // 申报 联系人信息
    linkFields: [
      {type: 'text', name: 'linkname', label: '联系人姓名', errMsg: '请输入联系人姓名', required: true},
      {type: 'number', name: 'linktel', label: '联系人电话', errMsg: '请输入联系人电话', methods: ['telPhone']},
      {type: 'number', name: 'linkmobile', label: '联系人手机', errMsg: '请输入联系人手机', required: true, methods: ['mobilePhone']},
      {type: 'idcard', name: 'linkidcardno', label: '联系人身份证号码', errMsg: '请输入身份证号码', methods: ['idno']},
      {type: 'radio', name: 'identitystate', label: '身份是否确认', items: ['已确认', '未确认'], errMsg: '请选择身份是否确认'},
      {type: 'radio', name: 'ismain', label: '是否为主联系人', items: ['是', '否'], errMsg: '请选择是否为主联系人'}
    ],
    // 申诉 信息
    appealFields: [
      {type: 'digit', name: 'appealpayoffnum', label: '申诉金额 (元)', required: true},
      {type: 'text', name: 'appealreason', label: '申诉原因', required: true}
    ],
    linkValue: [], // 申报时添加的联系人信息
    applyEditDetail: undefined, // 修改申报信息时填充
    appealEditDetail: undefined, // 新增修改申诉信息时填充
    noticeDetail: null
  },
  // 无脑全部更新，组件或页面不需要声明 use
  // updateAll: true,
  debug: true
}

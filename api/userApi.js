import request from '../utils/request';
import wxUtils from '../utils/wxUtils';
import Tips from '../utils/tips';
import store from '../store/index';
import {mock, ToOperationResult} from '../utils/util';
import {formatDate} from "../utils/tools";

const regeneratorRuntime = require('../libs/runtime.js');
const app = getApp();
module.exports = {

  //
  async getAddressList() {
    return []
  },

  //
  async setDefaultAddress(data) {
    return false;
  },

  // 登录
  async login(data) {
    Tips.loading('正在登录');
    const res = await request.get('auth/session', data);
    Tips.loaded();
    // const {success, errMsg} = ToOperationResult(res, {}, ["0", "-1002", "-1003"]);
    console.log(res, '0');
    // if (!success) Tips.info({title: '错误', content: errMsg});
    return res.data
  },

  async getUserInfo(params) {
    Tips.loading('获取用户信息');
    const res = await request.get('auth/decode_userinfo', params);
    Tips.loaded();
    // const {success, errMsg} = ToOperationResult(res, {}, ["0", "-1002", "-1003"]);
    console.log(res, '1');
    // if (!success) Tips.info({title: '错误', content: errMsg});
    return res.data
  },

  // 登出
  async logout(data) {
    Tips.loading('正在退出');
    // const res = await request.post('Member/Login', data);
    const res = await mock({errcode: "0"});
    Tips.loaded();
    return ToOperationResult(res);
  },

  // 获取验证码
  async getValidateNum(data) {
    Tips.loading('正在发送验证码');
    const res = await request.get('Verfrication/SendCode', data);
    Tips.loaded();
    const {success, errMsg} = ToOperationResult(res, {});
    !success && Tips.info({title: '错误', content: errMsg});
    return success;
  },

  // 提交绑定手机号，验证手机号
  async bindPhone(data) {
    const res = await request.post('Verfrication/VerfricationCode', data);
    return ToOperationResult(res, {}, ["0", "-1000"]);
  },

  // 绑定姓名身份证号码
  async bindName(data) {
    const res = await request.post('Verfrication/VerfricationIdentity', data);
    return ToOperationResult(res, {});
  },

  // 单选投票
  async voteRadio(data) {
    const res = await request.post('Vote/VoteSetChoice', data);
    return ToOperationResult(res, {})
  },

  // 问答投票
  async voteText(data) {
    const res = await request.post('Vote/VoteSetSubject', data);
    return ToOperationResult(res, {})
  },

};

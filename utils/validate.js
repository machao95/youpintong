import Notify from '../components/vant/notify/notify'
const methods = {
  required(value) {
    if (typeof value === 'number') {
      value = value.toString()
    } else if (typeof value === 'boolean') {
      return !0
    }
    return !!value
  },
  mobilePhone(value) {
    const reg = /^1\d{10}$/g;
    return reg.test(value)
  },
  telPhone(value) {
    // const reg = /^\d{11-12}$/g;
    // return reg.test(value)
    return true
  },
  pattern(value, rule) {
    return rule.pattern.test(value)
  },
  equal(value, rule) {
    return value === rule.compareValue
  },
  idno(value, rule) { // 身份证号
    const reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return reg.test(value)
  }
};

/**
 * 字段验证方法
 * @param fields 需验证的字段 {value, rules: [{method, message}]}
 * @param notifyId van-notify组件的ID
 * @returns {boolean} 验证结果
 */
function validate(fields, notifyId) {
  let result = true;
  for (let i = 0; i < fields.length; i++) {
    const item = fields[i];
    let fildResult = true;
    for (let j = 0; j < item.rules.length; j++) {
      const rule = item.rules[j];
      let methodResult = methods[rule.method] ? methods[rule.method](item.value, rule) : false;
      if (!methodResult) {
        const errText = methods[rule.method] ? rule.message || '验证失败' : `没有${rule.method}这个验证方法`;
            fildResult = false;
            // console.log(errText)
        Notify({
          duration: 1000,
          message: errText,
          selector: '#' + notifyId,
          safeAreaInsetTop: false
        });
        break;
      }
    }
    if (!fildResult) {
      result = false;
      break;
    }
  }
  return result;
}

module.exports = validate;

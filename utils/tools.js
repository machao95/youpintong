/**
 * 生成随机字符串
 * @param len 长度
 * @param strs 所有字符
 * @returns {string}
 */
export function randomStr(len = 8, strs) {
  let allStrs = strs || './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let maxPos = allStrs.length;
  let result = '';
  for (let i = 0; i < len; i++) {
    result += allStrs.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

/**
 * 数组中某两项互换顺序
 * @param originList
 * @param type up or down
 * @param index 要换的项的索引
 */
export function updownSequence(originList, type, index) {
  let list = originList.slice();
  if ((type === 'down' && index !== list.length - 1) || (type === 'up' && index !== 0)) {
    let oindex = type === 'up' ? index - 1 : index + 1;
    const temp = list[oindex];
    list[oindex] = list[index];
    list[index] = temp;
  }
  return list
}

/**
 * 生成列表排序数据
 */

export function createSeqData(originList, type, index) {
  const list = updownSequence(originList, type, index);
  const seqData = list.map((item, index) => ({
    id: item.id,
    sortNum: index + 1
  }));
  return {list, seqData}
}

/**
 * 格式化日期
 * @param date Date类型
 * @param fmt 格式化模板： YYYY-MM-DD HH:mm:ss
 * @returns {*}
 */
export function formatDate(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  let t = {
    'YYYY': date.getFullYear(),
    'MM': date.getMonth() + 1,
    'DD': date.getDate(),
    'HH': date.getHours(),
    'mm': date.getMinutes(),
    'ss': date.getSeconds()
  };
  for (let item in t) {
    if (fmt.indexOf(item) >= 0) {
      fmt = fmt.replace(item, t[item] >= 10 ? t[item] : `0${t[item]}`)
    }
  }
  return fmt
}

/**
 * 计算日期 加减
 * @param date Date 类型
 * @param days Number 天数
 * @param type String 操作类型
 * @returns {Date}
 */
export function calcDate(date, days, type = 'add') {
  if (type === 'add') {
    return new Date(date.setDate(date.getDate() + days))
  } else if (type === 'subtract') {
    return new Date(date.setDate(date.getDate() - days))
  } else {
    return date;
  }
}

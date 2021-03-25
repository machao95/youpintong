const tabPages = [
    '/pages/index/index',
    '/pages/mine/mine',
    ''
];
/**
 * 如果能够后退（多层），则navigaetBack，否则调用redirectTo
 */
function backOrRedirect(url) {
  if (tabPages.indexOf(url) >= 0) {
    wx.switchTab({url})
  } else {
    const pages = getCurrentPages();
    // route在低版本不兼容
    const index = pages.findIndex(item => ('/' + item.__route__) == url);
    if (pages.length < 2 || index < 0) {
      wx.redirectTo({url});
    } else {
      const delta = pages.length - 1 - index;
      wx.navigateBack({delta});
    }
  }
}

/**
 * 如果能够后退（多层），则navigaetBack，否则调用navigateTo
 */
function backOrNavigate(url) {
  if (tabPages.indexOf(url) >= 0) {
    wx.switchTab({url})
  } else {
    const pages = getCurrentPages();
    // route在低版本不兼容
    const index = pages.findIndex(item => ('/' + item.__route__) == url);
    if (pages.length < 2 || index < 0) {
      wx.navigateTo({url});
    } else {
      const delta = pages.length - 1 - index;
      wx.navigateBack({delta});
    }
  }
}

/**
 * 微信API同步化 可用await等待结果
 * @param funcName
 * @param param
 * @returns {Promise<any>}
 */
function wxFuncSync(funcName, param) {
  return new Promise((resolve, reject) => {
      console.log('sync')
    wx[funcName]({
      ...param,
      success: res => {
        resolve(res)
      },
      fail: res => {
          resolve(res)
      }
    })
  })
}

function imageToBase64(filePath) {
  return new Promise((resolve, reject) => {
      wx.request({
          url: filePath,
          responseType: 'arraybuffer', //设置返回的数据格式为arraybuffer
          success: res => {
              //把arraybuffer转成base64
              let base64 = wx.arrayBufferToBase64(res.data);
              //不加上这串字符，在页面无法显示的哦
              base64　= 'data:image/jpeg;base64,' + base64;
              // console.log(base64)
              resolve(base64)
          },
          fail: res => {
            reject(false)
          }
      });
  });
}

function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}

module.exports = {
  backOrNavigate,
  backOrRedirect,
  wxFuncSync,
  imageToBase64,
  compareVersion
};

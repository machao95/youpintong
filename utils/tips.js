export default {
  isLoading: false,
  success: function(title, duration = 1000) {
    wx.showToast({
      title: title,
      icon: 'success',
      mask: true,
      duration: duration
    });
    if (duration > 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, duration);
      });
    }
  },
  warn: function(title, duration = 1000) {
    wx.showToast({
      title: title,
      image: '/assets/images/alert.png',
      icon: 'none',
      mask: true,
      duration: duration
    });
    if (duration > 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, duration);
      });
    }
  },
  error: function(title, duration = 1000) {
    wx.showToast({
      title: title,
      image: '/assets/images/error.png',
      icon: 'none',
      mask: true,
      duration: duration
    });
    if (duration > 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, duration);
      });
    }
  },
  info: function({content, title = '提示'}) {
    wx.showModal({
      title,
      content,
      showCancel: false
    });
  },
  confirm: function({content, payload = {}, title = '提示', confirmText = '确定', cancelText = '取消', showCancel = true}) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title,
        confirmText,
        cancelText,
        content,
        showCancel: showCancel,
        success: res => {
          if (res.confirm) {
            resolve(payload);
          } else if (res.cancel) {
            reject(payload);
          }
        },
        fail: res => {
          reject(payload);
        }
      });
    });
  },
  loading: function(title = '加载中') {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    if (wx.showLoading) {
      wx.showLoading({
        title: title,
        mask: true
      });
    } else {
      wx.showNavigationBarLoading();
    }
  },
  loaded: function() {
    if (this.isLoading) {
      this.isLoading = false;
      if (wx.hideLoading) {
        wx.hideLoading();
      } else {
        wx.hideNavigationBarLoading();
      }
    }
  }
}

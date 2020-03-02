// pages/user/write_bug/write_bug.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getTextValue: function(e) {
    console.log(e.detail.value)
    wx.setStorageSync('bug_text_value', e.detail.value);
  },

  clickToBack: function() {
    if (wx.getStorageSync('bug_text_value').length != 0) {
      this.setData({
        showModal_state: true,
      })
    } else {
      wx.switchTab({
        url: '../../myself/myself',
      });
    }
  },

  hideModal: function() {
    this.setData({
      showModal_state: false,
    })
  },

  showModal_cancel: function() {
    try {
      wx.removeStorageSync('bug_text_value');
    } catch (e) {
      // Do something when catch error
    }
    wx.switchTab({
      url: '../../user/user',
    });
  },

  showModal_confirm: function() {
    wx.switchTab({
      url: '../../user/user',
    });
  },

  clickToSubmit: function() {
    if (wx.getStorageSync('bug_text_value').length != 0) {
      // 将bug反馈传至后台
      /*wx.request({
        url: '',
        data: {
          ID: '',
          bug_text: wx.getStorageSync('bug_text_value'),
        },
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
          console.log("发送成功!");
        },
        fail: function(res) {
          console.log(".....fail.....");
        }
      })*/

      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000,
      })
      wx.removeStorageSync('bug_text_value');
    } else {
      wx.showToast({
        title: '发表内容不能为空哦！',
        icon: 'none',
        duration: 2000,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      showModal_state: false,
      bug_text: wx.getStorageSync('bug_text_value') || '',
      statusBarHeight: app.globalData.statusBarHeight,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      showModal_state: false,
      bug_text: wx.getStorageSync('bug_text_value') || '',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
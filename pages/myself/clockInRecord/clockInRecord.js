// pages/clockInRecord/clockInRecord.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this;
    that.setData({
      statusBarHeight: app.globalData.statusBarHeight,
    })
    that.setData({
      clock_in_time: wx.getStorageSync('clock_in_info').clock_in_time,
      total_early_days: wx.getStorageSync('clock_in_info').total_early_days,
      current_consecutive_days: wx.getStorageSync('clock_in_info').current_consecutive_days,
      max_consecutive_days: wx.getStorageSync('clock_in_info').max_consecutive_days,
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
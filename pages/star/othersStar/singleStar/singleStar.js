// pages/star/othersStar/singleStar/singleStar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    x: 0,
    y: 0,
    size: 1,
    rotation_angle: 0,
    info: {}
  },

  backToOnePage: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  _initializeStar: function (others_starinfo) {
    var that = this;
    var x = others_starinfo.x;
    var y = others_starinfo.y;
    var size = others_starinfo.size;
    var rotation_angle = others_starinfo.rotation_angle;
    var info = others_starinfo.info;

    that.setData({
      x: x,
      y: y,
      size: size,
      rotation_angle: rotation_angle,
      info: info
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.data);
    var others_starinfo = JSON.parse(options.data);
    this._initializeStar(others_starinfo);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
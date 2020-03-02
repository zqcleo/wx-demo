// pages/star/styleStar/stylestar.js
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
  sizeSliderChange: function(e){
    //console.log(e);
    this.setData({size: e.detail.value});
  },
  sizeSliderChanging: function(e){
    //console.log(e);
    this.setData({ size: e.detail.value });
  },
  rotationSliderChange: function(e){
    //console.log(e);
    this.setData({ rotation_angle: e.detail.value });
  },
  rotationSliderChanging: function(e){
    //console.log(e);
    this.setData({ rotation_angle: e.detail.value });
  },
  changeStarPosition: function (e) {
    //console.log(e);
    if(e.detail.source == ""){ return ; }
    var that = this;
    var x = e.detail.x;
    var y = e.detail.y;
    this.setData({
      x: x,
      y: y
    });
  },
  backToStarPage: function(){
    wx.navigateBack({
      delta: 1
    });
  },
  confirmStyleStar: function(){
    console.log("confirmStyleStar");
    var pages = getCurrentPages();
    var order = pages[0].data.tapped_star_order;

    var star_list_x_str = 'star_list[' + order + '].x';
    var star_list_y_str = 'star_list[' + order + '].y';
    var star_list_size_str = 'star_list[' + order + '].size';
    var star_list_rotation_str = 'star_list[' + order + '].rotation_angle';

    //能优化？
    pages[0].setData({
      [star_list_x_str]: this.data.x,
      [star_list_y_str]: this.data.y,
      [star_list_size_str]: this.data.size,
      [star_list_rotation_str]: this.data.rotation_angle
    });

    /* 导致setdata终止？ 执行至一半停止
    wx.navigateBack({
      delta: 1
    });*/
  },
  _initializeStar: function(){
    var that = this;
    var pages = getCurrentPages();
    var order = pages[0].data.tapped_star_order;
    var x = pages[0].data.star_list[order].x;
    var y = pages[0].data.star_list[order].y;
    var size = pages[0].data.star_list[order].size;
    var rotation_angle = pages[0].data.star_list[order].rotation_angle;
    var info = pages[0].data.star_list[order].info;

    that.setData({
      x: x,
      y: y,
      size:size,
      rotation_angle: rotation_angle,
      info: info
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._initializeStar();
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
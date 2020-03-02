// pages/star/othersStar/othersStar.js
const app = getApp();

var last_target = {}; //用于双击判断

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curr_session_id: "",
    avatar: "",
    nick_name: "",
    star_list: [],
    constellation: ""
  },
  backToOnePage: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var others_starinfo = JSON.parse(options.data);
    that.setData({
      curr_session_id: others_starinfo.session_id,
      avatar: others_starinfo.avatar,
      nick_name: others_starinfo.nick_name,
      star_list: others_starinfo.star_list,
      constellation: others_starinfo.constellation
    })
  },
  changeConstellation:function(){
    var that = this;
    wx.request({
      url: app.globalData.host_name + '/star/explore/random',
      data: {
        session_id: app.globalData.session_id,
        curr_session_id: this.data.session_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log("");
        //console.log(res);
        var others_starinfo = res.data.result;
        that.setData({
          curr_session_id: others_starinfo.session_id,
          avatar: others_starinfo.avatar,
          nick_name: others_starinfo.nick_name,
          star_list: others_starinfo.star_list,
          constellation: others_starinfo.constellation
        })
      },
      fail: function (res) {
        //console.log("");
        console.log(res);
      }
    });
  },
  showStarInfo: function (e) {
    //console.log(e);
    //判断为双击
    if (last_target.order == e.currentTarget.dataset.order && e.timeStamp - last_target.timeStamp < 300) {
      last_target.timeStamp = e.timeStamp;
      last_target.order = e.currentTarget.dataset.order;
      console.log(e.currentTarget.dataset.order);
      var single_starinfo_str = JSON.stringify(this.data.star_list[e.currentTarget.dataset.order]);
      wx.navigateTo({
        url: 'singleStar/singleStar?data=' + single_starinfo_str,
      });
    }
    //判断为单击
    else {
      last_target.timeStamp = e.timeStamp;
      last_target.order = e.currentTarget.dataset.order;
    }
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
// pages/login/login.js
const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      //console.log("has userinfo! go to index...");
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.switchTab({
        url: '../index/index'
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log("(callback) has userinfo! go to index...");
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.switchTab({
          url: '../index/index'
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          app.globalData.myselfPageInfo.nick_name = res.userInfo.nickName;
          app.globalData.myselfPageInfo.avatar = res.userInfo.avatar;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    //console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    
    //往数据库 userinfo里面添加新用户信息
    wx.request({
      url: app.globalData.host_name + '/login/newUser',
      data: {
        session_id: app.globalData.session_id,
        user_info: e.detail.userInfo
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res);
      },
      fail: function (res) {
        //console.log("login.js wx.request login failed!");
        //console.log(res);
      }
    });
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.setStorage({
      key: 'userInfo',
      data: e.detail.userInfo,
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.werun']) {
          wx.authorize({
            scope: 'scope.werun',
            success() {
              //连接数据库 更新userinfo
              app._getUserAllInfo();
              wx.switchTab({
                url: '../index/index'
              })
            },
            fail(){
              //?
            }
          })
        }
      }
    })

    // 上传头像至服务器
    wx.uploadFile({
      url: app.globalData.host_name + '/login/uploadAvatar',
      filePath: e.detail.userInfo.avatarUrl,
      name: 'avatar',
      formData: {
        session_id: app.globalData.session_id,
      },
      success: function (res) {
        console.log(res.data)
        //app.globalData.myselfPageInfo.avatar = res.data;
      },
      fail: function (res) {

      }
    })
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
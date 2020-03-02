// pages/userInfo/userInfo.js
var translateToCh = require('../../../utils/translateToCh.js');
const app = getApp()
var old_nick_name = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        var new_image_Url = tempFilePaths[0];
        that.setData({
          avatar: new_image_Url,
        })
        app.globalData.myselfPageInfo.avatar = new_image_Url;

        // 将选中的用户头像同步载入本地缓存
        //wx.setStorageSync('avatar', new_image_Url)

        // 将更换的头像传至后台
        /*wx.request({
          url: app.globalData.host_name + '/userInfo/updateAvatar',
          data: {
            session_id: app.globalData.session_id,
            avatar: new_image_Url,
          },
          method: 'POST',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            //console.log("success!");
          },
          fail: function (res) {
            //console.log("Request fail!");
          }
        })*/

        // 上传头像至服务器
        wx.uploadFile({
          url: app.globalData.host_name + '/login/uploadAvatar',
          filePath: new_image_Url,
          name: 'avatar',
          formData: {
            session_id: app.globalData.session_id,
          },
          success: function (res) {
            console.log(res.data)
            app.globalData.myselfPageInfo.avatar = res.data;
          },
          fail: function (res) {

          }
        })


      }
    })
  },

  changeNickname: function (e) {
    var that = this;
    var new_user_nickname = e.detail.value;
    if (new_user_nickname.length > 0 && new_user_nickname.length <= 20) {
      that.setData({
        nick_name: new_user_nickname,
      })
      app.globalData.myselfPageInfo.nick_name = new_user_nickname;

      // 将选中的用户头像同步载入本地缓存
      //wx.setStorageSync('nick_name', new_user_nickname)

      // 将更换的昵称传至后台
      wx.request({
        url: app.globalData.host_name + '/userInfo/updateNickName',
        data: {
          session_id: app.globalData.session_id,
          nick_name: new_user_nickname,
        },
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          //console.log("success!");
        },
        fail: function (res) {
          //console.log("Request fail!");
        }
      })
    }
    else if (new_user_nickname.length == 0) {
      wx.showModal({
        content: '昵称不能为空，但长度也不能超过20哦！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            //console.log('用户点击确定')
          }
        }
      });
      that.setData({
        nick_name: old_nick_name,
      })
      //wx.setStorageSync('nick_name', old_nick_name)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    that.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      userInfo: app.globalData.userInfo,
      avatar: app.globalData.myselfPageInfo.avatar,
      nick_name: app.globalData.myselfPageInfo.nick_name,
      user_region: translateToCh.getRegion(app.globalData.userInfo.province,
        app.globalData.userInfo.city),
    })
    old_nick_name = that.data.nick_name;

    // 设置性别
    if (that.data.userInfo.gender == 1) {
      that.setData({
        user_gender: '男',
      })
    } else if (that.data.userInfo.gender == 2) {
      that.setData({
        user_gender: '女',
      })
    } else if (that.data.userInfo.gender == 0) {
      that.setData({
        user_gender: '未知',
      })
    }
    // 设置地区
    //user_region: translateToCh.getRegion(that.data.userInfo.province,
    //that.data.userInfo.city),
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
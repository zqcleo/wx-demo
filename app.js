//app.js
const time_util = require('/utils/time_util.js');
App({
  globalData: {
    session_id: "",
    userInfo: null,
    has_logged_today: false,
    has_clocked_today: false,
    is_success_today: false,
    consecutive_days: 0,
    host_name: "http://localhost:8080",   
    //host_name: "http://47.100.231.217:80",
    //host_name: "http://www.goob.xyz:80", 
    //host_name: "https://www.goob.xyz:443",  

    //http://localhost:8080
    //https://www.goob.xyz:443
    //http://149.28.71.164:8080
    //47.100.231.217

    starinfo_changed: false,

    statusBarHeight: 0,

    custom_clockin_time: "08:00:00",

    myselfPageInfo: {},
  },

  onHide: function () {
    //console.log("app onHide!");
    //app onhide 里面进行 一些缓存
  },
  onShow: function () {
    //console.log("app onShow!");
  },
  onLaunch: function () {
    var that = this;
    //console.log("---------------------------------------------");
    //console.log("app.js   onLaunch begin...");
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取状态栏的高度
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.statusBarHeight)
        that.globalData.statusBarHeight = res.statusBarHeight
      }
    })

    this._initialize();

  },

  _initialize: function () {
    this._getSessionID();
    this._getUserInfo();
    this._loadStorage();

    //https 通信 初始化打卡信息 
    this._getTodaysLogInInfo();
    this._getTodaysClockInInfo();
    //this._getUserAllInfo();
  },
  _getSessionID: function () {
    var that = this;
    try {
      const value = wx.getStorageSync('session_id');
      if (value) {
        wx.checkSession({
          success() {
            that.globalData.session_id = value;
            //console.log("session_key 有效");
            //console.log("session_id: " + that.globalData.session_id);
          },
          fail() {
            that._updateSessionID("old");
          }
        })
      } else {
        that._updateSessionID("new");
      }
    } catch (e) {
      console.log("onLaunch _login exception!");
      console.log(e);
    }
  },
  // 获取用户信息
  _getUserInfo: function () {
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })

          this._getUserAllInfo();
        }
      }
    })
  },
  _loadStorage: function () {
    var that = this;
    wx.getStorage({
      key: 'consecutive_days',
      success: function (res) {
        that.globalData.consecutive_days = res.data;
      },
      fail: function () {
        //console.log("app.js onLanuch getStorage consecutive_days fail!");
        that.globalData.consecutive_days = 0;
      }
    })
  },

  _getTodaysLogInInfo: function () {
    var session_id;
    var that = this;
    var log_in_time_stamp = time_util.formatTimeStamp(new Date);
    try {
      const value = wx.getStorageSync('session_id')
      if (value) {
        session_id = value;
        wx.request({
          url: this.globalData.host_name + '/login/logInInfo',
          data: {
            session_id: wx.getStorageSync('session_id'),
            log_in_time_stamp: log_in_time_stamp
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            //console.log("app.js   login success!");
            //console.log(res);
            that.globalData.has_logged_today = res.data.result;
          },
          fail: function (res) {
            //console.log("wx.request login failed!");
            //console.log(res);
          }
        })
      }
      else{
        that.globalData.has_logged_today = true;
      }
    } catch (e) {
      // Do something when catch error
    }

  },
  _getTodaysClockInInfo: function () {
    var session_id;
    var that = this;
    try {
      const value = wx.getStorageSync('session_id')
      if (value) {
        session_id = value;
      }
    } catch (e) {
      // Do something when catch error
    }
    wx.request({
      url: this.globalData.host_name + '/ClockIn/ClockInfo',
      data: {
        session_id: session_id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log("app.js   login success!");
        //console.log(res);
        that.globalData.has_clocked_today = res.data.data.has_clocked_today;
        that.globalData.is_success_today = res.data.data.is_success_today;
      },
      fail: function (res) {
        //console.log("wx.request login failed!");
        //console.log(res);
      }
    })
  },
  // 获取用户所有信息，包括头像、昵称、打卡详情、假期时间、打卡时间
  _getUserAllInfo: function () {
    var that = this;
    
    var time = time_util.formatDateAndTime(new Date);
    wx.request({
      url: that.globalData.host_name + '/userInfo/getUserPageAllInfo',
      data: {
        session_id: wx.getStorageSync('session_id'),
        date: time.replace(/\//g, '-').substring(0, 10),
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data.clock_in_time) {
          that.globalData.custom_clockin_time = res.data.clock_in_time;
        }
        that.globalData.myselfPageInfo.avatar = res.data.avatar;
        that.globalData.myselfPageInfo.nick_name = res.data.nick_name;
        that.globalData.myselfPageInfo.clock_in_info = res.data.clock_in_info;
        that.globalData.myselfPageInfo.custom_vacation = res.data.vocation;
        that.globalData.myselfPageInfo.custom_clockin_time = res.data.clock_in_time;
      },
      fail: function (res) {
        //console.log("Request fail!");
      }
    })
  },



  _updateSessionID: function (user_type) {
    var that = this;
    var old_session_id = that.globalData.session_id;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取session_id
        //console.log(res)
        if (res.code) {
          if (user_type === "old") {
            that._updateOldUserInfo(res.code, old_session_id);
          }
          //console.log(res.code);
          wx.request({
            url: this.globalData.host_name + '/login/sessionID',
            data: {
              js_code: res.code,
            },
            method: 'GET',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              //console.log("app.js   login success!");
              console.log(res);
              if (res.data.data === "") {
                console.log("登录失败！请重试！");
              } else {
                that.globalData.session_id = res.data.data;
                try {
                  wx.setStorageSync('session_id', res.data.data)
                } catch (e) { }
              }
            },
            fail: function (res) {
              //console.log("wx.request login failed!");
              //console.log(res);
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: res => {
        console.log("wx.login failed!");
      }
    })
  },
  _updateOldUserInfo: function (js_code, old_session_id) {
    wx.request({
      url: this.globalData.host_name + '/login/oldUser',
      data: {
        js_code: js_code,
        old_session_id: old_session_id,
        user_info: this.globalData.userInfo
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log("app.js   login success!");
        console.log(res);
      },
      fail: function (res) {
        //console.log("wx.request login failed!");
        //console.log(res);
      }
    })
  },




})
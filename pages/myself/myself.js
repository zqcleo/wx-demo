//获取应用实例
const app = getApp()
const time_util = require('../../utils/time_util.js')
var seconds_array = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
  '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
  '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
  '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
];
Page({
  data: {
    custom_clockin_time: '',
    custom_vacation: '',
    imglist: [],
    avatar: '',
    nick_name: '',

    multiArray: [
      ['05', '06', '07', '08', '09', '10'],
      ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
        '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
        '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
        '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
      ]
    ],

    multiIndex: [0, 0],
  },

  bindMultiPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    var that = this;
    that.setData({
      multiIndex: e.detail.value
    })
    that.setData({
      custom_clockin_time: that.data.multiArray[0][that.data.multiIndex[0]] + ':' + that.data.multiArray[1][this.data.multiIndex[1]]
    })

    // 将选择的打卡时间传至后台
    wx.request({
      url: app.globalData.host_name + '/userSetting/setClockInTime',
      data: {
        session_id: app.globalData.session_id,
        custom_clockin_time: that.data.custom_clockin_time + ':00',
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //console.log("发送成功!");
      },
      fail: function (res) {
        console.log("Request fail!");
      }
    })

    // 将选中的打卡时间同步载入本地缓存
    wx.setStorageSync('custom_clockin_time', that.data.custom_clockin_time)
  },

  bindMultiPickerColumnChange: function (e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = seconds_array;
            break;
          case 1:
            data.multiArray[1] = seconds_array;
            break;
          case 2:
            data.multiArray[1] = seconds_array;
            break;
          case 3:
            data.multiArray[1] = seconds_array;
            break;
          case 4:
            data.multiArray[1] = seconds_array;
            break;
          case 5:
            data.multiArray[1] = seconds_array;
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
  },

  previewImage: function (e) {
    var that = this;
    wx.previewImage({
      current: that.data.avatar, // 当前显示图片的http链接  
      urls: that.data.imglist // 需要预览的图片http链接列表  
    })
  },

  addGoal: function () {
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000,
    })
  },

  clearAllStorage: function () {
    var that = this;

    // 清除所有缓存
    /*try {
      wx.clearStorageSync()
    } catch (e) {
      // Do something when catch error
    }*/

    // 获取所有缓存所占空间
    try {
      const res = wx.getStorageInfoSync()
      //console.log(res.currentSize)
      that.setData({
        storage_size: '0KB',
      })
    } catch (e) {
      // Do something when catch error
    }

    wx.showToast({
      title: '成功清除缓存',
      icon: 'none',
      duration: 2000
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    that.setData({
      avatar: app.globalData.myselfPageInfo.avatar,
      clock_in_info: app.globalData.myselfPageInfo.clock_in_info,
      custom_vacation: app.globalData.myselfPageInfo.custom_vacation,
      custom_clockin_time: app.globalData.myselfPageInfo.custom_clockin_time,
      imglist: [],
    })
    if (app.globalData.myselfPageInfo.nick_name.length > 20) {
      that.setData({
        nick_name: app.globalData.myselfPageInfo.nick_name.substring(0, 20),
      })
    }
    else {
      that.setData({
        nick_name: app.globalData.myselfPageInfo.nick_name,
      })
    }
    that.data.imglist.push(that.data.avatar);

    // 获取所有缓存所占空间
    try {
      const res = wx.getStorageInfoSync()
      //console.log(res.currentSize)
      that.setData({
        storage_size: res.currentSize + 'KB',
      })
    } catch (e) {
      // Do something when catch error
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.getTabBar().setData({
      selected: 3
    });
    // 获取用户头像、昵称、打卡详情、假期时间、打卡时间
    that.setData({
      //userInfo: app.globalData.userInfo,
      avatar: app.globalData.myselfPageInfo.avatar,
      custom_vacation: app.globalData.myselfPageInfo.custom_vacation,
      custom_clockin_time: app.globalData.myselfPageInfo.custom_clockin_time,
      imglist: [],
    })
    if (app.globalData.myselfPageInfo.nick_name.length > 20) {
      that.setData({
        nick_name: app.globalData.myselfPageInfo.nick_name.substring(0, 20),
      })
    }
    else {
      that.setData({
        nick_name: app.globalData.myselfPageInfo.nick_name,
      })
    }
    that.data.imglist.push(that.data.avatar);
  },

})
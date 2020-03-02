// pages/vocation/vocation.js
const app = getApp();
var check_num = 0;
var cancel = [1, 1];
var do_set = false;
var custom_vacation = '';
var checkboxItems = [];
var checked_values = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    checkboxItems: [{
      name: '周日',
      value: '7',
      checked: false,
    },
    {
      name: '周一',
      value: '1',
      checked: false,
    },
    {
      name: '周二',
      value: '2',
      checked: false,
    },
    {
      name: '周三',
      value: '3',
      checked: false,
    },
    {
      name: '周四',
      value: '4',
      checked: false,
    },
    {
      name: '周五',
      value: '5',
      checked: false,
    },
    {
      name: '周六',
      value: '6',
      checked: false,
    },
    ],
    custom_vacation: '',
  },

  help: function (checked_values, values, cancel) {
    cancel[0] = cancel[1] = 1;
    for (var i = 0; i < checked_values.length; i++) {
      for (var j = 0; j < values.length; j++) {
        if (checked_values[i] == values[j]) {
          cancel[i] = 0;
        }
      }
    }
  },

  checkboxChange: function (e) {
    do_set = true;
    //console.log(e)
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var that = this;
    custom_vacation = '';
    checkboxItems = that.data.checkboxItems;
    var len = e.detail.value.length;
    that.help(checked_values, e.detail.value, cancel); //判断是否被取消

    if (check_num == 0) {
      checked_values.push(e.detail.value[len - 1]);
      checkboxItems[checked_values[0] % 7].checked = true;
      check_num++;
    } else if (check_num == 1 && cancel[0] == 0) {
      checked_values.push(e.detail.value[len - 1]);
      checkboxItems[checked_values[1] % 7].checked = true;
      check_num++;
    } else if (check_num == 1 && cancel[0] == 1) {
      checkboxItems[checked_values[0] % 7].checked = false;
      checked_values.pop();
      check_num--;
    } else if (check_num == 2 && cancel[0] == 0 && cancel[1] == 0) {
      wx.showToast({
        title: '至多只能选择两天假期哦!',
        icon: 'none',
        duration: 2000
      })
    } else if (check_num == 2 && cancel[0] == 1 && cancel[1] == 0) {
      checkboxItems[checked_values[0] % 7].checked = false;
      checked_values.shift();
      check_num--;
    } else if (check_num == 2 && cancel[0] == 0 && cancel[1] == 1) {
      checkboxItems[checked_values[1] % 7].checked = false;
      checked_values.pop();
      check_num--;
    }
    if (checked_values.length == 1) {
      custom_vacation = checkboxItems[checked_values[0] % 7].name;
    } else if (checked_values.length == 2) {
      if (checked_values[0] % 7 < checked_values[1] % 7) {
        custom_vacation = checkboxItems[checked_values[0] % 7].name + ' ' + checkboxItems[checked_values[1] % 7].name;
      } else {
        custom_vacation = checkboxItems[checked_values[1] % 7].name + ' ' + checkboxItems[checked_values[0] % 7].name;
      }
    }



    that.setData({
      checkboxItems: checkboxItems,
      custom_vacation: custom_vacation,
    });

    // 将选中的假期时间、checkboxItems、checked_values同步载入本地缓存
    //wx.setStorageSync('custom_vacation', custom_vacation)
    //wx.setStorageSync('checkboxItems', checkboxItems)
    //wx.setStorageSync('checked_values', checked_values)
  },

  click_help: function () {
    wx.showModal({
      content: '假期不打卡也不会影响打卡连续天数，但一周只能设置一次，且每次至多只能选择两天假期哦！',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          //console.log('用户点击确定')
        }
      }
    });
  },

  save_vocation_setting: function () {
    if (do_set == true) {
      // 将选中的假期时间、checkboxItems、checked_values同步载入本地缓存
      //wx.setStorageSync('custom_vacation', custom_vacation)
      app.globalData.myselfPageInfo.custom_vacation = custom_vacation;
      wx.setStorageSync('checkboxItems', checkboxItems)
      wx.setStorageSync('checked_values', checked_values)

      // 将选择的假期传至后台
      wx.request({
        url: app.globalData.host_name + '/userSetting/setVacation',
        data: {
          session_id: app.globalData.session_id,
          custom_vacation: custom_vacation,
        },
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          //console.log("发送成功!");
        },
        fail: function (res) {
          //console.log("Request fail!");
        }
      })
    }
    wx.showToast({
      title: '设置成功',
      icon: 'success',
      duration: 2000
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 同步缓存设置checkboxItems
    that.setData({
      checkboxItems: wx.getStorageSync('checkboxItems') || that.data.checkboxItems,
      custom_vacation: app.globalData.myselfPageInfo.custom_vacation,
      statusBarHeight: app.globalData.statusBarHeight,
    })
    checked_values = wx.getStorageSync('checked_values') || []
    if (that.data.custom_vacation.length == 0 || that.data.custom_vacation == '周六 周日') {
      check_num = 0;
    } else if (that.data.custom_vacation.length == 2) {
      check_num = 1;
    } else if (that.data.custom_vacation.length == 5 && that.data.custom_vacation != '周六 周日') {
      check_num = 2;
    }
    cancel[0] = 1;
    cancel[1] = 1;
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
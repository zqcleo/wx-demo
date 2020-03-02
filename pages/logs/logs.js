//logs.js
const time_util = require('../../utils/time_util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return time_util.formatTime(new Date(log))
      })
    })
  }
})

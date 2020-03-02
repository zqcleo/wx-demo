// pages/rankingList/write/write.js
const app = getApp();
const time_util = require('../../../utils/time_util.js');
var image_index;
//var line_feed_array = []; //记录textarea自动换行的下标，以便插入'\n'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text_value: '',
    image_files: [],
    showModal_state: false,
    modal_title: '',
    modal_cancel_text: '',
    modal_confirm_text: '',
  },

  click_to_cancel: function() {
    var that = this;
    if ((wx.getStorageSync('text_value').length != 0) || (wx.getStorageSync('image_file').length != 0)) {
      that.setData({
        showModal_state: true,
        modal_title: '将此次编辑保留?',
        modal_cancel_text: '不保留',
        modal_confirm_text: '保留',
      })
    } else {
      wx.switchTab({
        url: '../../rankingList/rankingList',
      });
    }
  },

  hideModal: function() {
    this.setData({
      showModal_state: false,
    })
  },

  showModal_cancel: function() {
    var that = this;
    if (that.data.modal_title == '将此次编辑保留?') {
      try {
        wx.removeStorageSync('text_value');
        wx.removeStorageSync('image_file');
      } catch (e) {
        // Do something when catch error
      }
      wx.switchTab({
        url: '../../rankingList/rankingList',
      });
    } else if (that.data.modal_title == '确定要删除此图片吗?') {
      that.setData({
        showModal_state: false,
      })
      //console.log('取消删除图片');
    }
  },

  showModal_confirm: function() {
    var that = this;
    if (that.data.modal_title == '将此次编辑保留?') {
      wx.switchTab({
        url: '../../rankingList/rankingList',
      });
    } else if (that.data.modal_title == '确定要删除此图片吗?') {
      var files_temp = that.data.image_files;
      files_temp.splice(image_index, 1);
      that.setData({
        image_files: files_temp,
        showModal_state: false,
      })
      wx.setStorageSync('image_file', files_temp);
    }
  },

  getTextValue: function(e) {
    wx.setStorageSync('text_value', e.detail.value);
  },

  chooseImage: function(e) {
    var that = this;
    if (that.data.image_files.length < 9) {
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            image_files: that.data.image_files.concat(res.tempFilePaths)
          });
          wx.setStorageSync('image_file', that.data.image_files);
        }
      })
    } else {
      wx.showToast({
        title: '至多只能选择9张图片哦!',
        icon: 'none',
        duration: 2000,
      })
    }
  },

  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.image_files // 需要预览的图片http链接列表
    })
  },

  deleteImage: function(e) {
    var that = this;
    that.setData({
      showModal_state: true,
      modal_title: '确定要删除此图片吗?',
      modal_cancel_text: '取消',
      modal_confirm_text: '确定',
    })
    image_index = e.currentTarget.dataset.index; //获取当前长按图片下标
  },

  click_to_submit: function() {
    var that = this;
    if ((wx.getStorageSync('text_value').length != 0) || (wx.getStorageSync('image_file').length != 0)) {
      var time = time_util.formatDateAndTime(new Date); 
      var message_json = {
        session_id: app.globalData.session_id,
        avatar: app.globalData.myselfPageInfo.avatar,
        nick_name: app.globalData.myselfPageInfo.nick_name,
        content: wx.getStorageSync('text_value') || '',
        //picture_path: JSON.stringify(wx.getStorageSync('image_file') || []),
        time_stamp: time.replace(/\//g, '-'),
        send_time: time.substr(11, 5),
        thumb_up: [],
        praise_state: false,
        remark: [],
      };
      
      // 将此动态添加至后台数据库
      wx.request({
        url: app.globalData.host_name + '/forum/insertMessage',
        data: {
          message_json: JSON.stringify(message_json), 
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
      //wx.setStorageSync('user_message', user_message_temp);
     
      var image_files = wx.getStorageSync('image_file') || [];
      if (image_files.length > 0) {
        for (var i = 0; i < image_files.length; i++) {
          //console.log(image_files[i])
          wx.uploadFile({
            url: app.globalData.host_name + '/forum/uploadImage',
            filePath: image_files[i],
            name: 'image',
            formData: {
              session_id: app.globalData.session_id,
              time_stamp: time.replace(/\//g, '-'),
            },
            success: function (res) {
              //console.log(res.data)
            },
            fail: function (res) {

            }
          })
        }
      }
       
      
      //清除缓存
      try {
        wx.removeStorageSync('text_value');
        wx.removeStorageSync('image_file');
        //wx.removeStorageSync('line_feed_array');
      } catch (e) {
        // Do something when catch error
      }

      wx.switchTab({
        url: '../../rankingList/rankingList',
      });
    } else {
      wx.showToast({
        title: '发表内容不能为空哦！',
        icon: 'none',
        duration: 2000,
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //console.log(wx.getStorageSync('text_value'));
    that.setData({
      text_value: wx.getStorageSync('text_value') || '',
      image_files: wx.getStorageSync('image_file') || [],
      statusBarHeight: app.globalData.statusBarHeight,
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
    var that = this;
    that.setData({
      text_value: wx.getStorageSync('text_value') || '',
      image_files: wx.getStorageSync('image_file') || [],
    })
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
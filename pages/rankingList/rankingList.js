// pages/analyze/analyze.js

const app = getApp();
const time_util = require('../../utils/time_util.js');
var rankList_start_Y = 0;
var rankList_end_Y = 0;
var forum_start_Y = 0;
var forum_end_Y = 0;
var window_height;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check_btn1: false,
    check_btn2: false,
    check_btn3: false,
    rankList_scrollTop: 0,
    forum_scrollTop: 0,
    rankList_state: '',
    forum_state: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // 还需通过thumb_up数组来设定praise_state的值
    if (app.globalData.userInfo) {
      that.setData({
        app_session_id: app.globalData.session_id,  // 用户自己的id
        hasUserInfo: true,
        check_btn1: false,
        check_btn2: false,
        check_btn3: false,
        rankList_scrollTop: 0,
        forum_scrollTop: 0,
        rankList_state: '',
        forum_state: '',
      })
    }
    else {
      that.setData({
        hasUserInfo: false,
      })
    }
  },

  click_early_time: function () {
    var that = this;
    that.setData({
      check_btn1: true,
      check_btn2: false,
      check_btn3: false,
      rankList_scrollTop: 0,
    })

    // 向后台请求所有用户当日早起时间
    wx.request({
      url: app.globalData.host_name + '/ranklist/getEarly_time_list',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res);
        that.setData({
          early_time_list: res.data.result,
        })
      },
      fail: function (res) {
        console.log("Request fail!");
      }
    })
  },

  click_consecutive_days: function () {
    var that = this;
    that.setData({
      check_btn1: false,
      check_btn2: true,
      check_btn3: false,
      rankList_scrollTop: 0,
    })

    // 向后台请求所有用户连续打卡天数
    wx.request({
      url: app.globalData.host_name + '/ranklist/getConsecutive_days_list',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res);
        that.setData({
          consecutive_days_list: res.data.result,
        })
      },
      fail: function (res) {
        console.log("Request fail!");
      }
    })
  },

  click_early_days: function () {
    var that = this;
    that.setData({
      check_btn1: false,
      check_btn2: false,
      check_btn3: true,
      rankList_scrollTop: 0,
    })

    // 向后台请求所有用户的早起总天数
    wx.request({
      url: app.globalData.host_name + '/ranklist/getEarly_days_list',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res);
        that.setData({
          early_days_list: res.data.result,
        })
      },
      fail: function (res) {
        console.log("Request fail!");
      }
    })
  },

  previewImage: function (e) {
    var that = this;
    var user_index = e.currentTarget.dataset.user_index;
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: that.data.user_message[user_index].picture_path,//需要预览的图片http链接列表
    })
  },

  clickToPraise: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.user_index;
    var praise_nickname = app.globalData.myselfPageInfo.nick_name;
    //var user_message_temp = wx.getStorageSync('user_message') || that.data.user_message;
    var user_message_temp = that.data.user_message;
    var time = time_util.formatDateAndTime(new Date);
    if (user_message_temp[index].praise_state == false) {
      user_message_temp[index].thumb_up.push({
        session_id: app.globalData.session_id,
        nick_name: praise_nickname,
        time_stamp: time.replace(/\//g, '-'),
      });
      user_message_temp[index].praise_state = true;
    } else {
      /*var index_temp = user_message_temp[index].thumb_up.indexOf({
        session_id: app.globalData.session_id,
        nick_name: praise_nickname,
      });*/
      var index_temp;
      var thumb_up_temp;
      for (var i = 0; i < user_message_temp[index].thumb_up.length; i++) {
        thumb_up_temp = user_message_temp[index].thumb_up[i];
        if (thumb_up_temp.session_id == app.globalData.session_id) {
          index_temp = i;
        }
      }

      user_message_temp[index].thumb_up.splice(index_temp, 1);
      user_message_temp[index].praise_state = false;
    }

    that.setData({
      user_message: user_message_temp,
    })
    //wx.setStorageSync('user_message', user_message_temp);

    // 后台数据库点赞情况更新
    wx.request({
      url: app.globalData.host_name + '/forum/updatePraiser',
      data: {
        session_id: user_message_temp[index].session_id,
        time_stamp: user_message_temp[index].time_stamp,
        thumb_up: JSON.stringify(user_message_temp[index].thumb_up),
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //console.log('success');
      },
      fail: function (res) {
        console.log("Request fail!");
      }
    })
  },

  clickToComment: function (e) {
    var that = this;
    that.setData({
      comment_placeholder: '评论',
      show_focus: true,
      forum_user_index: e.currentTarget.dataset.user_index,
      rankList_state: 'rankList_close',
      forum_state: 'forum_open',
    })
  },

  clickToReply: function (e) {
    var that = this;
    var user_index = e.currentTarget.dataset.user_index;
    var comment_index = e.currentTarget.dataset.comment_index;
    var user_id = app.globalData.session_id;     // id 需要获取， 用户自己的id
    var comment_user_id = that.data.user_message[user_index].remark[comment_index].session_id;  // 这条评论的作者 id
    var user_name_1 = app.globalData.myselfPageInfo.nick_name;
    var user_name_2_pre = that.data.user_message[user_index].remark[comment_index].nick_name;
    var indexOfWord = user_name_2_pre.indexOf("回复");
    var user_name_2;
    if (indexOfWord == -1) { // 只有一个名字
      user_name_2 = user_name_2_pre;
    } else { // 有两个名字
      user_name_2 = user_name_2_pre.substr(0, indexOfWord - 1);
    }

    var reply_name = user_name_1 + ' 回复 ' + user_name_2;
    // 删除评论
    if (comment_user_id == user_id) {
      wx.showActionSheet({
        itemList: ['删除评论'],
        itemColor: '#EE0000',
        success: function (res) {
          if (res.tapIndex == 0) {
            //var user_message_temp = wx.getStorageSync('user_message') || that.data.user_message;
            var user_message_temp = that.data.user_message;
            user_message_temp[user_index].remark.splice(comment_index, 1);
            that.setData({
              user_message: user_message_temp,
            })
            //wx.setStorageSync('user_message', user_message_temp);

            // 删除评论
            wx.request({
              url: app.globalData.host_name + '/forum/updateRemark',
              data: {
                session_id: user_message_temp[user_index].session_id,
                time_stamp: user_message_temp[user_index].time_stamp,
                remark: JSON.stringify(user_message_temp[user_index].remark),
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
          }
        },
        fail: function (res) {
          console.log(res.errMsg);
        }
      });
    }
    // 回复评论
    else {
      that.setData({
        comment_placeholder: '回复' + user_name_2 + ':',
        show_focus: true,
        reply_nickName: user_name_1 + ' 回复 ' + user_name_2,
        forum_user_index: user_index,
        forum_comment_index: comment_index,
      });
    }
  },

  // 获取键盘的高度（有点问题）
  bindfocus: function (e) {
    var that = this;
    window_height = e.detail.height;
    that.setData({
      bottom: e.detail.height, //e.detail.height,  减去tabbar的高度48px, 现在不需要了
    })
  },

  bindblur: function () {
    var that = this;
    that.setData({
      bottom: 0,
      show_focus: false,
    })
  },

  // 获取评论框中的内容
  getInputValue: function (e) {
    //console.log(e.detail.value);
    wx.setStorageSync('comment_input_value', e.detail.value);
  },

  // 后期应该根据session_id确定用户，而不是昵称
  deleteMsg: function (e) {
    //console.log(e)
    var that = this;
    var user_index = e.currentTarget.dataset.user_index;
    var user_name = that.data.user_message[user_index].nick_name;
    var user_session_id = that.data.user_message[user_index].session_id;
    var user_time_stamp = that.data.user_message[user_index].time_stamp;
    if (app.globalData.session_id == user_session_id) {
      wx.showActionSheet({
        itemList: ['删除此消息'],
        itemColor: '#EE0000',
        success: function (res) {
          if (res.tapIndex == 0) {
            //var user_message_temp = wx.getStorageSync('user_message') || that.data.user_message;
            var user_message_temp = that.data.user_message;
            user_message_temp.splice(user_index, 1);

            // 删除此消息
            wx.request({
              url: app.globalData.host_name + '/forum/deleteMessage',
              data: {
                session_id: user_session_id,
                time_stamp: user_time_stamp,
              },
              method: 'POST',
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                //console.log("success!");
              },
              fail: function (res) {
                console.log("Request fail!");
              }
            })

            that.setData({
              user_message: user_message_temp,
            })
          }
        },
        fail: function (res) {
          console.log(res.errMsg);
        }
      });
    }
  },

  sendComment: function (e) {
    var that = this;
    if (wx.getStorageSync('comment_input_value').length != 0) {
      //var user_message_temp = wx.getStorageSync('user_message') || that.data.user_message;
      var user_message_temp = that.data.user_message;
      var forum_user_index = that.data.forum_user_index;
      var time = time_util.formatDateAndTime(new Date);
      if (that.data.comment_placeholder == '评论') {
        user_message_temp[forum_user_index].remark.push({
          session_id: app.globalData.session_id,
          nick_name: app.globalData.myselfPageInfo.nick_name,
          word: wx.getStorageSync('comment_input_value'),
          time_stamp: time.replace(/\//g, '-'),
        })

        that.setData({
          user_message: user_message_temp,
        })

        // 将此评论发送至后台
        wx.request({
          url: app.globalData.host_name + '/forum/updateRemark',
          data: {
            session_id: user_message_temp[forum_user_index].session_id,
            time_stamp: user_message_temp[forum_user_index].time_stamp,
            remark: JSON.stringify(user_message_temp[forum_user_index].remark),
          },
          method: 'POST',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            //console.log("success!");
          },
          fail: function (res) {
            console.log("Request fail!");
          }
        })
      }
      // 回复评论
      else {
        user_message_temp[forum_user_index].remark.splice(that.data.forum_comment_index + 1, 0, {
          session_id: app.globalData.session_id,
          nick_name: that.data.reply_nickName,
          word: wx.getStorageSync('comment_input_value'),
        });
        that.setData({
          user_message: user_message_temp,
        })
        //wx.setStorageSync('user_message', user_message_temp);
        try {
          wx.removeStorageSync('comment_input_value');
        } catch (e) {
          // Do something when catch error
        }

        // 将此评论发送至后台
        wx.request({
          url: app.globalData.host_name + '/forum/updateRemark',
          data: {
            session_id: user_message_temp[forum_user_index].session_id,
            time_stamp: user_message_temp[forum_user_index].time_stamp,
            remark: user_message_temp[forum_user_index].remark,
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
      }
    } else {
      wx.showToast({
        title: '评论内容不能为空哦！',
        icon: 'none',
        duration: 2000,
      })
    }
  },

  rankList_startMove: function (e) {
    rankList_start_Y = e.changedTouches[0].pageY;
  },

  rankList_endMove: function (e) {
    var that = this;
    rankList_end_Y = e.changedTouches[0].pageY;
    if (rankList_end_Y - rankList_start_Y >= 270) {
      that.setData({
        rankList_state: 'rankList_open',
        forum_state: 'forum_close',
      })
    }
  },

  forum_startMove: function (e) {
    forum_start_Y = e.changedTouches[0].pageY;
  },

  forum_endMove: function (e) {
    var that = this;
    forum_end_Y = e.changedTouches[0].pageY;
    if (forum_end_Y - forum_start_Y <= -270) {
      that.setData({
        rankList_state: 'rankList_close',
        forum_state: 'forum_open',
      })
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
    var that = this;
    this.getTabBar().setData({
      selected: 2
    });
    if (app.globalData.userInfo) {

      // 向后台请求此页面的所有信息
      wx.request({
        url: app.globalData.host_name + '/rank_and_forum/getAllInfo',
        data: {
          user_json: JSON.stringify({
            session_id: app.globalData.session_id,
            nick_name: app.globalData.myselfPageInfo.nick_name,
          })
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          //console.log(res);
          that.setData({
            early_time_list: res.data.early_time_list.result,
            consecutive_days_list: res.data.consecutive_days_list.result,
            early_days_list: res.data.early_days_list.result,
            user_message: res.data.user_message.result,
          })
        },
        fail: function (res) {
          console.log("Request fail!");
        }
      })

      that.setData({
        app_session_id: app.globalData.session_id,
        hasUserInfo: true,
        check_btn1: true,
        check_btn2: false,
        check_btn3: false,
        rankList_scrollTop: 0,
        forum_scrollTop: 0,
      })
    }
    else {
      that.setData({
        hasUserInfo: false,
      })
    }

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
    var that = this;
    // 显示顶部刷新图标
    //wx.showNavigationBarLoading();
    if (app.globalData.userInfo) {
      // 向后台请求此页面的所有信息
      wx.request({
        url: app.globalData.host_name + '/rank_and_forum/getAllInfo',
        data: {
          user_json: JSON.stringify({
            session_id: app.globalData.session_id,
            nick_name: app.globalData.myselfPageInfo.nick_name,
          })
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          //console.log(res);
          that.setData({
            early_time_list: res.data.early_time_list.result,
            consecutive_days_list: res.data.consecutive_days_list.result,
            early_days_list: res.data.early_days_list.result,
            user_message: res.data.user_message.result,
          })
          // 隐藏导航栏加载框
          //wx.hideNavigationBarLoading();
          // 停止下拉动作
          wx.stopPullDownRefresh();
        },
        fail: function (res) {
          console.log("Request fail!");
        }
      })

      that.setData({
        check_btn1: true,
        check_btn2: false,
        check_btn3: false,
        rankList_scrollTop: 0,
        forum_scrollTop: 0,
      })
    }
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
//index.js
//获取应用实例
import initCalendar, {
  setTodoLabels,
  setSelectedDays,
  getSelectedDay,
  switchView,
  isUpSlide,
  isDownSlide
} from '../../component/calendar/main.js';
const app = getApp();
var time_util = require('../../utils/time_util.js');

var earliest_time_to_clockin = "06:00:00";
var clockin_countdown_timer;
var left_minutes_to_clock_timer;
var startIndexY; //控制日历展开与否
var endIndexY; //控制日历展开与否
var todolist_content_arr_storage_changed = false;
var clockin_info_storage_changed = true;
var clockin_info = {};

var todolist_content_arr_ofAyear = new Array(12);
for (var i = 0; i < todolist_content_arr_ofAyear.length; i++) { todolist_content_arr_ofAyear[i] = new Array() }

for (var i = 0; i < todolist_content_arr_ofAyear.length; i++) {
  for (var j = 0; j < 31; j++) {
    todolist_content_arr_ofAyear[i][j] = new Array();
  }
}

Page({
  data: {
    has_clocked_today: false,  //是否打卡
    consecutive_days: 0,
    //-------------- before clock------------------
    curr_tranditonal_date: "",
    curr_year: "",
    curr_time: "",
    curr_month: "",
    curr_day: "",
    curr_week: "",
    //---------------clocking----------------------
    isclocking: false,
    leftminutes_to_walk: "00:10:00",
    step_count: 0,
    begin_clockin_time: "",
    end_clockin_time: "",
    time_cost: "",
    left_clockin_time: "00:00:00",
    //---------------todolist----------------------
    currMonthAndDay: '',
    onAdding: false,
    focus: false,    //暂不知 某焦点
    curr_todo_text_input: "",
    curr_schedule_time: "",
    //content_arr: [],
    todolist_content_arr: [],
    istoday: true,
    //status: '1',
    delBtnWidth: 120, //删除按钮宽度单位（rpx）
    is_opening_calendar: false,
    onshow_todotype: false,
    todo_type: ['敬请期待'],
    selected_index: 0
  },

  onLoad: function () {
    this._getDateAndTime();
    this._loadStorage();
    this._initializeCalendar();
    this._getTodaysClockInInfo();
  },
  //获取已打卡、未打卡、太早、太晚
  _getTodaysClockInInfo: function () {
    var that = this;
    var curr_time = time_util.formatTimeWithSeconds(new Date);
    app.globalData.custom_clockin_time = "24:00:00"
    if (app.globalData.has_clocked_today){
      that.setData({
        has_clocked_today: app.globalData.has_clocked_today
      });
    }
    else if (curr_time < earliest_time_to_clockin){
      //还早
      console.log("还早");
    }
    else if (curr_time > app.globalData.custom_clockin_time && !app.globalData.has_logged_today){
      wx.showModal({
        title: '打卡失败！',
        content: '超过计划时间，星星都丢失了哦！',
        showCancel: false,
        success: function(){
          that.setData({
            has_clocked_today: true
          });
          that._clearStarInfo();
        }
      })
    }
    else if (curr_time > app.globalData.custom_clockin_time && app.globalData.has_logged_today) {
      that.setData({
        has_clocked_today: true
      });
    }
    else if (curr_time > earliest_time_to_clockin && curr_time < app.globalData.custom_clockin_time){      
      var seconds = time_util.countSecondsBetweenTwo(curr_time, app.globalData.custom_clockin_time);
      
      left_minutes_to_clock_timer = setInterval(function () {
        if (seconds > 0) { seconds = seconds - 1; }
        else { clearInterval(left_minutes_to_clock_timer); }
        var hour = parseInt(seconds / 3600);
        var minute = parseInt((seconds - hour * 3600) / 60);
        var second = seconds - hour * 3600 - minute * 60;
        var timeString = time_util.formatCountDown(hour, minute, second);

        that.setData({
          left_clockin_time: timeString,
        })
      }, 1000);
    }
  },
  //onLoad时调用 获取缓存 userInfo、
  _loadStorage: function () {
    //console.log("---------------------------------------------");
    //console.log("pages/index/index.js   onLoad/_loadStorage begin...");
    var that = this;
    wx.getStorage({
      key: 'consecutive_days',
      success: function (res) {
        //console.log("getStroage consecutive_days success!");
        that.setData({ consecutive_days: res.data });
      },
      fail: function (res) {
        //console.log("getStroage consecutive_days fail!");
        //console.log(res);
        /*
          如果没有的话就向后端请求 并存入
         */
      }
    });
    wx.getStorage({
      key: 'custom_clockin_time',
      success: function (res) {
        //console.log("getStroage custom_clockin_time success!");

      },
      fail: function (res) {
        //console.log("getStroage uesrInfo fail!");
        //console.log(res);

      }
    });
    wx.getStorage({
      key: 'todolist_content_arr_ofAyear',
      success: function (res) {
        //console.log("getStroage todolist_content_arr_ofAyear success!");
        todolist_content_arr_ofAyear = res.data;
        that.setData({
          todolist_content_arr: todolist_content_arr_ofAyear[that.data.curr_month - 1][that.data.curr_day - 1]
        });
      },
      fail: function (res) {
        //console.log("getStroage todolist_content_arr_ofAyear fail!");
        //console.log(res);
        /*
          如果没有的话就向后端请求 并存入
         */
      }
    });
  },
  //onload时调用 获取当前日期和时间
  _getDateAndTime: function () {
    let that = this;
    var date = new Date();
    var curr_tranditonal_date = time_util.formatDate(date);
    var curr_year = time_util.formatYear(date);
    var curr_month = time_util.formatMonth(date);
    var curr_day = time_util.formatDay(date);
    var curr_time = time_util.formatTime(date);
    var curr_week = time_util.chiaFormatWeek(date);
    this.setData({
      curr_tranditonal_date: curr_tranditonal_date,
      curr_year: curr_year,
      curr_month: curr_month,
      curr_day: curr_day,
      curr_time: curr_time,
      curr_week: curr_week
    });
    //设置计时器 更新时间 有点问题!!!
    setInterval(function () {
      var time = time_util.formatTime(new Date());
      that.setData({
        currtime: time
      });
    }, 60000);
  },
  //onload时调用 初始化日历
  _initializeCalendar: function () {
    initCalendar({
      afterTapDay: (currentSelect, allSelectedDays) => {
        var week_num = currentSelect.week;
        var week = "";
        switch (week_num) {
          case 0:
            week = '周日'
            break;
          case 1:
            week = '周一'
            break;
          case 2:
            week = '周二'
            break;
          case 3:
            week = '周三'
            break;
          case 4:
            week = '周四'
            break;
          case 5:
            week = '周五'
            break;
          case 6:
            week = '周六'
            break;
          default:
            week = '错误'
            break;
        }
        this.setData({
          curr_month: currentSelect.month,
          curr_day: currentSelect.day,
          curr_week: week,
          todolist_content_arr: todolist_content_arr_ofAyear[currentSelect.month - 1][currentSelect.day - 1]
        });
      },
      afterCalendarRender(ctx) { }
    });
    switchView('week');//初始化日历为周视图
  },
  onReady: function () {
    this._logIn();
  },
  //onReady时调用 判断是否进入登录界面 获取授权
  _logIn: function () {
    //console.log(app.globalData.userInfo);
    if (!app.globalData.userInfo) {
      //console.log("logIn: has no userinfo!");
      wx.reLaunch({
        url: '../login/login'
      })
    }
    else {
      //console.log("logIn: has userinfo!");
    }
  },
  onShow: function () {
    this.getTabBar().setData({
      selected: 0
    });
    if (this.data.isclocking) {
      this._updateStep("walking");
    }
  },
  onHide: function () {
    this._updateStorageAll();
  },
  onUnload: function () {
    this._updateStorageAll();
  },

  //----------------------------------------before clock----------------------------------------------
  onStartClockInButtonClicked: function () {
    let that = this;
    that.setData({
      has_clocked_today: true,
      isclocking: true,
      begin_clockin_time: time_util.formatTimeWithSeconds(new Date),
    })
    var seconds = 600;
    that._beginCountDown(seconds);
    that._updateStep("start_walk");
  },
  //获取encryptedData（没有解密的步数）和iv（加密算法的初始向量）
  _updateStep: function (singal) {
    var that = this;
    wx.getWeRunData({
      success: function (res) {
        wx.request({
          url: app.globalData.host_name + '/ClockIn/step',
          data: {
            session_id: app.globalData.session_id,
            grant_type: 'authorization_code',
            encryptedData: res.encryptedData,
            iv: res.iv,
            run_signal: singal
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            //console.log(res.data);
            that.setData({ step_count: res.data });
          },
          fail: function (res) {
            console.log("_updateStep request fail!");
          }
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '开发者未开通微信运动，请关注“微信运动”公众号后重试',
          showCancel: false,
          confirmText: '知道了'
        })
      }
    })
  },
  //开始倒计时
  _beginCountDown: function (seconds) {
    var that = this;
    clearInterval(left_minutes_to_clock_timer);
    clockin_countdown_timer = setInterval(function () {
      if (seconds > 0) { seconds = seconds - 1; }
      else { clearInterval(clockin_countdown_timer); }
      var hour = parseInt(seconds / 3600);
      var minute = parseInt((seconds - hour * 3600) / 60);
      var second = seconds - hour * 3600 - minute * 60;
      var timeString = time_util.formatCountDown(hour, minute, second);

      if (second === 0) {
        console.log("send walking");
        that._updateStep("walking");
      }

      that.setData({
        leftminutes_to_walk: timeString,
      })
    }, 1000);
  },
  //----------------------------------------clocking----------------------------------------------
  _clearStarInfo: function () {
    var star_list = [];
    try {
      wx.setStorageSync('star_list', star_list);
    } catch (e) { }
    app.globalData.starinfo_changed = true;
  },
  _updateStarInfo: function () {
    var star_list = [];
    try {
      const value = wx.getStorageSync('star_list')
      if (value) {
        //console.log("getStorageSync star_list success!");
        //console.log(res.data);
        //console.log(that.data.star_list);
        star_list = value;
      }
      else {
        var first_star = {
          "order": 0,
          "x": 235,
          "y": 440,
          "size": 1,
          "rotation_angle": 0,
          "info": { "message": "这是你的第一颗星" }
        };
        star_list.push(first_star);
      }
    } catch (e) {
      console.log("getStorageSync star_list fail!");
      console.log(e);
    }
    var order = app.globalData.consecutive_days; //用this.data.consecutive_days会有错
    var clockin_info = {
      "year": this.data.curr_year,
      "month": this.data.curr_month,
      "day": this.data.curr_day,
      "begin_clockin_time": this.data.begin_clockin_time,
      "end_clockin_time": this.data.end_clockin_time,
      "time_coast": this.data.time_cost,
      "step_count": this.data.step_count,
      "todolist_content_arr": this.data.todolist_content_arr
    };
    var new_star = {
      "order": order,
      "x": 235,
      "y": 440,
      "size": 1,
      "rotation_angle": 0,
      "info": clockin_info
    };
    star_list.push(new_star);
    try {
      wx.setStorageSync('star_list', star_list);
    } catch (e) { }




    app.globalData.starinfo_changed = true;
  },
  _endClockIn: function (is_success) {
    var that = this;
    that._updateStep("end_walk");
    clearInterval(clockin_countdown_timer);
    that.setData({
      isclocking: false,
      end_clockin_time: time_util.formatTimeWithSeconds(new Date),
    });

    var temp1 = that.data.begin_clockin_time;
    var temp2 = that.data.end_clockin_time;
    var temp1_totalseconds = (parseInt(temp1.substr(0, 2)))
      * 3600 + (parseInt(temp1.substr(3, 5)))
      * 60 + parseInt(temp1.substring(6, 8));
    var temp2_totalseconds = (parseInt(temp2.substr(0, 2)))
      * 3600 + (parseInt(temp2.substr(3, 5)))
      * 60 + parseInt(temp2.substring(6, 8));
    var time_cost = temp2_totalseconds - temp1_totalseconds;

    this.setData({ time_cost: time_cost });
    switchView('week');//初始化日历为周视图
    app.globalData.has_clocked_today = true;

    //判断是否打卡成功
    if (is_success) {
      var consecutive_days = app.globalData.consecutive_days + 1;
      that.setData({
        consecutive_days: consecutive_days
      });
      app.globalData.consecutive_days = consecutive_days;
      app.globalData.is_success_today = true;
      wx.setStorage({
        key: 'consecutive_days',
        data: consecutive_days,
      });
      this._saveCloclinInfoStorage();
      this._updateStarInfo();
    }
    else {
      var consecutive_days = 0;
      that.setData({
        consecutive_days: consecutive_days
      });
      app.globalData.consecutive_days = consecutive_days;
      app.globalData.is_success_today = false;
      wx.setStorage({
        key: 'consecutive_days',
        data: consecutive_days,
      });
      this._saveCloclinInfoStorage();
      this._clearStarInfo();
    }
  },
  clickEndCLockinButton: function () {
    let that = this;
    that._updateStep("walking");
    if (this.data.step_count < 100) {
      wx.showModal({
        title: '提示',
        content: '步数尚未达到要求哦，确定结束吗？',
        success(res) {
          if (res.confirm) {
            that._endClockIn(false);
          }
          else if (res.cancel) {
          }
        }
      })
    }
    else {
      this._endClockIn(true);
    }
  },

  //----------------------------------------todolist----------------------------------------------
  controlCalendar: function () {
    if (this.data.is_opening_calendar) {
      switchView('week');
      this.setData({ is_opening_calendar: false });
    }
    else {
      switchView('month');
      this.setData({ is_opening_calendar: true });
    }
  },
  showStatistics: function () {
    wx.showToast({
      title: '数据统计，敬请期待',
      icon: 'none',
      duration: 2000
    })
  },
  /*controlCalendarStart controlCalendarMove controlCalendarEnd*/
  controlCalendarStart: function (e) {
    //console.log(e);
    startIndexY = e.changedTouches[0].pageY;
  },
  controlCalendarEnd: function (e) {
    //console.log(e);
    endIndexY = e.changedTouches[0].pageY;
    if (startIndexY > endIndexY && (startIndexY - endIndexY) > 200) {
      //console.log("收起日历");
      switchView('week');
    }
    else if (startIndexY < endIndexY && (endIndexY - startIndexY) > 200) {
      //console.log("展开日历");
      switchView('month');
    }
  },
  // 点击下拉显示框
  openTodoTypeOptions() {
    this.setData({
      onshow_todotype: !this.data.onshow_todotype
    });
  },
  // 点击下拉列表
  tapTodoTypeOption(e) {
    let index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      selected_index: index,
      onshow_todotype: false
    });
  },
  /*将用户输入的内容放入curr_todo_text_input*/
  setInput: function (e) {
    this.setData({
      curr_todo_text_input: e.detail.value
    })
  },
  showAddForm: function () {
    this.setData({
      onAdding: true,
      focus: true
    })
  },

  //--------------------------------------------------------------------
  bindScheduleTimeChange: function (e) {
    this.setData({
      curr_schedule_time: e.detail.value
    });
  },
  addTodo: function () {
    //输入为空: 返回/提示
    if (!this.data.curr_todo_text_input.trim()) { return; }
    var tmp_todolist_content_arr = this.data.todolist_content_arr;
    var new_content = {
      time_stamp: new Date().getTime(),
      is_finished: false,
      content: this.data.curr_todo_text_input,
      schedule_time: this.data.curr_schedule_time
    };
    tmp_todolist_content_arr.push(new_content);
    this.changeTodoContentArr(tmp_todolist_content_arr);
    this.hideForm();
    wx.showToast({
      title: '添加成功!',
      icon: 'success',
      duration: 1000
    });
  },
  changeTodoContentArr: function (data) {
    this.setData({
      todolist_content_arr: data,
    })
    var new_todolist_content_arr = data;
    todolist_content_arr_ofAyear[this.data.curr_month - 1][this.data.curr_day - 1] = data;
    //console.log(todolist_content_arr_ofAyear);
    todolist_content_arr_storage_changed = true;
    /*if (this.data.status === '1') {
      this.setData({
        content_arr: data,
        todolist_content_arr: data
      })
    } else {
      this.setData({
        content_arr: data,
        todolist_content_arr: data.filter(item => +item.status === (this.data.status - 2)) 
      })
    }*/
  },
  hideForm: function () {
    this.setData({
      onAdding: false,
      focus: false,
      curr_todo_text_input: '',
      curr_schedule_time: ""
    });
  },

  todoBoxTouchStart: function (e) {
    //console.log('开始：');
    //console.log(e);
    // 是否只有一个触摸点
    if (e.touches.length === 1) {
      this.setData({
        // 触摸起始的X坐标
        startX: e.touches[0].clientX
      })
    }
  },
  todoBoxTouchMove: function (e) {
    //console.log('移动：');
    //console.log(e);
    var that = this
    if (e.touches.length === 1) {
      // 触摸点的X坐标
      var moveX = e.touches[0].clientX
      // 计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX
      // delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth
      var txtStyle = ''

      // 如果移动距离小于等于0，文本层位置不变
      if (disX <= 0) {
        txtStyle = 'left:0'
      }
      // 移动距离大于0，文本层left值等于手指移动距离
      else if (disX > 0) {
        txtStyle = 'left:-' + disX + 'rpx'
        if (disX >= delBtnWidth) {
          // 控制手指移动距离最大值为删除按钮的宽度
          txtStyle = 'left:-' + delBtnWidth + 'rpx'
        }
      }
      // 获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = that.data.todolist_content_arr
      // 将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle
      // 更新列表的状态
      this.setData({
        todolist_content_arr: list
      });
    }
  },
  todoBoxTouchEnd: function (e) {
    //console.log('停止：');
    //console.log(e);
    var that = this
    if (e.changedTouches.length === 1) {
      // 手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX
      // 触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX
      var delBtnWidth = that.data.delBtnWidth
      // 如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? 'left:-' + delBtnWidth + 'rpx' : 'left:0'
      // 获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index
      var list = that.data.todolist_content_arr
      list[index].txtStyle = txtStyle
      // 更新列表的状态
      that.setData({
        todolist_content_arr: list
      });
    }
  },
  changeTodoState: function (e) {
    console.log(e);
    var that = this;
    var time_stamp = e.currentTarget.dataset.item;
    var temp = that.data.todolist_content_arr;
    temp.forEach(el => {
      if (el.time_stamp === time_stamp) {
        if (!el.is_finished) {
          el.is_finished = true
          that.changeTodoContentArr(temp)
          wx.showToast({
            title: '已完成任务',
            icon: 'success',
            duration: 1000
          });
          clockin_info_storage_changed = true;
        } else {
          wx.showModal({
            title: '',
            content: '该任务已完成，确定重新开始任务？',
            confirmText: "确定",
            cancelText: "不了",
            success: function (res) {
              if (res.confirm) {
                el.is_finished = false
                that.changeTodoContentArr(temp)
              } else {
                return console.log('不操作')
              }
            }
          })
        }
      }
    })
  },
  delTodo: function (e) {
    console.log(e);
    var that = this
    var time_stamp = e.currentTarget.dataset.item
    var temp = that.data.todolist_content_arr
    temp.forEach((el, index) => {
      if (el.time_stamp === time_stamp) {
        temp[index].txtStyle = 'left:0'
        wx.showModal({
          title: '',
          content: '您确定要删除吗？',
          confirmText: "确定",
          cancelText: "考虑一下",
          success: function (res) {
            if (res.confirm) {
              temp.splice(index, 1)
              that.changeTodoContentArr(temp)
            } else {
              that.changeTodoContentArr(temp)
              return console.log('不操作')
            }
          }
        })
      }
    })
  },

  _updateStorageAll: function () {
    if (todolist_content_arr_storage_changed) {
      wx.setStorage({
        key: 'todolist_content_arr',
        data: this.data.todolist_content_arr,
      });
      wx.setStorage({
        key: 'todolist_content_arr_ofAyear',
        data: todolist_content_arr_ofAyear,
      });
      todolist_content_arr_storage_changed = false;
    }
    this._saveCloclinInfoStorage();

  },
  _saveCloclinInfoStorage: function () {
    if (clockin_info_storage_changed) {
      clockin_info = {
        "year": this.data.curr_year,
        "month": this.data.curr_month,
        "day": this.data.curr_day,
        "begin_clockin_time": this.data.begin_clockin_time,
        "end_clockin_time": this.data.end_clockin_time,
        "time_coast": this.data.time_cost,
        "step_count": this.data.step_count,
        "todolist_content_arr": this.data.todolist_content_arr
      }
      wx.setStorage({
        key: 'clockin_info',
        data: clockin_info,
      })
      clockin_info_storage_changed = false;
    }
  }
})

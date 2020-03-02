// pages/statistics/statistics.js
const app = getApp();

var last_target = {}; //用于双击判断
var starinfo_changed = false;


Page({
  /**
   * 页面的初始数据
   */
  data: {
    star_list_arr: [],
    constellation_mode: true,
    on_newest_constellation: true,
    star_list: [],
    selected_star_list: [],
    constellation_name: 'default constellation',
    tapped_star_order: 0,

    explore_sidebar_on: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("star page onLoad...");
    var that = this;
    this._loadStorage();
  },
  _loadStorage: function () {
    var that = this;

    //获取star_list
    //不适用同步版本会导致在判断是否成功之后获取star_list 同时导致数据有误 原因未知
    try {
      const value = wx.getStorageSync('star_list')
      if (value) {
        //console.log("getStorageSync star_list success!");
        //console.log(res.data);
        that.setData({ star_list: value });
        //console.log(that.data.star_list);
      }
      else{
        var star_list = [];
        var first_star = {
                              "order": 0,
                              "x": 235,
                              "y": 440,
                              "size": 1,
                              "rotation_angle": 0,
                              "info": {"message":"这是你的第一颗星"}
                            };
        star_list.push(first_star);
        that.setData({ star_list: star_list });
      }
    } catch (e) {
      console.log("getStorageSync star_list fail!");
      console.log(e);
    }

    //获取star_list_arr
    wx.getStorage({
      key: 'star_list_arr',
      success(res) {
        that.setData({ star_list_arr: res.data });
      },
      fail(res){
        var star_list_arr = [];
        that.setData({ star_list_arr: star_list_arr});
        wx.setStorage({
          key: 'star_list_arr',
          data: star_list_arr
        })
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
  //on show时加载星星 是否需要优化?
  onShow: function () {
    //console.log("star page onShow...");
    this.getTabBar().setData({
      selected: 1,
      is_star_page: true
    });
    this._loadStarsInfo();
  },  
  _loadStarsInfo: function(){
    //console.log(app.globalData.starinfo_changed);
    if (app.globalData.starinfo_changed) {
      //console.log("_loadStarsInfo");
      try {
        const value = wx.getStorageSync('star_list')
        if (value) {
          this.setData({
            star_list: value
          })
        }
      } catch (e) {
        // Do something when catch error
      }
      starinfo_changed = true;
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //console.log("star page onHide");
    this._updateStarInfo();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("star page onUnload");
    this._updateStarInfo();
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

  },

  changeStarPosition: function (e) {
    starinfo_changed = true;
    //console.log(e);
    var order = e.currentTarget.dataset.order;
    var star_list = this.data.star_list;

    star_list[order].x = e.detail.x;
    star_list[order].y = e.detail.y;

    var star_list_x_str = 'star_list[' + order + '].x';
    var star_list_y_str = 'star_list[' + order + '].y';
    this.setData({
      [star_list_x_str]: e.detail.x,
      [star_list_y_str]: e.detail.y
    });
  },
  styleStar: function (e) {
    starinfo_changed = true;
    //console.log(e);
    //判断为双击
    if (last_target.order == e.currentTarget.dataset.order && e.timeStamp-last_target.timeStamp<300){
      last_target.timeStamp = e.timeStamp;
      last_target.order = e.currentTarget.dataset.order;
      this.setData({ tapped_star_order: e.currentTarget.dataset.order });
      wx.navigateTo({
        url: 'styleStar/styleStar',
      });
    }
    //判断为单击
    else{
      last_target.timeStamp = e.timeStamp;
      last_target.order = e.currentTarget.dataset.order;
    }
  },
  _updateStarInfo: function(){
    if (starinfo_changed){
      wx.setStorage({
        key: 'star_list',
        data: this.data.star_list,
        success: function () {
          console.log("save star_list storage success!");
        }
      });

      wx.request({
        url: app.globalData.host_name + '/star/update',
        data: {
          session_id: app.globalData.session_id,
          star_list: this.data.star_list,
          constellation_name: this.data.constellation_name
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          //console.log("app.js   login success!");
          //console.log(res);
        },
        fail: function (res) {
          //console.log("wx.request login failed!");
          console.log(res);
        }
      });
    }
    starinfo_changed = false;
  },

  //-----------------------------------侧边栏---------------------------------------
  showPlayGuide: function(){
    wx.showToast({
      title: '玩法指南，敬请期待！',
      icon: 'none',
      duration: 2000
    });
  },
  enterGalaxy: function(){
    this.setData({ constellation_mode: !this.data.constellation_mode});
  },
  showExploreChoiceBars: function(){
    this.setData({ explore_sidebar_on: !this.data.explore_sidebar_on});
  },
  randomExploreOthers: function(){
    wx.request({
      url: app.globalData.host_name + '/star/explore/random',
      data: {
        session_id: app.globalData.session_id,
        curr_session_id: app.globalData.session_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log("");
        //console.log(res);
        var others_starinfo_str = JSON.stringify(res.data.result);
        wx.navigateTo({
          url: 'othersStar/othersStar?data=' + others_starinfo_str,
        });
      },
      fail: function (res) {
        //console.log("");
        console.log(res);
      }
    });
  },
  saveConstellation: function(){
    //增加新star_list 进入arr
    var star_list_arr = [];
    try {
      const value = wx.getStorageSync('star_list_arr')
      if (value) {
        star_list_arr = value;
      }
    } catch (e) {}
    star_list_arr.push(this.data.star_list);
    wx.setStorage({
      key: 'star_list_arr',
      data: star_list_arr,
    });

    //清空当前star_list
    var star_list = [];
    this.setData({star_list: star_list})
    try {
      wx.setStorageSync('star_list', star_list);
    } catch (e) { }
    app.globalData.starinfo_changed = true;

    //后端更新
    wx.request({
      url: app.globalData.host_name + '/star/save',
      data: {
        session_id: app.globalData.session_id,
        star_list: this.data.star_list,
        constellation_name: this.data.constellation_name
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.showToast({
          title: '保存成功！',
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  enterConstellation: function(data){
    var order = data.currentTarget.dataset.order;
    this.setData({
      constellation_mode: true,
      on_newest_constellation: false,
      selected_star_list: this.data.star_list_arr[order]
    });
  },
  openStarMenu: function(){
    wx.showToast({
      title: '打开菜单。。',
      icon: 'none',
      duration: 2000
    });   
  },

})
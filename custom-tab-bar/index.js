Component({
  data: {
    selected: 0,
    color: "#FFFFFF",
    selectedColor: "#FFE135",
    backgroundColor: "#0E55B1",
    is_star_page: false,
    list: [
      {
        "pagePath": "../index/index",
        "text": "首页",
        "iconPath": "../img/tabBar_icon/首页.png",
        "selectedIconPath": "../img/tabBar_icon/首页_selected.png"
      },
      {
        "pagePath": "../star/star",
        "text": "星空",
        "iconPath": "../img/tabBar_icon/星空.png",
        "selectedIconPath": "../img/tabBar_icon/星空_selected.png"
      },
      {
        "pagePath": "../rankingList/rankingList",
        "text": "排行榜",
        "iconPath": "../img/tabBar_icon/排行榜.png",
        "selectedIconPath": "../img/tabBar_icon/排行榜_selected.png"
      },
      {
        "pagePath": "../myself/myself",
        "text": "我的",
        "iconPath": "../img/tabBar_icon/我的.png",
        "selectedIconPath": "../img/tabBar_icon/我的_selected.png"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})
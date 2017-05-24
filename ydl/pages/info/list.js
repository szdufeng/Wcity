var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    imgPath: "/images/icon/",
    rootUrl: "",
    iconUrl: "",
    data: [],
    mainType: 0,
    subType: -1,
    mainName: "",
    citys: [],
    subProjects: [],
    selectMode: 0,
    flag: true,
    subFlag: true,
    selectCityStr: "选择城市",
    selectTypeStr: "选择类别",

    loadModel: 0,
    PageSize: 20,
    Page: 1,
  },

  //事件处理函数
  onLoad: function (option) {
    var that = this

    let tmp = ['全部']
    tmp = tmp.concat(wx.getStorageSync('citys'));
    let ar = [];
    while (tmp.length)
      ar.push(tmp.splice(0, 4));

    that.setData({
      mainType: option.mainType,
      mainName: option.mainName,
      citys: ar,
      iconUrl: app.globalData.iconUrl,
      rootUrl: app.globalData.rootUrl,
    })
    wx.setNavigationBarTitle({
      title: that.data.mainName,
      success: function (res) {
        that.gets();
      }
    })

    var projects = wx.getStorageSync('projects')
    for (let j = 0; j < projects.length; j++) {
      if (that.data.mainType == projects[j].i) {

        let temp = [{"name":'全部',"i":0,"img":""}]
        temp = temp.concat(projects[j].sub);
        that.setData({
          subProjects: temp
        });
        break;
      }
    }
  },
  onPullDownRefresh: function () {
    var that = this
    this.setData({
      Page: 1,
      loadModel: 0,
    })
    that.gets();

    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    var that = this
    this.setData({
      Page: that.data.Page + 1,
      loadModel: 1,
    })
    that.gets();
  },
 

  selectHidden: function (e) {
    var that = this
    if (that.data.selectMode == 0) {
      let row = e.currentTarget.dataset.row
      let column = e.currentTarget.dataset.column
      this.setData({
        loadModel: 0,
        flag: true,
        subFlag: true,
        selectCityStr: that.data.citys[row][column]
      })
    }
    if (that.data.selectMode == 1) {
      let row = e.currentTarget.dataset.row
      let i = e.currentTarget.dataset.i
      this.setData({
        loadModel: 0,
        flag: true,
        subFlag: true,
        subType: i,
        selectTypeStr: that.data.subProjects[row].name
      })
    }
    that.gets();
  },
  cityBtn: function (e) {
    var that = this
    this.setData({
      selectMode: 0,
      flag: false,
        subFlag: true,
    })
  },

  subBtn: function (e) {
    var that = this
    this.setData({
      selectMode: 1,
      flag: true,
      subFlag: false
    })
  },
  call: function (e) {
    var that = this
    let index = e.currentTarget.dataset.index
    wx.makePhoneCall({
      phoneNumber: that.data.data[index].tel,
      success: function (res) {
          util.setPhCount(app.globalData.rootUrl,that.data.data[index].dataId, 2);
        var tempData = that.data.data;

        tempData[index].telCount += 1;
        that.setData({
          data: tempData
        });
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  publishBtn: function () {
    var that = this
    var url = "../pub/publish?mainType=" + that.data.mainType + "&mainName=" + that.data.mainName + "&fromList=1&subType=-1&subName="
    wx.navigateTo({
      url: url,
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  remarkBtn: function (e) {
    var that = this
    let index = e.currentTarget.dataset.index
    var url = 'remark?dataID=' + e.currentTarget.dataset.dataid + '&mainName=' + that.data.mainName
  
    wx.navigateTo({
      url: url,
      success: function (res) {
          util.setPhCount(app.globalData.rootUrl, e.currentTarget.dataset.dataid, 1);
        var tempData = that.data.data;

        tempData[index].clickCount += 1;
        that.setData({
          data: tempData
        });
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  gets: function () {
    var that = this

    that.setData({
      loading: false,
    })
    var city = that.data.selectCityStr;

    if (that.data.selectCityStr == "全部" || that.data.selectCityStr == "选择城市") {
      city = ""
    }
    var jsonn = {
      "contury": app.globalData.contury.id,
      "city": city,
      "mainType": that.data.mainType,
      "subType": that.data.subType,
      "PageSize": that.data.PageSize,
      "Page": that.data.Page
    };

    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootUrl + 'huPublish/gets',
      data: jsonn,
      method: 'Post',
      success: function (res) {
        var da = res.data
        if (that.data.loadModel == 1) {
          da = that.data.data.concat(da)
        }
        that.setData({
          data: da
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 100)
      }
    })
  }
})
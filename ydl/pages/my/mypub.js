var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    data: [],
    imgPath: "/images/icon/",
    userInfo: {},

    loadModel: 0,
    PageSize: 20,
    Page: 1,
  },
  //事件处理函数
  onLoad: function () {
    var that = this
    that.setData({
      userInfo: wx.getStorageSync('userInfo') || {}
    })
    that.getmy();
  },
  onPullDownRefresh: function () {
    var that = this
    this.setData({
      Page: 1,
      loadModel: 0,
    })
    that.getmy();

    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    var that = this
    this.setData({
      Page: that.data.Page + 1,
      loadModel: 1,
    })
    that.getmy();
  },
  remarkBtn: function (e) {
    var that = this
    let dataid = e.currentTarget.dataset.tid
    let typeid = e.currentTarget.dataset.typeid

    let mainName = ""
    var projects = wx.getStorageSync('projects')
    for (let j = 0; j < projects.length; j++) {
      if (typeid == projects[j].i) {
        mainName = projects[j].name

        break;
      }
    }

    var url = '../info/remark?dataID=' + dataid + '&mainName=' + mainName

    wx.navigateTo({
      url: url,
      success: function (res) {
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  delBtn: function (e) {
    var that = this
    let dataid = e.currentTarget.dataset.tid
    let txt = e.currentTarget.dataset.txt


    wx.showModal({
      title: '温馨提示',
      content: '确定要删除:' + txt,
      success: function (res) {
        if (res.confirm) {
          var jsonn = {
            "id": dataid
          };

          wx.showLoading({
            title: '正在删除数据',
            mask: true
          })
          var pics = [];
          wx.request({
            url: app.globalData.rootUrl + 'huPublish/del',
            data: jsonn,
            method: 'Post',
            success: function (res) {
              that.getmy()
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
        } else if (res.cancel) {
        }
      }
    })

  },
  getmy: function () {
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
      "openid": that.data.userInfo.openid,
      "PageSize": that.data.PageSize,
      "Page": that.data.Page
    };

    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootUrl + 'huPublish/getsByOpenid',
      data: jsonn,
      method: 'Post',
      success: function (res) {
        var da = res.data
        if (that.data.loadModel == 1) {
          da = that.data.data.concat(da)
        }
        for (let j = 0; j < da.length; j++) {
          let jsondate = da[j].date.replace("/Date(", "").replace(")/", "");
          da[j].date = util.formatTime(new Date(parseInt(jsondate, 10)))
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

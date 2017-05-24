//index.js
//获取应用实例
var app = getApp()
Page({
  data: { 
    imgPath: "/images/icon/",
    userInfo: {},
    rightImg:"/images/icon/right.png",
    infoImg: "/images/icon/info.png",
    wappName: ""
  },
  //事件处理函数
  onLoad: function () {
    var that = this
      that.setData({
          userInfo: wx.getStorageSync('userInfo') || {},
          wappName: app.globalData.wappName
      })


      if (that.data.userInfo == null || that.data.userInfo.openid == null || that.data.userInfo.nickName == null) {
          util.userLogin(app.globalData.contury.id, app.globalData.rootUrl)
      }
  },
myPub: function () {
  wx.navigateTo({
    url: 'mypub',
    success: function(res){
      // success
    },
    fail: function(res) {
      // fail
    },
    complete: function(res) {
      // complete
    }
  })
},
about: function () {
  wx.navigateTo({
    url: 'about',
    success: function(res){
      // success
    },
    fail: function(res) {
      // fail
    },
    complete: function(res) {
      // complete
    }
  })
},
please: function () {
  wx.navigateTo({
    url: 'please',
    success: function(res){
      // success
    },
    fail: function(res) {
      // fail
    },
    complete: function(res) {
      // complete
    }
  })
},
pubj: function () {
  wx.navigateTo({
    url: 'pubj',
    success: function(res){
      // success
    },
    fail: function(res) {
      // fail
    },
    complete: function(res) {
      // complete
    }
  })
},
pre: function (e) {
    var that = this
    let imgs = e.currentTarget.dataset.imgs
    wx.previewImage({
        // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
        urls: imgs,
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
})

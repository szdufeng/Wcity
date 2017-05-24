//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imgPath: "/images/icon/",
    copyImage: 'copy2',
    conturyName: "",
    imgUrls: []
  },
  //事件处理函数

  onLoad: function () {
    var that = this
    var imgUrls = [
      app.globalData.iconUrl + "pubj/1.png",
      app.globalData.iconUrl + "pubj/2.png",
      app.globalData.iconUrl + "pubj/3.png",
      app.globalData.iconUrl + "pubj/4.png",
      app.globalData.iconUrl + "pubj/5.png"
    ]
    that.setData({
        imgUrls: imgUrls,
            conturyName: app.globalData.contury.name
    })
  },
    telClick: function (e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.tel,
            success: function (res) {
                // success
            }
        })
    },
    copyClick: function (e) {
        var that = this

        that.setData({
            copyImage: 'copy1'
        })
        wx.setClipboardData({
            data: e.currentTarget.dataset.weixin,
            success: function (res) {
                wx.showToast({
                    title: '微信号复制成功！',
                    icon: 'success',
                    duration: 2000
                })
                that.setData({
                    copyImage: 'copy2'
                })
            },
            fail: function (res) {
                // fail
            },
            complete: function (res) {
            }
        })
    },
})

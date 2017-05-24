
var app = getApp()
Page({
    data: {
        imgPath: "/images/icon/",
        tels: [],
        conturyName: "",
        wappName: "",
        telCode:""
    },
    onLoad: function () {
        var that = this
        wx.request({
            url: app.globalData.rootUrl + 'ye/getWappTels',
            data: { "contury": app.globalData.contury.id },
            method: 'Post',
            success: function (res) {
                that.setData({
                    tels: res.data,
                    conturyName: app.globalData.contury.name,
                    wappName: app.globalData.wappName,
                    telCode: app.globalData.telCode,
                })
            },
            fail: function (res) {
                // fail
            },
            complete: function (res) {
                // complete
            }
        })

    },
    call: function (e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.tel,
            success: function (res) {
                // success
            }
        })
    },
    onShareAppMessage: function () {
        return {
            title: app.globalData.shareWord,
            path: '/pages/info/index',
            success: function (res) {
                wx.showModal({
                    title: '温馨提示',
                    content: '感谢您的分享与支持！', showCancel: false,  success: function (res) {
                    }
                })
            },
            fail: function (res) {
                // 分享失败
            }
        }
    }


});
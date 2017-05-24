//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        imgPath: "/images/icon/",
        copyImage: 'copy2',
        wappName: ""
    },
    telClick: function (e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.tel,
            success: function (res) {
                // success
            }
        })
    },
    onLoad: function (option) {
        var that = this
        that.setData({
            wappName: app.globalData.wappName
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
    onShareAppMessage: function () {
        return {
            title: app.globalData.shareWord,
            path: '/pages/info/index',
            success: function (res) {
                wx.showModal({
                    title: '温馨提示',
                    content: '感谢您的分享与支持！', showCancel: false, success: function (res) {
                    }
                })
            },
            fail: function (res) {
                // 分享失败
            }
        }
    }

})

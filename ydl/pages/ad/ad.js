
var app = getApp()

Page({

    data: {
        imgPath: "/images/icon/",
        copyImage: 'copy2',
        wxacode: "",
        adID: "",
        adContent: {},
        conturyName:"" 
    },
    onLoad: function (option) {
        var that = this
        that.setData({
            adid: option.adid,
            conturyName: app.globalData.contury.name
        }) 
        that.getAd();
    },

    getAd: function () {
        var that = this

        var jsonn = {
            "id": that.data.adid
        };

        wx.request({
            url: app.globalData.rootUrl + 'Article/get',
            data: jsonn,
            method: 'Post',
            success: function (res) {
                console.log(res); 

                that.setData({
                    adContent: res.data
                })
            },
            fail: function (res) {
                // fail
            },
            complete: function (res) {
            }
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
    pre: function (e) {
        wx.previewImage({
            // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
            urls: [e.currentTarget.dataset.url],
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
    
});
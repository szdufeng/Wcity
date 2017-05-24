var util = require('../../utils/util.js')

var app = getApp()
Page({
    data: {
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        circular: true,
        imgUrls: [],
        ypData: {},
        imgPath: "/images/icon/",
        tid: -1,
        needComm: true,
        commStr: "",
        userInfo: {},
    },

    //事件处理函数
    onLoad: function (option) {
        var that = this
        that.setData({
            tid: option.tid,
            userInfo: wx.getStorageSync('userInfo') || {}
        })
        that.getYp();
    },

    commBtn: function () {
        var that = this
        that.setData({
            needComm: false,
        })
    },
    cancelCommClick: function () {
        var that = this
        that.setData({
            needComm: true,
            commStr: ""
        })
    },
    commSubmit: function (e) {
        var that = this
        that.setData({
            needComm: true
        })
        that.setComm(that.data.userInfo.openid, that.data.commStr)
    }, 
    commInput: function (e) {
        var that = this
        that.setData({
            commStr: e.detail.value
        })
    },
    Zclick: function () {
        var that = this
        util.setYpCount(app.globalData.rootUrl,app.globalData.contury.id, that.data.ypData.tid, 3);
        var tempYpData = that.data.ypData;

        tempYpData.ZCount += 1;
        that.setData({
            ypData: tempYpData
        });
    },
    Xclick: function () {
        var that = this
        util.setYpCount(app.globalData.rootUrl,app.globalData.contury.id, that.data.ypData.tid, 4);
        var tempYpData = that.data.ypData;

        tempYpData.XCount += 1;
        that.setData({
            ypData: tempYpData
        });
    },
    call: function (e) {
        var that = this
        wx.makePhoneCall({
            phoneNumber: that.data.ypData.tel,
            success: function (res) {
                util.setYpCount(app.globalData.rootUrl,app.globalData.contury.id, that.data.ypData.tid, 2);
                var tempYpData = that.data.ypData;

                tempYpData.telCount += 1;
                that.setData({
                    ypData: tempYpData
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
    getYp: function () {
        var that = this

        wx.showLoading({
            title: '数据加载中',
            mask: true
        })

        var jsonn = { "contury": app.globalData.contury.id, "tid": that.data.tid };

        wx.request({
            url: app.globalData.rootUrl + 'ye/getyp',
            data: jsonn,
            method: 'Post',
            success: function (res) {
                let tempImgUrls = []

                if (res.data.pics.length == 0) {
                    tempImgUrls = tempImgUrls.concat(res.data.logoImg);
                }
                else {
                    tempImgUrls = tempImgUrls.concat(res.data.pics);
                }
                that.setData({
                    imgUrls: tempImgUrls,
                    ypData: res.data
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
    },

    setComm: function (openid, remark) {
        var that = this
        wx.showLoading({
            title: '保存评价',
            mask: true
        })
        var jsonn = { "contury": app.globalData.contury.id, "tid": that.data.tid, "openid": openid, "remark": remark };
       
        wx.request({
            url: app.globalData.rootUrl + 'ye/setComm',
            data:jsonn,
            method: 'Post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                that.getComm()
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
    },
    getComm: function () {
        var that = this

        var jsonn = { "contury": app.globalData.contury.id, "tid": that.data.tid};
       
        wx.request({
            url: app.globalData.rootUrl + 'ye/getComm',
            data: jsonn,
            method: 'Post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                var tmp = that.data.ypData
                tmp.yellowPageComms = res.data
                that.setData({
                    ypData: tmp
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
var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        mainHeight: 0,
        imgPath: "/images/icon/",
        zImgPath: "/images/icon/z1",
        copyImage: 'copy2',
        iconUrl: "",
        dataID: "",
        mainName: "",
        data: {},
        needComm: true,
        commStr: "",
        userInfo: {}, 
        canIUse: wx.canIUse('button.open-type.contact')

    },
    //事件处理函数
    onLoad: function (option) {
        var that = this
        that.setData({
            mainHeight: app.globalData.mainHeight - 30,
            dataID: option.dataID,
            iconUrl: app.globalData.iconUrl,
            picPath: app.globalData.picUrl,
            userInfo: wx.getStorageSync('userInfo') || {}
        })

        var jsonn = {
            "id": that.data.dataID
        };

        wx.showLoading({
            title: '数据加载中',
            mask: true
        })
        var pics = [];
        wx.request({
            url: app.globalData.rootUrl + 'forum/get',
            data: jsonn,
            method: 'Post',
            success: function (res) {
                for (let i = 0; i < res.data.pics.length; i++) {
                    pics = pics.concat(app.globalData.rootUrl + 'Upload/' + res.data.pics[i].path)
                }
                that.setData({
                    pics: pics,
                    data: res.data
                })
                wx.setNavigationBarTitle({
                    title: app.globalData.wappName + "说说",
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
    commInput: function (e) {
        var that = this
        that.setData({
            commStr: e.detail.value
        })
    },
    commSubmit: function (e) {
        var that = this

        if (that.data.commStr != "") {
            that.setComm(that.data.userInfo.openid, that.data.commStr)
        }
        else {
            wx.showToast({
                title: '评论不能为空',
                mask: true,
                duration: 2000
            })
        }
    },


    Zclick: function () {
        var that = this
        util.setForumCount(app.globalData.rootUrl, that.data.data.dataId, 3);
        var tempData = that.data.data;

        tempData.ZCount += 1;
        that.setData({
            data: tempData,
        zImgPath: "/images/icon/z2",
        });
    },
    setComm: function (openid, remark) {
        var that = this
        wx.showLoading({
            title: '保存评价',
            mask: true
        })
        var jsonn = {
            "id": that.data.dataID,
            "openid": openid,
            "remark": remark
        };
        wx.request({
            url: app.globalData.rootUrl + 'forum/setComm',
            data: jsonn,
            method: 'Post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                that.getComm()
                that.setData({
                    commStr: "",
                    needComm: true,
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
    getComm: function () {
        var that = this

        var jsonn = {
            "id": that.data.dataID
        };
        wx.request({
            url: app.globalData.rootUrl + 'forum/getComm',
            data: jsonn,
            method: 'Post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                var tmp = that.data.data
                tmp.userComms = res.data
                that.setData({
                    data: tmp
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
    onShareAppMessage: function () {
        var that = this
        return {
            title: that.data.data.title,
            path: '/pages/forum/remark?dataID=' + that.data.dataID,
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
    },
    
})
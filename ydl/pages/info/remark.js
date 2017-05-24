var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        circular: true,
        imgPath: "/images/icon/",
        copyImage: 'copy2',
        iconUrl: "",
        dataID: "",
        mainName: "",
        data: {},

        pics: [],
        needComm: true,
        commStr: "",
        userInfo: {},
        canIUse: wx.canIUse('button.open-type.contact')
    },
    //事件处理函数
    onLoad: function (option) {
        var that = this
        that.setData({
            dataID: option.dataID,
            mainName: option.mainName,
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
            url: app.globalData.rootUrl + 'huPublish/get',
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
                    title: that.data.mainName,
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
    cancelCommClick: function () {
        var that = this
        that.setData({
            needComm: true,
            commStr: ""
        })
    },
    commBtn: function () {
        var that = this
        that.setData({
            needComm: false,
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
        util.setPhCount(app.globalData.rootUrl, that.data.data.dataId, 3);
        var tempYpData = that.data.data;

        tempYpData.ZCount += 1;
        that.setData({
            data: tempYpData
        });
    },
    Xclick: function () {
        var that = this
        util.setPhCount(app.globalData.rootUrl, that.data.data.dataId, 4);
        var tempYpData = that.data.data;

        tempYpData.XCount += 1;
        that.setData({
            data: tempYpData
        });
    },
    call: function (e) {
        var that = this
        wx.makePhoneCall({
            phoneNumber: that.data.data.tel,
            success: function (res) {
                util.setPhCount(app.globalData.rootUrl, that.data.data.dataId, 2);
                var tempYpData = that.data.data;

                tempYpData.telCount += 1;
                that.setData({
                    data: tempYpData
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
    openMap: function (e) {
        var that = this;
        // 显示加载中
        wx.showToast({
            title: '加载选取工具',
            icon: 'loading',
            duration: 1200
        });
        wx.openLocation({
            latitude: that.data.data.address.latitude,
            longitude: that.data.data.address.longitude,
            scale: 12,
            name: that.data.data.address.name, // 位置名
            address: that.data.data.address.address, // 地址的详细说明
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
    setComm: function (openid, remark) {
        var that = this
        wx.showLoading({
            title: '保存评价',
            mask: true
        })
        var jsonn = { "id": that.data.dataID, "openid": openid, "remark": remark };
        wx.request({
            url: app.globalData.rootUrl + 'huPublish/setComm',
            data: jsonn,
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

        var jsonn = {
            "id": that.data.dataID
        };
        wx.request({
            url: app.globalData.rootUrl + 'huPublish/getComm',
            data: jsonn,
            method: 'Post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                var tmp = that.data.data
                tmp.PublishComms = res.data
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
    copyTxt: function () {
        var that = this
        wx.setClipboardData({
            data: that.data.data.weixin,
            success: function (res) {
                wx.showToast({
                    title: '微信号复制成功！',
                    icon: 'success',
                    duration: 2000
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
    onShareAppMessage: function () {
        var that = this
        return {
            title: that.data.data.title,
            path: '/pages/info/remark?dataID=' + that.data.dataID,
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
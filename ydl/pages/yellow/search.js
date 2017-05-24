var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
    imgPath: "/images/icon/",
        inputShowed: false,
        key: "",
        inputVal: "",
        ypData: [],
        contury: {}
    },

    //事件处理函数
    onLoad: function (option) {
        var that = this
        that.setData({
            contury: app.globalData.contury,
            inputVal: option.str,
        })
        if (that.data.inputVal != "")
            that.search(that.data.inputVal)
    },

    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value,
        });
    },
    searchConfirm: function (e) {
        var that = this
        that.search(e.detail.value)
    },
    ypClick: function (e) {
        
        var that = this
        let index = e.currentTarget.dataset.index
        wx.navigateTo({
            url: "remark?tid=" + that.data.ypData[index].tid,
            success: function (res) {
                util.setYpCount(app.globalData.rootUrl,that.data.contury.id, that.data.ypData[index].tid, 1);
                var tempYpData = that.data.ypData;
                tempYpData[index].clickCount += 1;
                that.setData({
                    ypData: tempYpData
                });
            },
            fail: function (res) {
                // fail
            },
            complete: function (res) {
            }
        })
    },
    call: function (e) {
        var that = this
        let index = e.currentTarget.dataset.index
        wx.makePhoneCall({
            phoneNumber: that.data.ypData[index].tel,
            success: function (res) {
                util.setYpCount(app.globalData.rootUrl,that.data.contury.id, that.data.ypData[index].tid, 2);
                var tempYpData = that.data.ypData;

                tempYpData[index].telCount += 1;
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
    search: function (str) {
        var that = this

        that.setData({
            loading: false,
            ypData: [],
        })
        wx.showLoading({
            title: '数据加载中',
        })
        wx.request({
            url: app.globalData.rootUrl +'ye/s',
            data: { "contury": that.data.contury.id, "str": str },
            method: 'Post',
            success: function (res) {
                that.setData({
                    ypData: res.data,
                    key: str,
                })
            },
            fail: function (res) {
                // fail
            },
            complete: function (res) {
                that.setData({
                    loading: true
                })
                setTimeout(function () {
                    wx.hideLoading()
                }, 100)
            }
        })
    }
})
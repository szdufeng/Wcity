var util = require('../../utils/util.js')

var app = getApp()
Page({
    data: {
        imgPath: "/images/icon/",
        inputShowed: false,
        inputVal: "",
        typeName: "",
        subTypeName: "",
        typeID: -1,
        subTypeID: -1,
        ypData: [],
        typeData: [],
        subTypes: [],
        selectTypeStr: "选择大类",
        selectSubTypeStr: "选择子类",
        flag: true, subFlag: true,
        loadModel: 0,
        PageSize: 20,
        Page: 1,
    },

    //事件处理函数
    onLoad: function (option) {
        var that = this
        that.getAll();
        that.getType();
    },
    toHome: function () {
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
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
    typeSelectHidden: function (e) {
        var that = this
        let row = e.currentTarget.dataset.row
        let column = e.currentTarget.dataset.column
        that.setData({
            subTypes: that.data.typeData[row][column].yellowPageSubTypes,
            typeID: that.data.typeData[row][column].yellowPageType.typeID,
            selectTypeStr: that.data.typeData[row][column].yellowPageType.name,
            flag: true
        })
        that.getYps();
    },
    typeBtn: function () {
        var that = this
        that.setData({
            subTypes: [],
            typeID: -1,
            subTypeID: -1,
            selectSubTypeStr: "选择子类",
            subFlag: true,
            flag: false
        })
    },

    subTypeSelectHidden: function (e) {
        var that = this
        let row = e.currentTarget.dataset.row
        that.setData({
            subTypeID: that.data.subTypes[row].subTypeID,
            selectSubTypeStr: that.data.subTypes[row].name,
            subFlag: true
        })
        that.getYps();
    },
    subTypeBtn: function () {
        var that = this
        that.setData({
            subFlag: false
        })
    },
    onPullDownRefresh: function () {
        var that = this
        this.setData({
            Page: 1,
            loadModel: 0,
        })
        that.getAll();

        wx.stopPullDownRefresh();
    },
    onReachBottom: function () {
        var that = this
        this.setData({
            Page: that.data.Page + 1,
            loadModel: 1,
        })
        that.getAll();
    },

    toType: function () {
        var that = this
        if (that.data.subTypeID == -1)
            return;

        that.setData({
            subTypeID: -1,
        })
        that.getYps(that.data.typeID, -1);
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
            inputVal: e.detail.value
        });
    },

    searchConfirm: function (e) {
        wx.navigateTo({
            url: "search?str=" + e.detail.value,
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
    ypClick: function (e) {
        var that = this
        let index = e.currentTarget.dataset.index
        wx.navigateTo({
            url: "remark?tid=" + that.data.ypData[index].tid,
            success: function (res) {
                util.setYpCount(app.globalData.rootUrl,app.globalData.contury.id, that.data.ypData[index].tid, 1);
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
    getYps: function () {
        var that = this

        wx.showLoading({
            title: '数据加载中',
            mask: true
        })

        var jsonn = {
            "contury": app.globalData.contury.id,
            "typeID":that.data. typeID,
            "subTypeID": that.data.subTypeID
        };  
        wx.request({
            url: app.globalData.rootUrl+'ye/getyps',
            data: jsonn,
            method: 'Post',
            success: function (res) {
                that.setData({
                    ypData: res.data,
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
    getAll: function () {
        var that = this

        wx.showLoading({
            title: '数据加载中',
            mask: true
        })

        var jsonn = {
            "contury": app.globalData.contury.id,
            "PageSize": that.data.PageSize,
            "Page": that.data.Page
        };

        wx.request({
            url: app.globalData.rootUrl +'ye/getAll',
            data: jsonn,
            method: 'Post',
            success: function (res) {

                var da = res.data
                if (that.data.loadModel == 1) {
                    da = that.data.ypData.concat(da)
                }
                that.setData({
                    ypData: da
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
    getType: function () {
        var that = this


        wx.showLoading({
            title: '数据加载中',
            mask: true
        })

        wx.request({
            url: app.globalData.rootUrl + 'ye/getType',
            data: { "contury": app.globalData.contury.id },
            method: 'Post',
            success: function (res) {
                var ar = [];
                while (res.data.length)
                    ar.push(res.data.splice(0, 3));
                that.setData({
                    typeData: ar,
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
})
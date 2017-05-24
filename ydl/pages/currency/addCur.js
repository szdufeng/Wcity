//index.js
//获取应用实例
var util = require('../../utils/util.js')

var app = getApp()
Page({
    data: {
        iconUrl: "",
        curNameList: [],
        myMainCur: {},
        mySelectCurs: {},
    },

    bindlogoTap: function (event) {
        var that = this

        wx.getStorage({
            key: 'mySelectCurs',
            success: function (res) {
                var oldMySelectCurs = res.data;

                var selectCru;
 
                selectCru = that.data.curNameList[event.currentTarget.dataset.i];
                
                const length1 = oldMySelectCurs.length;

                var bool = 0;
                for (let i = 0; i < length1; i++) {
                    if (oldMySelectCurs[i].name == selectCru.name) {
                        bool = 1;
                    }
                }
                if (bool == 0 || length1 == 0) {
                    var jsonn = util.json2Form({
                        "from": that.data.myMainCur.name,
                        "to": selectCru.name,
                        "amount": that.data.myMainCur.amount
                    });
                    var urll = app.globalData.rootUrl + "currency/getcurrencyrate?" + jsonn;

                    wx.request({
                        url: urll,
                        header: {},
                        method: "GET",
                        success: function (res) {
                            selectCru.rate = res.data.rate.toFixed(2);
                            selectCru.amount = res.data.amount.toFixed(2);

                            oldMySelectCurs = oldMySelectCurs.concat([selectCru]);
                            wx.setStorage({
                                key: "mySelectCurs",
                                data: oldMySelectCurs,
                                success: function (res) {

                                    wx.navigateBack({
                                        delta: 1,
                                        success: function (res) {
                                        },
                                        fail: function () {
                                        },
                                        complete: function () {
                                        }
                                    })
                                },
                                fail: function (res) {
                                    // fail
                                },
                                complete: function (res) {
                                }
                            })
                        },
                        fail: function (res) {
                        },
                        complete: function (res) {
                            if (res == null || res.data == null) {
                                return;
                            }
                        }
                    })


                }
                else {
                    wx.navigateBack({
                        delta: 1, // 回退前 delta(默认为1) 页面  .toFixed(2)
                        success: function (res) {
                        },
                        fail: function () {
                        },
                        complete: function () {
                        }
                    })
                }
            }

        })
    },

    getmyCurLists: function () {
        var that = this
        wx.request({
            url: app.globalData.rootUrl + 'ye/getmyCurLists',
            data: {},
            method: 'Post',
            success: function (res) {

                that.setData({
                    curNameList: res.data
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
    onLoad: function () {
        var that = this
        //获取用户存储的兑换金额
        wx.getStorage({
            key: 'myMainCur',
            success: function (res) {
                that.setData({
                    iconUrl: app.globalData.iconUrl,
                    myMainCur: res.data,
                })
                that.getmyCurLists()
            }
        })
    },

})
//index.js
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()

Page({
    data: {
        imgPath: "/images/icon/",
        iconUrl: "",
        curDate: {},
        myMainCur: {},
        mySelectCurs: [],
        hadSelectcurs: false
    },

    onLoad: function () {
        var that = this

        that.setData({
            curDate: util.formatTime(new Date()),

            iconUrl: app.globalData.iconUrl,
        })

        wx.getStorage({
            key: 'myMainCur',
            success: function (res) {
                that.setData({
                    myMainCur: res.data
                })
            }
        })
        that.getmySelectCurs()
    },
    onShow: function () {
        // 页面显示
        //获取用户收藏的货币
        var that = this
        wx.getStorage({
            key: 'mySelectCurs',
            success: function (res) {
                that.setData({
                    hadSelectcurs: false
                })
                if (res.data.length > 0) {
                    that.setData({
                        mySelectCurs: res.data,
                        hadSelectcurs: true
                    })

                    that.rateCount(that.data.myMainCur.amount);
                }
            }
        })
    },


    getmySelectCurs: function () {
        var that = this
        if (that.data.mySelectCurs.length == 0) {
            wx.request({
                url: app.globalData.rootUrl + 'ye/getmySelectCurs',
                data: { "contury": app.globalData.contury.id },
                method: 'Post',
                success: function (res) {
                    if (res.data.length > 0) {
                        that.setData({
                            mySelectCurs: res.data,
                        })

                        wx.setStorage({
                            key: "mySelectCurs",
                            data: res.data
                        })
                        that.setData({
                            mySelectCurs: res.data,
                            hadSelectcurs: true
                        })

                        that.rateCount(that.data.myMainCur.amount);
                    }
                },
                fail: function (res) {
                    // fail
                },
                complete: function (res) {
                    // complete
                }
            })
        }

    },
    longtapFormSet: function (event) {
        var that = this

        wx.showActionSheet({
            itemList: ['设 ' + event.currentTarget.dataset.text + ' 为主货币？', '删除 ' + event.currentTarget.dataset.text + '?'],
            success: function (res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        var temppp = that.data.myMainCur;

                        const length = that.data.mySelectCurs.length;
                        for (let i = 0; i < length; i++) {
                            if (event.currentTarget.dataset.id == that.data.mySelectCurs[i].name) {
                                that.data.myMainCur = that.data.mySelectCurs[i];
                                that.data.myMainCur.amount = temppp.amount;
                                that.data.mySelectCurs[i] = temppp;
                                break;
                            }
                        }
                        that.setData({
                            mySelectCurs: that.data.mySelectCurs
                        })
                        that.setData({
                            myMainCur: that.data.myMainCur
                        })


                        wx.setStorage({
                            key: "myMainCur",
                            data: that.data.myMainCur
                        })

                        wx.setStorage({
                            key: "mySelectCurs",
                            data: that.data.mySelectCurs
                        })

                        that.rateCount(that.data.myMainCur.amount);
                    }

                    if (res.tapIndex == 1) {
                        wx.showModal({
                            title: '系统提示',
                            content: '确定要删除：' + event.currentTarget.dataset.text + '?',
                            success: function (res) {
                                if (res.confirm) {
                                    util.removeByValue(that.data.mySelectCurs, event.currentTarget.dataset.id);
                                    that.setData({
                                        mySelectCurs: that.data.mySelectCurs
                                    })

                                    if (that.data.mySelectCurs.length > 0) {
                                        that.setData({
                                            hadSelectcurs: true
                                        })
                                    }
                                    else {
                                        that.setData({
                                            hadSelectcurs: false
                                        })
                                    }
                                    wx.setStorage({
                                        key: "mySelectCurs",
                                        data: that.data.mySelectCurs
                                    })
                                }
                            }
                        })
                    }
                }
            }
        })
    },

    //打开走势图
    bindKeyTrend: function (e) {
        wx.navigateTo({
            url: 'Trend?amount=' + e.currentTarget.dataset.amount + '&from=' + e.currentTarget.dataset.from + '&fromname=' + e.currentTarget.dataset.fromname + '&to=' + e.currentTarget.dataset.to + '&toname=' + e.currentTarget.dataset.toname,
            success: function (res) {
                // success
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },
    //增加货币
    bindAddCur: function () {
        var thisUrl = 'addCur'
        wx.navigateTo({
            url: thisUrl
        })
    },
    bindFocus: function () {
        // var that = this
        // var temppp = that.data.myMainCur;
        // temppp.amount ="";

        // that.setData({
        //   myMainCur: temppp
        // })
    },
    bindKeyInput: function (e) {
        var that = this
        var temppp = that.data.myMainCur;
        temppp.amount = e.detail.value;

        that.setData({
            myMainCur: temppp
        })

        wx.setStorage({
            key: "myMainCur",
            data: that.data.myMainCur
        })

        that.rateCount(that.data.myMainCur.amount);
    },

    rateCount: function (e) {
        var that = this
        const length = that.data.mySelectCurs.length;
        if (length > 0) {
            var toss = that.data.mySelectCurs[0].name;
            for (let i = 1; i < length; i++) {
                toss = toss + "," + that.data.mySelectCurs[i].name;
            }


            var jsonn = util.json2Form({
                "from": that.data.myMainCur.name,
                "tos": toss,
                "amount": e
            });

            var urll = app.globalData.rootUrl + "currency/getcurrencyrates?" + jsonn;


            wx.request({
                url: urll,
                // data:jsonn,
                header: {
                    // 'Content-Type': 'application/json' 
                    // "Content-Type": "application/x-www-form-urlencoded"  
                },
                method: "GET",

                success: function (res) {
                    for (let i = 0; i < length; i++) {
                        for (let j = 0; j < res.data.length; j++) {
                            if (res.data[j].name == that.data.mySelectCurs[i].name) {
                                that.data.mySelectCurs[i].rate = res.data[j].rate.toFixed(3);
                                that.data.mySelectCurs[i].amount = res.data[j].amount.toFixed(3);
                                continue;
                            }
                        }
                    }

                    that.setData({
                        mySelectCurs: that.data.mySelectCurs
                    })

                    wx.setStorage({
                        key: "mySelectCurs",
                        data: that.data.mySelectCurs
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
    },


    onReady: function () {
        // 页面渲染完成
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
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
    },
})

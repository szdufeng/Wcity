var util = require('../../utils/util.js')
var timer = require('../../utils/wxTimer.js')
//获取应用实例
var app = getApp()
Page({
    data: {
        mainHeight: 0,
        iconUrl: "",
        imgPath: "/images/icon/",
        weatherImgPath: "/images/Weather/",
        mainType: 0,
        mainName: "",
        subType: 0,
        subName: "",
        userInfo: {},
        projects: [],
        services: [],
        subProjects: [],
        currRow: 0,
        subClick: false,
        mainHeads: [],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        circular: true,
        tianqiIndex: 0,
        CurRate: 7.505,
        currencyName:"", 
        toCurrencyName: "",

        tianqiDatas: [],
    },
    onShow: function () {
        var that = this
        that.getWeathers()
        that.rateCount()
    },
    //事件处理函数
    onLoad: function () {
        var that = this

        that.getConfig()

        that.getct();
        that.getMainHeads();
    },

    pClick: function (e) {
        var that = this
        var row = e.currentTarget.dataset.row

        that.setData({
            currRow: row,
            mainType: e.currentTarget.dataset.maintype,
            mainName: e.currentTarget.dataset.mainname
        });
        switch (that.data.mainType) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                wx.navigateTo({
                    url: "list?mainType=" + that.data.mainType + "&subType=0&mainName=" + that.data.mainName + "&subName=''",
                })
                break;
            case 8: wx.navigateTo({
                url: "../yellow/list",
            })
                break;
            case 9: wx.navigateTo({
                url: "../help/tran",
            })
                break;
            case 10: wx.navigateTo({
                url: "../help/subway",
            })
                break;
            case 11: wx.navigateTo({
                url: "../currency/index",
            })
                break;
            case 12: wx.navigateTo({
                url: "tel",
            })
                break;
            default:
                break;
        }
    },
    getMainHeads: function () {
        var that = this

        var jsonn = {
            "contury": app.globalData.contury.id,
            "type":1
        };

        wx.request({
            url: app.globalData.rootUrl + 'Article/gets',
            data: jsonn,
            method: 'Post',
            success: function (res) {
                console.log(res);
                let mainHeads = [].concat(res.data)


                that.setData({
                    mainHeads: mainHeads
                })
            },
            fail: function (res) {
                // fail
            },
            complete: function (res) {
            }
        })
    },
    getct: function () {
        var that = this

        var jsonn = {
            "c": app.globalData.contury.id,
        };

        wx.request({
            url: app.globalData.rootUrl + 'Upload/getct',
            data: jsonn,
            method: 'Post',
            success: function (res) {
                let infos = [].concat(res.data.types.info)
                let services = [].concat(res.data.types.service)
                wx.setStorage({
                    key: 'projects',
                    data: infos,
                    success: function (res) {
                        var ar = [];
                        while (infos.length)
                            ar.push(infos.splice(0, 4));

                        that.setData({
                            projects: ar,
                        })
                    },
                    fail: function (res) {
                        // fail
                    },
                    complete: function (res) {
                        // complete
                    }
                })
                wx.setStorage({
                    key: 'services',
                    data: services,
                    success: function (res) {
                        var ar = [];
                        while (services.length)
                            ar.push(services.splice(0, 4));

                        that.setData({
                            services: ar,
                        })
                    },
                    fail: function (res) {
                        // fail
                    },
                    complete: function (res) {
                        // complete
                    }
                })

                wx.setStorage({
                    key: 'citys',
                    data: res.data.citys,
                    success: function (res) {
                        that.setData({
                            citys: wx.getStorageSync('citys') || {}
                        })
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

    getWeathers: function () {
        var that = this
        wx.request({
            url: app.globalData.rootUrl + 'Upload/getWeathers',
            data: { "c": app.globalData.weatherCsID },
            method: 'Post',
            success: function (res) {
                that.setData({
                    tianqiDatas: res.data,
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
    rateCount: function () {
        var that = this

        var jsonn = util.json2Form({
            "to": app.globalData.contury.currency,
            "from": app.globalData.toCurrency,
            "amount": 1
        });

        var urll = app.globalData.rootUrl + "currency/getcurrencyrate?" + jsonn;

        wx.request({
            url: urll,
            header: {},
            method: "GET",

            success: function (res) {

                that.setData({
                    CurRate: res.data.rate.toFixed(3)
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
    },
    commBtn: function () {
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
        })

        animation.translate(0, -300).step()

        this.setData({
            animationData: animation.export()
        })


    },
    adclick: function (e) {
        let adid = e.currentTarget.dataset.i
        let url = '../ad/ad?adid=' + adid
        wx.navigateTo({
            url: url,
            success: function (res) {
                util.setAdCount(app.globalData.rootUrl,  adid, 1);

            },
            fail: function (res) {
                // fail
            },
            complete: function (res) {
                // complete
            }
        })
    },
    currBtn: function (e) {
        var that = this
        wx.navigateTo({
            url: "../currency/index",
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
    tianqiBtn: function (e) {
        var that = this
        var url = "../help/tianqi?cityid=" + that.data.tianqiDatas[e.currentTarget.dataset.index].basic.id
        wx.navigateTo({
            url: url,
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
    getConfig: function () {
        var that = this
        var jsonn = { "c": app.globalData.contury.id };
        console.info(jsonn)

        wx.request({
            url: app.globalData.rootUrl + 'Upload/getConfig',
            data: jsonn,
            method: 'Post',
            success: function (res) {
                console.info(res.data)
                app.globalData.shareWord = res.data.shareWord,
                    app.globalData.weatherCsID = res.data.weatherCsID,
                    app.globalData.wappName = res.data.wappName,
                    app.globalData.toCurrency = res.data.toCurrency,
                    app.globalData.toCurrencyName = res.data.toCurrencyName,
                    app.globalData.telCode = res.data.telCode,
                    app.globalData.needLangTTS = res.data.needLangTTS,

                    app.globalData.tranTitle = res.data.tranTitle,
                    app.globalData.tranTopTxt = res.data.tranTopTxt,
                    app.globalData.contury = {
                    "id": app.globalData.contury.id,
                        "name": res.data.conturyName,
                        "langType": res.data.langType,
                        "langName": res.data.langName,
                        "currencyName": res.data.currencyName,
                        "currency": res.data.currency
                    },

                    wx.setStorage({
                        key: "myMainCur",
                        data: {
                            "name": res.data.DefaultCur.name,
                            "country": res.data.DefaultCur.country,
                            "rate": res.data.DefaultCur.rate,
                            "amount": res.data.DefaultCur.amount,
                            "cn": res.data.DefaultCur.cn,
                        }
                    })


                wx.setNavigationBarTitle({
                    title: app.globalData.wappName,
                    success: function (res) {
                    }
                })

                that.setData({
                    userInfo: wx.getStorageSync('userInfo') || {},
                    iconUrl: app.globalData.iconUrl,
                    mainHeight: app.globalData.mainHeight,
                    currencyName: app.globalData.contury.currencyName,
                    toCurrencyName: app.globalData.toCurrencyName,
                })
                that.getWeathers()
                that.rateCount()
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

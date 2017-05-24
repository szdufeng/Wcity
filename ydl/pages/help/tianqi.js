var util = require('../../utils/util.js')

var app = getApp()
Page({
    data: {
        imgPath: "/images/icon/",
        weatherImgPath: "/images/Weather/",
        tianqiData: {},
        citys: [],
        cityid: "",
        curDate: "",
        curWeek: "",
        curHour: ""
    },
    onShow: function () {
        var that = this
    },
    //事件处理函数
    onLoad: function (option) {
        var that = this
        that.setData({
            curDate: util.formatTimeDay(new Date()),
            curWeek: "星期" + "日一二三四五六".charAt(new Date().getDay()),
            curHour: util.formatTimeMinutes(new Date()),
        })
        if (option.cityid != undefined) {
            that.setData({
                cityid: option.cityid,
                curDate: util.formatTimeDay(new Date())
            })
        }
        else {
            that.setData({
                cityid: "",
            })
        }
        var that = this
        wx.request({
            url: app.globalData.rootUrl + 'Upload/getWeatherCs',
            data: { "c": app.globalData.weatherCsID },
            method: 'Post',
            success: function (res) {

                if (that.data.cityid.length == 0) {
                    that.setData({
                        cityid: res.data[0].id,
                    })
                }
                that.getWeather(that.data.cityid)

                var ar = [];
                while (res.data.length)
                    ar.push(res.data.splice(0, 4));

                that.setData({
                    citys: ar,
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
    pClick: function (e) {
        var that = this
        that.setData({
            cityid: e.currentTarget.dataset.cityid,
        })
        that.getWeather(that.data.cityid)
    },
    getWeather: function (cityid) {
        var that = this

        wx.request({
            url: app.globalData.rootUrl + 'Upload/getWeather',
            data: { "cityid": cityid },
            method: 'Post',
            success: function (res) {
                for (let i = 0; i < res.data.daily_forecast.length; i++) {
                    res.data.daily_forecast[i].date = res.data.daily_forecast[i].date.substring(5) + " 周" + "日一二三四五六".charAt(new Date(res.data.daily_forecast[i].date).getDay())
                }
                var index = 0
                for (let i = 0; i < res.data.hourly_forecast.length; i++) {
                    if (that.data.curHour > res.data.hourly_forecast[i].date) {
                        index = i;
                    }
                }
                res.data.hourly_forecast.splice(0, index)
                that.setData({
                    tianqiData: res.data,
                })
                wx.setNavigationBarTitle({
                    title: that.data.tianqiData.basic.city + "天气预报",
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
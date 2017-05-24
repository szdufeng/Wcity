//app.js

var util = require('/utils/util.js')
const contury = 'ydl';
const rootUrl = "https://wapp.talk-easy.cn/";


App({
    onLaunch: function () {
        var that = this

        var userInfo = wx.getStorageSync('userInfo') || {};
        if (userInfo == null || userInfo.openid == null || userInfo.nickName == null) {
            util.userLogin(contury, rootUrl)
        }
        wx.getLocation({
            success: function (res) {
                that.globalData.LocationInfo =
                    {
                        "accuracy": res.accuracy,
                        "altitude": res.altitude,
                        "horizontalAccuracy": res.horizontalAccuracy,
                        "latitude": res.latitude,
                        "longitude": res.longitude,
                        "speed": res.speed,
                        "verticalAccuracy": res.verticalAccuracy
                    }
            }
        })
        wx.getSystemInfo({
            success: function (res) {
                that.globalData.mainHeight = res.windowHeight
                that.globalData.SystemInfo =
                    {
                        "SDKVersion": res.SDKVersion,
                        "language": res.language,
                        "model": res.model,
                        "pixelRatio": res.pixelRatio,
                        "platform": res.platform,
                        "screenHeight": res.screenHeight,
                        "screenWidth": res.screenWidth,
                        "system": res.system,
                        "version": res.version,
                        "windowHeight": res.windowHeight,
                        "windowWidth": res.windowWidth
                    }
            }
        })
    },
    globalData: {
        LocationInfo: {},
        SystemInfo: {},
        mainHeight: 0,
        rootUrl: rootUrl,
        iconUrl: rootUrl + "icon/",
        contury: { id: contury }
    }
})
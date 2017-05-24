
var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
Page({
    data: {
        imgPath: "/images/icon/",
        userInfo: {},
        mainType: 0,
        mainName: "",
        projects: [],
    },

    //事件处理函数
    onLoad: function () {
        var that = this

        let infos = wx.getStorageSync('projects').concat()
        var ar = [];
        while (infos.length)
            ar.push(infos.splice(0, 3));

        that.setData({
            projects: ar,
            iconUrl: app.globalData.iconUrl,
            userInfo: wx.getStorageSync('userInfo') || {}
        })

        if (that.data.userInfo == null || that.data.userInfo.openid == null || that.data.userInfo.nickName == null) {
            util.userLogin(app.globalData.contury.id, app.globalData.rootUrl)
        }
    },


    pClick: function (e) {
        var that = this

        var row = e.currentTarget.dataset.row

        that.setData({
            currRow: row,
            mainType: e.currentTarget.dataset.maintype,
            mainName: e.currentTarget.dataset.mainname
        });
        for (let j = 0; j < that.data.projects[row].length; j++) {
            if (that.data.mainType == that.data.projects[row][j].i) {
                let infos = that.data.projects[row][j].sub.concat()
                var url = ""
                if (infos.length == 0)
                    url = "publish?mainType=" + that.data.mainType + "&mainName=" + that.data.mainName + "&subType=-1&subName="
                else
                    url = "selectSub?mainType=" + that.data.mainType + "&mainName=" + that.data.mainName
                wx.navigateTo({
                    url: url,
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
            }
        }
    }
})
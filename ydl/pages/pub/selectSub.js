var app = getApp()
Page({
    data: {
        imgPath: "/images/icon/",
        mainType: 0,
        mainName: "",
        subType: 0,
        subName: "",
        projects: [],
        subProjects: [],
        subProjects1: [],
    },

    //事件处理函数
    onLoad: function (option) {
        var that = this;
        that.setData({
            mainType: option.mainType,
            mainName: option.mainName,
            projects: wx.getStorageSync('projects').concat(),
            iconUrl: app.globalData.iconUrl,
        })

        for (let j = 0; j < that.data.projects.length; j++) {
            if (that.data.mainType == that.data.projects[j].i) {
                let infos = that.data.projects[j].sub.concat()

                that.setData({
                    subProjects: infos
                });
                if (infos.length > 4) {
                    var ar = [];
                    while (infos.length)
                        ar.push(infos.splice(0, 2));

                    that.setData({
                        subProjects1: ar,
                    })
                }
                break;
            }
        }
    },


    subPClick: function (e) {
        var that = this
        that.setData({
            subType: e.currentTarget.dataset.subtype,
            subName: e.currentTarget.dataset.subname
        });
        wx.navigateTo({
            url: "publish?mainType=" + that.data.mainType + "&mainName=" + that.data.mainName + "&subType=" + that.data.subType + "&subName=" + that.data.subName,
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
})
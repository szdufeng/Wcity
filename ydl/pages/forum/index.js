//index.js
var sliderWidth = 76;
var app = getApp()
Page({
    data: {
        imgPath: "/images/icon/forum/",
        ForumTypes: [],
        data: [],

        tabs: ["社区列表", "最新发表", "热门回复", "精华主题"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        loadModel: 0,
        PageSize: 20,
        Page: 1,
    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 3,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
        that.getForumTypes();
        wx.setNavigationBarTitle({
            title: app.globalData.wappName + "说说",
            success: function (res) {
                that.gets(false, false);
            }
        })
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    onPullDownRefresh: function () {
        var that = this
        this.setData({
            Page: 1,
            loadModel: 0,
        })
        that.gets(false, false);

        wx.stopPullDownRefresh();
    },
    onReachBottom: function () {
        var that = this
        this.setData({
            Page: that.data.Page + 1,
            loadModel: 1,
        })
        that.gets(false, false);
    },
    bindtap: function (e) {
        var that = this
        let index = e.currentTarget.dataset.index
        let f = that.data.ForumTypes[index]
        wx.navigateTo({
            url: 'list?tid=' + f.tid + '&name=' + f.name + '&remark=' + f.remark,
        })
    },
    getForumTypes: function () {
        var that = this
        wx.request({
            url: app.globalData.rootUrl + 'ye/getForumTypes',
            data: { "contury": app.globalData.contury.id },
            method: 'Post',
            success: function (res) {
                if (res.data.length > 0) {

                    that.setData({
                        ForumTypes: res.data,
                    })


                    wx.setStorage({
                        key: "ForumTypes",
                        data: res.data
                    })
                }

                wx.setNavigationBarTitle({
                    title: app.globalData.contury.name + "说说",
                    success: function (res) {
                    }
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
    gets: function (isTop, isSelect) {
        var that = this

        that.setData({
            loading: false,
        })

        var jsonn = {
            "contury": app.globalData.contury.id,

            "mainType": 7,
            "isTop": isTop,
            "isSelect": isSelect,
            "PageSize": that.data.PageSize,
            "Page": that.data.Page
        };
        console.info(jsonn)
        wx.showLoading({
            title: '数据加载中',
            mask: true
        })
        wx.request({
            url: app.globalData.rootUrl + 'forum/gets',
            data: jsonn,
            method: 'Post',
            success: function (res) {
                var da = res.data
                if (that.data.loadModel == 1) {
                    da = that.data.data.concat(da)
                }
                that.setData({
                    data: da
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
    }
})

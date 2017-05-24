
var sliderWidth = 96;

var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        imgPath: "/images/icon/forum/",
        addImgPath: "/images/icon/",
        rootUrl: "",
        iconUrl: "",
        data: [],
        tid: 0,
        name: "",
        remark:"",
        selectMode: 0,
        flag: true,
        subFlag: true,

        loadModel: 0,
        PageSize: 20,
        Page: 1,
        tabs: ["最新发表", "热门回复", "精华主题"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0
    },

    onLoad: function (option) {
        var that = this

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });

        that.setData({
            tid: option.tid,
            name: option.name,
            remark: option.remark,
            iconUrl: app.globalData.iconUrl,
            rootUrl: app.globalData.rootUrl,
        })
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
        that.gets(false,false);

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



    publishBtn: function () {
        var that = this
        var url = "publish?tid=" + that.data.tid + "&name=" + that.data.name
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
    remarkBtn: function (e) {
        var that = this
        let index = e.currentTarget.dataset.index
        var url = 'remark?dataID=' + e.currentTarget.dataset.dataid 

        wx.navigateTo({
            url: url,
            success: function (res) {
                util.setForumCount(app.globalData.rootUrl,  e.currentTarget.dataset.dataid, 1);
                var tempData = that.data.data;

                tempData[index].clickCount += 1;
                that.setData({
                    data: tempData
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
    gets: function (isTop, isSelect) {
        var that = this

        that.setData({
            loading: false,
        })
        
        var jsonn = {
            "contury": app.globalData.contury.id,
            
            "mainType": that.data.tid,
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
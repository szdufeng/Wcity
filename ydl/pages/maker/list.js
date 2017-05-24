 

var util = require('../../utils/util.js')

var app = getApp()
Page({
    data: {
        imgPath: "/images/icon/",
        makerIcon: "/images/icon/maker/",
        inputShowed: false,
        inputVal: "",
        typeName: "",
        citys: [],
        typeID: -1,
        data: [],
        typeData: [],
        selectTypeStr: "类型",
        selectCityStr: "地区",
        selectMode: 0,
        cityFlag: true,
        typeFlag: true,
        loadModel: 0,
        PageSize: 20,
        Page: 1,
    },

    //事件处理函数
    onLoad: function () {
        var that = this

        let tmp = ['全部']
        tmp = tmp.concat(wx.getStorageSync('citys'));
        let ar = [];
        while (tmp.length)
            ar.push(tmp.splice(0, 4));
        that.setData({
            citys: ar,
            iconUrl: app.globalData.iconUrl,
            rootUrl: app.globalData.rootUrl,
        })
        wx.setNavigationBarTitle({
            title: app.globalData.contury.name + "商家",
            success: function (res) {
                that.getType();
                that.gets();
            }
        })
       
    },
    onPullDownRefresh: function () {
        var that = this
        this.setData({
            Page: 1,
            loadModel: 0,
        })
        that.gets();

        wx.stopPullDownRefresh();
    },
    onReachBottom: function () {
        var that = this
        this.setData({
            Page: that.data.Page + 1,
            loadModel: 1,
        })
        that.gets();
    },
    cityBtn: function () {
        this.setData({
            cityFlag: false,
            typeFlag: true,
            selectMode: 0,
        });
    },
    typeBtn: function () {
        this.setData({
            typeFlag: false,
            cityFlag: true,
            selectMode: 1,
        });
    },
    selectHidden: function (e) {
        var that = this
        if (that.data.selectMode == 0) {
            let row = e.currentTarget.dataset.row
            let column = e.currentTarget.dataset.column
            this.setData({
                cityFlag: true,
                typeFlag: true,
                selectCityStr: that.data.citys[row][column]
            })
            that.gets();
        }
        if (that.data.selectMode == 1) {
            let row = e.currentTarget.dataset.row
            let tid = e.currentTarget.dataset.tid
            this.setData({
                cityFlag: true,
                typeFlag: true,
                typeID: tid,
                selectTypeStr: that.data.typeData[row].name
            })
            that.gets();
        }
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

    remarkBtn: function (e) {
        var that = this
        let index = e.currentTarget.dataset.index
        var url = 'remark?dataID=' + e.currentTarget.dataset.dataid + '&mainName=' + that.data.mainName

        wx.navigateTo({
            url: url,
            success: function (res) {
                util.setMakerCount(app.globalData.rootUrl, e.currentTarget.dataset.dataid, 1);
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

    getType: function () {
        var that = this
        wx.request({
            url: app.globalData.rootUrl + 'ye/getmakerTypes',
            data: { "contury": app.globalData.contury.id },
            method: 'Post',
            success: function (res) {
                let temp = [{ "name": '全部', "tid": 0 }]
                temp = temp.concat(res.data);
                that.setData({
                    typeData: temp,
                })
            },
            fail: function (res) {
                // fail
            },
            complete: function (res) {
            }
        })
    },
    publishBtn: function () {
        var that = this
        var url = "publish"
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
    gets: function () {
        let that = this

        that.setData({
            loading: false,
        })
        let isTop = false;
        let city = that.data.selectCityStr;
        if (that.data.selectCityStr == "全部" || that.data.selectCityStr == "地区") {
            city = ""
        }
        let jsonn = {
            "contury": app.globalData.contury.id,
            "city": city,
            "mainType": that.data.typeID,
            "isTop": isTop,
            "PageSize": that.data.PageSize,
            "Page": that.data.Page
        };
        wx.showLoading({
            title: '数据加载中',
            mask: true
        })
        wx.request({
            url: app.globalData.rootUrl + 'maker/gets',
            data: jsonn,
            method: 'Post',
            success: function (res) {
                let da = res.data
                let diss = 0
                for (let i = 0; i < da.length; i++) {

                    diss = util.GetDistance(
                        app.globalData.LocationInfo.latitude, app.globalData.LocationInfo.longitude,
                        da[i].address.latitude, da[i].address.longitude
                    )
                    console.info(diss)
                    if (diss > 1)
                        da[i].dis = diss.toFixed(0) + 'km'
                    else {

                        da[i].dis = (diss * 1000).toFixed(0) + 'm'
                    }
                }

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
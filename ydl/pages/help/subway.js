//index.js  
var app = getApp()
var olddistance = 0;
var newdistance;
var oldscale = 1;
var diffdistance;
var baseHeight;
var baseWidth;
var windowWidth = 0;
var windowHeight = 0;

Page({
    data: {
        rootImg: "http://" + app.globalData.contury.id + ".rus58.com/images/",
        selectIndex: 0,
        subways: [],
        scaleWidth: "",
        scaleHeight: "",
        dataimg: "",
    },
    selectCity: function (e) {
        let that = this
        let imgUrl = that.data.rootImg+  that.data.subways[e.currentTarget.dataset.i].image + ".jpg"
       

        that.setData({
            dataimg: ""
        })
        that.setData({
            selectIndex: e.currentTarget.dataset.i,
            dataimg: imgUrl
        })
    },
    onLoad: function () {
        var that = this
        var res = wx.getSystemInfoSync();

        windowWidth = res.windowWidth;
        windowHeight = res.windowHeight - 160;
        that.setData({
            scaleHeight: windowHeight,
            scaleWidth: windowWidth,
        })
        that.getWappSubWays()
        
        wx.setNavigationBarTitle({
            title: app.globalData.contury.name +"地铁",
            success: function (res) {
            }
        })
    },
    getWappSubWays: function () {
        var that = this
        
        wx.request({
            url: app.globalData.rootUrl + 'ye/getWappSubWays',
            data: { "contury": app.globalData.contury.id },
            method: 'Post',
            success: function (res) {
                let imgUrl = that.data.rootImg + res.data[0].image + ".jpg"

                that.setData({
                    dataimg: ""
                })
                that.setData({
                    subways: res.data,

                    dataimg: imgUrl,
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
    openPic: function () {
        var that = this

        wx.previewImage({
            // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
            urls: [that.data.dataimg],
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
    //这里是图片加载完毕之后的信息，因为滑动手指距离会变，我们要跟着图片的长宽进行缩放，不能跟着屏幕的长宽进行缩放  
    imgload: function (e) {
        var originalWidth = e.detail.width;//图片原始宽  
        var originalHeight = e.detail.height;//图片原始高  
        var originalScale = originalHeight / originalWidth;//图片高宽比  
        var windowscale = windowHeight / windowWidth;//屏幕高宽比  
        if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比  
            //图片缩放后的宽为屏幕宽  
            baseWidth = windowWidth;

            baseHeight = (windowWidth * originalHeight) / originalWidth;
        } else {//图片高宽比大于屏幕高宽比  
            //图片缩放后的高为屏幕高  
            baseHeight = windowHeight;
            baseWidth = (windowHeight * originalWidth) / originalHeight;
        }
    },
    //两手指进行拖动了  
    movetap: function (event) {
        var e = event;
        if (e.touches.length == 2) {
            var xMove = e.touches[1].clientX - e.touches[0].clientX;
            var yMove = e.touches[1].clientY - e.touches[0].clientY;
            var distance = Math.sqrt(xMove * xMove + yMove * yMove);//两手指之间的距离   
            if (olddistance == 0) {
                olddistance = distance;
            }
            else {
                newdistance = distance; //第二次就可以计算它们的差值了  
                diffdistance = newdistance - olddistance;
                olddistance = newdistance;

                var newScale = oldscale + 0.005 * diffdistance;
                this.setData({
                    scaleHeight: newScale * baseHeight,
                    scaleWidth: newScale * baseWidth

                })
                oldscale = newScale;
                //更新比例  

            }
        }
    },
    endtap: function (event) {
        if (event.touches.length == 2) {
            olddistance = 0;
        }

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

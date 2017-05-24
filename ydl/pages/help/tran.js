//index.js
//获取应用实例

var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        imgPath: "/images/icon/",
        j: 1,//帧动画初始图片
        isSpeaking: false,//是否正在说话
        voices: [],//音频数组
        istraning: false,
        ishadtran: false,
        langType: 0,
        oritxt: "",
        soundndImage: 'sound2',
        copyImage: 'copy2',
        lngFrom: 0,
        lngTo: 1,
        openKeyword: false,
        needLangTTS: false,
        tranHistorys: [
        ],
        thisTranData: {},
 
        tranTopTxt: "",
    },


    onLoad: function () {
        var that = this
        that.setData({
            langType: app.globalData.contury.langType,
            needLangTTS: app.globalData.needLangTTS,

            tranTopTxt: app.globalData.tranTopTxt,

            thisTranData: {
                "ori": "",
                "tran": "",
                "langType": app.globalData.contury.langType,
                "date": new Date()
            },
        })
        wx.setNavigationBarTitle({
            title: app.globalData.tranTitle,
            success: function (res) {
            }
        })

        wx.onBackgroundAudioStop(function () {

            that.setData({
                soundndImage: 'sound2',
            })
        }),
            wx.hideKeyboard(function () {
            })
    },


    voiceClick: function () {
        var that = this
        wx.scanCode({
            success: (res) => {
            }
        })
    },
    copyClick: function () {
        var that = this

        that.setData({
            copyImage: 'copy1'
        })
        wx.setClipboardData({
            data: that.data.thisTranData.tran,
            success: function (res) {
                wx.showToast({
                    title: '翻译复制成功！',
                    icon: 'success',
                    duration: 2000
                })
                that.setData({
                    copyImage: 'copy2'
                })
            },
            fail: function (res) {
                // fail
            },
            complete: function (res) {
            }
        })
    },
    soundClick: function () {
        var that = this

        that.setData({
            soundndImage: 'sound1'
        })

        var jsonn = util.json2Form({
            "str": that.data.thisTranData.tran,
            "langType": that.data.langType
        });

        var urll = app.globalData.rootUrl + "Tran/getSound?" + jsonn;


        wx.request({
            url: urll,
            header: {
            },
            method: "GET",

            success: function (res) {
                wx.playBackgroundAudio({
                    //播放地址  
                    dataUrl: app.globalData.rootUrl + 'sound/' + res.data + '.mp3',
                    title: '这是测试',
                    coverImgUrl: '不需要图像URL',
                    success: function (res) {
                    },
                    fail: function (res) {
                    },
                    complete: function (res) {
                    }
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



    hadInput: function (e) {
        var that = this

        that.setData({
            oritxt: e.detail.value
        })
    },
    hadConfirm: function (e) {
        var that = this
        that.tran();
    },
    tranClick: function (e) {
        var that = this
        that.tran();
    },
    tran: function () {
        var that = this
        that.setData({
            openKeyword: false
        })
        that.setData({
            istraning: true
        })


        var jsonn = util.json2Form({
            "str": that.data.oritxt,
            "langType": that.data.langType
        });

        var urll = app.globalData.rootUrl + "Tran/txtTran?" + jsonn;


        wx.request({
            url: urll,
            header: {
            },
            method: "GET",

            success: function (res) {
                if (res.data !== null && res.data !== undefined && res.data !== '') {
                    that.setData({
                        thisTranData: {
                            "ori": that.data.oritxt,
                            "tran": res.data,
                            "langType": that.data.langType,
                            "date": new Date()
                        }
                    })
                    setTimeout(_ => {
                        that.setData({
                            thisTranData: {
                                "ori": that.data.oritxt,
                                "tran": res.data,
                                "langType": that.data.langType,
                                "date": new Date()
                            }
                        })
                    }, 300)

                    that.setData({
                        ishadtran: true
                    })
                }
                that.setData({
                    istraning: false
                })
            },
            fail: function (res) {
                that.setData({
                    istraning: false
                })
            },
            complete: function (res) {
                that.setData({
                    istraning: false
                })
                if (res == null || res.data == null) {
                    return;
                }
            }
        })
    },


    //点击播放录音
    gotoPlay: function (e) {
        var filePath = e.currentTarget.dataset.key;
        //点击开始播放
        wx.showToast({
            title: '开始播放',
            icon: 'success',
            duration: 1000
        })
        wx.playVoice({
            filePath: filePath,
            success: function () {
                wx.showToast({
                    title: '播放结束',
                    icon: 'success',
                    duration: 1000
                })
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

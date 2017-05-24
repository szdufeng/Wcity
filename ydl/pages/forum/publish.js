
var util = require('../../utils/util.js')
var SELECTED_MARKER_ID = 1; // 选取点ID

var app = getApp()
Page({
    data: {
        imgPath: "/images/icon/",
        tid: 0,
        name: "",
        userInfo: {},
        RemarkTxt: "",
        imagefiles: [],
        mypics: [],
        title: "",
        urlss: [],
        remark: "",
        chexkNext: true,
        infoTxt: "",
    },
    onLoad: function (option) {
        var that = this;
        that.setData({
            tid: option.tid,
            name: option.name,
            userInfo: wx.getStorageSync('userInfo') || {},
        })
    },
    delPic: function (e) {
        var that = this;
        wx.showModal({
            title: '系统提示',
            content: '确定要删除这张图片?',
            success: function (res) {
                if (res.confirm) {
                    util.removeByIndex(that.data.imagefiles, e.currentTarget.dataset.index);
                    that.setData({
                        imagefiles: that.data.imagefiles
                    })
                }
            }
        })
    },
    titleInput: function (e) {
        var that = this
        that.setData({
            title: e.detail.value
        })
    },
    remarkInput: function (e) {
        var that = this
        that.setData({
            remark: e.detail.value
        })
    },
    publishBtn: function () {
        var that = this;
        that.publish();
    },

    infoconfirm: function () {
        var that = this

        that.setData({
            chexkNext: true
        })
    },
    publish: function () {
        var that = this
        if (that.data.title == "请输入标题") {
            that.setData({
                chexkNext: false,
                infoTxt: "请输入标题"
            })
            return;
        }
        if (that.data.remark == "") {
            that.setData({
                chexkNext: false,
                infoTxt: "请输入帖子内容"
            })
            return;
        }
        var thisImage = that.data.imagefiles;

        // if (thisImage.length == 0) {
        //   that.setData({
        //     chexkNext: false,
        //     infoTxt: "请增加图片"
        //   })
        //   return;
        //}
        mypics: [];
        for (let i = 0; i < thisImage.length; i++) {
            that.setData({
                mypics: that.data.mypics.concat(
                    {
                        "path": thisImage[i].uoloadFile,
                        "minpath": thisImage[i].uoloadMiniFile,
                    }
                )
            })
        }

        var jsonn = {
            "country": app.globalData.contury.id,
            "mainType": that.data.tid,
            "openId": that.data.userInfo.openid,
            "title": that.data.title,
            "pics": that.data.mypics,
            "remark": that.data.remark
        };

        wx.showToast({
            title: '正在发布，请稍候',
            icon: 'loading',
            mask: true,
            duration: 10000
        })
        wx.request({
            url: app.globalData.rootUrl + 'forum/ph',
            data: jsonn,
            method: 'POST',
            success: function (res) {
                if (res.data == true) {
                    wx.showModal({
                        title: '温馨提示',
                        content: that.data.userInfo.nickName + ',您的' + that.data.name + '贴子发布成功！！',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: 'list?tid=' + that.data.tid + '&name=' + that.data.name,
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
                            }
                        }
                    })
                }
            },
            fail: function (res) {

            },
            complete: function (res) {
                wx.hideToast()
            }
        })
    },
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var successUp = 0;
                var failUp = 0;
                var length = res.tempFilePaths.length;
                var i = 0;
                that.uploadDIY(res.tempFilePaths, successUp, failUp, i, length);
            },
            fail: function (res) {
            },
            complete: function (res) {
            }
        })
    },
    previewImage: function (e) {
        var that = this;
        var thisImage = that.data.imagefiles;
        that.setData({
            urlss: []
        });

        for (let i = 0; i < thisImage.length; i++) {
            that.setData({
                urlss: that.data.urlss.concat(thisImage[i].localFile)
            });
        }
        wx.previewImage({
            current: e.currentTarget.dataset.url,
            urls: that.data.urlss
        })
    },
    uploadDIY: function (filePaths, successUp, failUp, i, length) {
        var that = this;
        wx.uploadFile({
            url: app.globalData.rootUrl + 'Upload/UploadPic',
            filePath: filePaths[i],
            name: 'fileData',
            success: (resp) => {
                successUp++;
                var j = JSON.parse(resp.data)
                if (j.msg != "err") {
                    that.setData({
                        imagefiles: that.data.imagefiles.concat({
                            "localFile": filePaths[i],
                            "uoloadFile": j.imgPath.path,
                            "uoloadMiniFile": j.imgPath.minpath
                        })
                    });
                }
            },
            fail: (res) => {
                failUp++;
            },
            complete: () => {
                i++;
                if (i == length) {
                    console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！');
                }
                else {  //递归调用uploadDIY函数
                    that.uploadDIY(filePaths, successUp, failUp, i, length);
                }
            },
        });
    },

})
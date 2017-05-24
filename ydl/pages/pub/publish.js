
var util = require('../../utils/util.js')
var SELECTED_MARKER_ID = 1; // 选取点ID

var app = getApp()
Page({
    data: {
        imgPath: "/images/icon/",
        mainType: 0,
        mainName: "",
        subType: 0,
        subName: "",
        project: {},
        subProjects: [],
        subProjectsStr: [],
        fromList: 0,
        subIndex: 0,
        userInfo: {},
        InputSelect: 0,
        RemarkTxt: "",
        needRemark: true,
        RemarkTitle: "",
        remarkColor1: "color:gray;word-break:break-all",
        remarkColor2: "color:gray;word-break:break-all",

        mainHeight: 0,
        imagefiles: [],
        mypics: [],
        title: "请输入标题",
        address: {
            "name": "",
            "address": "",
            "latitude": 0,
            "longitude": 0
        },
        citys: [],
        cityIndex: 0,
        person: "",
        tel: "",
        weixin: "",
        urlss: [],
        remark: "请输入备注说明",
        chexkNext: true,
        infoTxt: "",
    },
    subPickerChange: function (e) {
        var that = this;
        this.setData({
            subIndex: e.detail.value,
            subType: that.data.subProjects[e.detail.value].i
        })
    },
    bindPickerChange: function (e) {
        this.setData({
            cityIndex: e.detail.value
        })
    },
    onLoad: function (option) {
        var that = this;
        that.setData({
            citys: wx.getStorageSync('citys'),
            mainType: option.mainType,
            mainName: option.mainName,
            subType: option.subType,
            subName: option.subName,
            fromList: option.fromList,
            mainHeight: app.globalData.mainHeight - 70,
            userInfo: wx.getStorageSync('userInfo') || {},
        })
        var projects = wx.getStorageSync('projects')
        for (let j = 0; j < projects.length; j++) {
            if (that.data.mainType == projects[j].i) {
                that.setData({
                    project: projects[j],
                    subProjects: projects[j].sub
                });
                break;
            }
        }
        var la = []
        for (let j = 0; j < that.data.subProjects.length; j++) {
            la = la.concat(that.data.subProjects[j].name)
        }
        that.setData({
            subProjectsStr: la
        });
        if (that.data.fromList == 1) {
            that.setData({
                subType: that.data.subProjects[0].i
            });
        }
        wx.setNavigationBarTitle({
            title: that.data.mainName,
            success: function (res) {
                // success
            }
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
    remarkTap: function (e) {
        var that = this
        switch (e.currentTarget.dataset.n) {
            case 'title':
                that.setData({
                    InputSelect: 0,
                    needRemark: false,
                    RemarkTitle: "请输入标题",
                    RemarkTxt: (that.data.title == "请输入标题") ? "" : that.data.title
                })
                break
            case 'remark':
                that.setData({
                    InputSelect: 1,
                    needRemark: false,
                    RemarkTitle: "请输入备注说明",
                    RemarkTxt: (that.data.remark == "请输入备注说明") ? "" : that.data.remark
                })
                break
            default:
                param = !0
        }
    },
    remarkconfirm: function (e) {
        var that = this
        that.setData({
            needRemark: true
        })
    },
    remarkInput: function (e) {
        var that = this
        if (that.data.InputSelect == 0) {
            that.setData({
                remarkColor1: "color:black;word-break:break-all",
                title: e.detail.value
            })
        }
        if (that.data.InputSelect == 1) {
            that.setData({
                remarkColor2: "color:black;word-break:break-all",
                remark: e.detail.value
            })
        }
    },

    hadInput: function (e) {
        var that = this
        switch (e.currentTarget.dataset.n) {
            case 'person':
                that.setData({
                    person: e.detail.value
                })
                break
            case 'tel':
                that.setData({
                    tel: e.detail.value
                })
                break
            case 'weixin':
                that.setData({
                    weixin: e.detail.value
                })
                break
            default:
                param = !0
        }
    },
    publishBtn: function (e) {
        var that = this;
        that.publish();
    },

    infoconfirm: function (e) {
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
                infoTxt: "请输入发布内容"
            })
            return;
        }
        // if (that.data.address.address == "") {
        //   that.setData({
        //     chexkNext: false,
        //     infoTxt: "请选择地址"
        //   })
        //   return;
        // }
        if (that.data.person == "") {
            that.setData({
                chexkNext: false,
                infoTxt: "请输入联系人"
            })
            return;
        }
        if (that.data.tel == "") {
            that.setData({
                chexkNext: false,
                infoTxt: "请输入电话"
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
            "mainType": that.data.mainType,
            "subType": that.data.subType,
            "openId": that.data.userInfo.openid,
            "title": that.data.title,
            "city": that.data.citys[that.data.cityIndex],
            "address": that.data.address,
            "person": that.data.person,
            "tel": that.data.tel,
            "weixin": that.data.weixin,
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
            url: app.globalData.rootUrl + 'huPublish/ph',
            data: jsonn,
            method: 'POST',
            success: function (res) {
                if (res.data == true) {
                    wx.showModal({
                        title: '温馨提示',
                        content: that.data.userInfo.nickName + ',您的' + that.data.mainName + '信息发布成功！！',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: "../info/list?mainType=" + that.data.mainType + "&subType=0&mainName=" + that.data.mainName + "&subName=''",
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

    openMap: function (e) {
        var that = this;

        wx.chooseLocation({
            success: function (res) {
                that.setData({
                    address: {
                        "name": res.name,
                        "address": res.address,
                        "latitude": res.latitude,
                        "longitude": res.longitude
                    }
                })
            },
            cancel: function () {
            },
            fail: function () {
            },
            complete: function (res) {
            }
        })
    },
})

var util = require('../../utils/util.js')
var SELECTED_MARKER_ID = 1; // 选取点ID

var app = getApp()
Page({
    data: {
        imgPath: "/images/icon/",


        userInfo: {},
        InputSelect: 0,
        RemarkTxt: "",
        needRemark: true,
        RemarkTitle: "",
        remarkColor1: "color:gray;word-break:break-all",
        remarkColor2: "color:gray;word-break:break-all",

        makerImages: [],
        makerPics: [],
        productImages: [],
        ptoductPics: [],

        title: "请输入标题",
        address: {
            "name": "",
            "address": "",
            "latitude": 0,
            "longitude": 0
        },
        citys: [],
        cityIndex: 0,


        typeData: [],
        typeIndex: 0,
        typeDataStr: [],

        person: "",
        tel: "",
        dates: "",
        weixin: "",

        remark: "请输入备注说明",
        chexkNext: true,
        infoTxt: "",
        makerTypes: [
            { name: '1', value: '个人', checked: 'true' },
            { name: '2', value: '商家' },
            { name: '3', value: '经纪人' },
        ],
        sendTypes: [
            { name: '1', value: '上门自提', checked: 'true' },
            { name: '2', value: '快递送货' },
            { name: '3', value: '其它方式' },
        ],
        payTypes: [
            { name: '1', value: '在线支付', checked: 'true' },
            { name: '2', value: '现金支付' },
            { name: '3', value: '其它方式' },
        ],
        makerIndex: 0,
        sendIndex: 0,
        payIndex: 0,
    },
    typePickerChange: function (e) {
        var that = this;
        this.setData({
            typeIndex: e.detail.value,
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
            userInfo: wx.getStorageSync('userInfo') || {},
        })
        that.getType()
    },
    getType: function () {
        var that = this
        wx.request({
            url: app.globalData.rootUrl + 'ye/getmakerTypes',
            data: { "contury": app.globalData.contury.id },
            method: 'Post',
            success: function (res) {
                var la = []
                for (let j = 0; j < res.data.length; j++) {
                    la = la.concat(res.data[j].name)
                }
                that.setData({
                    typeData: res.data,
                    typeDataStr: la
                });
            },
            fail: function (res) {
                // fail
            },
            complete: function (res) {
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
            case 'dates':
                that.setData({
                    dates: e.detail.value
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
        if (that.data.dates == "") {
            that.setData({
                chexkNext: false,
                infoTxt: "请输入营业时间"
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
        if (that.data.address.address == "") {
            that.setData({
                chexkNext: false,
                infoTxt: "请选择地址"
            })
            return;
        }
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

        if (that.data.makerImages.length == 0) {
            that.setData({
                chexkNext: false,
                infoTxt: "请增加商家图片"
            })
            return;
        }
        if (that.data.productImages.length == 0) {
            that.setData({
                chexkNext: false,
                infoTxt: "请增加商品图片"
            })
            return;
        }
        let makerImagesForSave = []
        let productImagesForSave = []


        for (let i = 0; i < that.data.makerImages.length; i++) {
            makerImagesForSave = makerImagesForSave.concat(
                {
                    "path": that.data.makerImages[i].uoloadFile,
                    "minpath": that.data.makerImages[i].uoloadMiniFile,
                }
            )
        }

        for (let i = 0; i < that.data.productImages.length; i++) {
            productImagesForSave = productImagesForSave.concat(
                {
                    "path": that.data.productImages[i].uoloadFile,
                    "minpath": that.data.productImages[i].uoloadMiniFile,
                }
            )
        }

        var jsonn = {
            "country": app.globalData.contury.id,
            "mainType": that.data.typeData[that.data.typeIndex].tid,

            "openId": that.data.userInfo.openid,
            "title": that.data.title,
            "dates": that.data.dates,
            "city": that.data.citys[that.data.cityIndex],
            "address": that.data.address,
            "person": that.data.person,
            "tel": that.data.tel,
            "weixin": that.data.weixin,
            "makerPics": makerImagesForSave,
            "productPics": productImagesForSave,
            "remark": that.data.remark,

            "makerType": that.data.makerIndex,
            "sendType": that.data.sendIndex,
            "payType": that.data.payIndex,
        };

        wx.showToast({
            title: '正在发布，请稍候',
            icon: 'loading',
            mask: true,
            duration: 10000
        })
        wx.request({
            url: app.globalData.rootUrl + 'maker/ph',
            data: jsonn,
            method: 'POST',
            success: function (res) {
                if (res.data == true) {
                    wx.showModal({
                        title: '温馨提示',
                        content: that.data.userInfo.nickName + ',您的' + that.data.title + '发布成功！！',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: "list",
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
        let that = this;
        let t = e.currentTarget.dataset.t

        wx.chooseImage({
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var successUp = 0;
                var failUp = 0;
                var length = res.tempFilePaths.length;
                var i = 0;
                that.uploadDIY(res.tempFilePaths, successUp, failUp, i, length, t);
            },
            fail: function (res) {
            },
            complete: function (res) {
            }
        })
    },
    previewImage: function (e) {
        let that = this;
        let t = e.currentTarget.dataset.t
        let thisImage = [];

        if (t == "maker") {
            thisImage = that.data.makerImages;
        } if (t == "product") {
            thisImage = that.data.productImages;
        }
        let urlss = []


        for (let i = 0; i < thisImage.length; i++) {

            urlss = urlss.concat(thisImage[i].localFile)

        }
        wx.previewImage({
            current: e.currentTarget.dataset.url,
            urls: urlss
        })
    },
    delPic: function (e) {
        let that = this;
        let t = e.currentTarget.dataset.t
        wx.showModal({
            title: '系统提示',
            content: '确定要删除这张图片?',
            success: function (res) {
                if (res.confirm) {
                    if (t == "maker") {
                        util.removeByIndex(that.data.makerImages, e.currentTarget.dataset.index);
                        that.setData({
                            makerImages: that.data.makerImages
                        })
                    }
                    if (t == "product") {
                        util.removeByIndex(that.data.productImages, e.currentTarget.dataset.index);
                        that.setData({
                            productImages: that.data.productImages
                        })
                    }
                }
            }
        })
    },
    uploadDIY: function (filePaths, successUp, failUp, i, length, t) {
        var that = this;
        wx.uploadFile({
            url: app.globalData.rootUrl + 'Upload/UploadPic',
            filePath: filePaths[i],
            name: 'fileData',
            success: (resp) => {
                successUp++;
                var j = JSON.parse(resp.data)
                if (j.msg != "err") {
                    if (t == "maker") {
                        that.setData({
                            makerImages: that.data.makerImages.concat({
                                "localFile": filePaths[i],
                                "uoloadFile": j.imgPath.path,
                                "uoloadMiniFile": j.imgPath.minpath
                            })
                        });
                    }
                    if (t == "product") {
                        that.setData({
                            productImages: that.data.productImages.concat({
                                "localFile": filePaths[i],
                                "uoloadFile": j.imgPath.path,
                                "uoloadMiniFile": j.imgPath.minpath
                            })
                        });
                    }
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
                    that.uploadDIY(filePaths, successUp, failUp, i, length, t);
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
    radioChange: function (e) {
        let that = this;
        let t = e.currentTarget.dataset.t
        switch (t) {
            case "maker":
                this.setData({
                    makerIndex: e.detail.value,
                })
                break;
            case "send":
                this.setData({
                    sendIndex: e.detail.value,
                })
                break;
            case "pay":
                this.setData({
                    payIndex: e.detail.value,
                })
                break;
            default:
                break;
        }
    }
})
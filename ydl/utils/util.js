
var app = getApp()

function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}
function formatTimeHour(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()


    return [month, day].map(formatNumber).join('-') + " " + [hour].map(formatNumber).join(':')
}
function formatTimeMinutes(date) {
    var hour = date.getHours()


    return [hour, "00"].map(formatNumber).join(':')
}
function formatTimeDay(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    return [year, month, day].map(formatNumber).join('-')
}
function formatTimeMonth(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1

    return [year, month].map(formatNumber).join('-')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

module.exports = {
    json2Form: json2Form,
    formatTime: formatTime,
    removeByValue: removeByValue,
    removeByIndex: removeByIndex,
    formatTimeMonth: formatTimeMonth,
    formatTimeDay: formatTimeDay,
    formatTimeHour: formatTimeHour,
    formatTimeMinutes: formatTimeMinutes,
    setYpCount: setYpCount,
    setPhCount: setPhCount,
    setAdCount: setAdCount,
    setForumCount: setForumCount,
    setMakerCount: setMakerCount,
    getDateDiff: getDateDiff,
    userLogin: userLogin,
    GetDistance: GetDistance
}

function json2Form(json) {
    var str = [];
    for (var p in json) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }
    return str.join("&");
}

function removeByValue(arr, name) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].name == name) {
            arr.splice(i, 1);
            break;
        }
    }
}
function removeByIndex(arr, index) {
    for (var i = 0; i < arr.length; i++) {
        if (index == i) {
            arr.splice(i, 1);
            break;
        }
    }
}


function setAdCount(rootUrl,id, countType) {
    var jsonn = { "id": id, "type": countType };
     
    wx.request({
        url: rootUrl + 'Article/setCount',
        data: jsonn,
        method: 'Post',
        success: function (res) {
        },
        fail: function (res) {
            // fail
        },
        complete: function (res) {
        }
    })
}
function setPhCount(rootUrl,id, countType) {
    var jsonn = { "id": id, "type": countType };
    wx.request({
        url:  rootUrl + 'huPublish/setCount',
        data: jsonn,
        method: 'Post',
        success: function (res) {
        },
        fail: function (res) {
            // fail
        },
        complete: function (res) {
        }
    })
}
function setYpCount(rootUrl,contury, tid, countType) {
    var jsonn = { "contury": contury, "tid": tid, "type": countType };
    wx.request({
        url:  rootUrl + 'ye/setCount',
        data: jsonn,
        method: 'Post',
        success: function (res) {
        },
        fail: function (res) {
            // fail
        },
        complete: function (res) {
        }
    })
}
function setForumCount(rootUrl,  tid, countType) {
    var jsonn = { "id": tid, "type": countType };
    wx.request({
        url: rootUrl + 'forum/setCount',
        data: jsonn,
        method: 'Post',
        success: function (res) {
        },
        fail: function (res) {
            // fail
        },
        complete: function (res) {
        }
    })
}
function setMakerCount(rootUrl,  tid, countType) {
    var jsonn = {  "id": tid, "type": countType };
    wx.request({
        url: rootUrl + 'maker/setCount',
        data: jsonn,
        method: 'Post',
        success: function (res) {
        },
        fail: function (res) {
            // fail
        },
        complete: function (res) {
        }
    })
}
function userLogin(contury, rootUrl) {
    wx.login({
        success: function (res1) {
            if (res1.code) {
                var jsonn = { "c": contury, "jsc": res1.code };
                wx.request({
                    url: rootUrl + 'Upload/getOpenid',
                    method: 'Post',
                    data: jsonn,
                    success: function (res2) {
                        wx.getUserInfo({
                            success: function (res3) {
                                var objz = {}
                                objz.avatarUrl = res3.userInfo.avatarUrl
                                objz.nickName = res3.userInfo.nickName
                                objz.openid = res2.data
                                objz.gender = res3.userInfo.gender
                                objz.language = res3.userInfo.language
                                objz.city = res3.userInfo.city
                                objz.province = res3.userInfo.province
                                objz.country = res3.userInfo.country
                                objz.contury = contury

                                wx.setStorageSync('userInfo', objz);
                                wx.request({
                                    url: rootUrl + 'Upload/setWappUser',
                                    data: objz,
                                    method: 'Post',
                                    success: function (res) {
                                    },
                                    fail: function (res) {
                                        // fail
                                    },
                                    complete: function (res) {
                                    }
                                })
                            },
                            fail: function () {
                                wx.showModal({
                                    title: '警告',
                                    content: '您点击了拒绝授权，将无法正常使用功能体验，请程序重新进入。',
                                    success: function (res) {
                                    }
                                })
                            }
                        });
                    }
                })

            } else {
                console.log('获取用户登录态失败！' + res.errMsg)
            }
        }
    })
}

function getDateDiff(dateTimeStamp) {
    var result;
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return;
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
        if (monthC <= 12)
            result = "" + parseInt(monthC) + "月前";
        else {
            result = "" + parseInt(monthC / 12) + "年前";
        }
    }
    else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周前";
    }
    else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
    }
    else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
    }
    else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
    } else {
        result = "刚刚";
    }

    return result;
};

function Rad(d) {
    return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
}
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function GetDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = Rad(lat1);
    var radLat2 = Rad(lat2);
    var a = radLat1 - radLat2;
    var b = Rad(lng1) - Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000; //输出为公里
    //s=s.toFixed(4);
    return s;
}
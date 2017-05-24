//index.js
//获取应用实例

var util = require('../../utils/util.js')
var wxcharts = require('../../utils/wxcharts-min.js')

var app = getApp()
Page({
  data: {
    btnHourType: "default",
    btnDayType: "default",
    btnMonthType: "default",
    amount: 0,
    from: "",
    fromname: "",
    to: "",
    toname: "",
    windowWidth: 0,
    windowHeight: 0,
    trendByHour: {},
    trendByDay: {},
    trendByMonth: {}
  }, 
  onLoad: function (query) {
    var that = this
    that.setData({
      amount: query.amount,
      from: query.from,
      fromname: query.fromname,
      to: query.to,
      toname: query.toname,
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        });
      }
    })

    var jsonn = util.json2Form({
      "from": that.data.from,
      "to": that.data.to,
      "amount": that.data.amount,
    });

    var urll = app.globalData.rootUrl +"Currency/getCurrencyTrendences?" + jsonn;

    wx.request({
      url: urll,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success 
        that.setData({
          trendByHour: res.data[0].data,
          trendByDay: res.data[1].data,
          trendByMonth: res.data[2].data
        })
        that.wxchart(that.data.trendByDay, 2);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    });
  },
  bindhour: function () {
    var that = this
    that.wxchart(that.data.trendByHour, 1);
  },
  bindday: function () {
    var that = this
    that.wxchart(that.data.trendByDay, 2);
  },
  bindmonth: function () {
    var that = this
    that.wxchart(that.data.trendByMonth, 3);
  },
  wxchart: function (e, t) {
    var that = this


    const length = e.length;

    var times = new Array(length);
    var refePrices = new Array(length);

    var minrefePeice = 999999;
    var maxrefePeice = 0;

    for (let i = 0; i < length; i++) {
      var tt = new Date(parseInt(e[i].time.replace("/Date(", "").replace(")/", ""), 10)); 

      that.setData({
        btnHourType: "default",
        btnDayType: "default",
        btnMonthType: "default",
      });
      if (t == 2) {
        times[i] = util.formatTimeDay(tt);
        that.setData({
          btnDayType: "primary",
        });
      }

      if (t == 1) {
        times[i] = util.formatTimeHour(tt);
        that.setData({
          btnHourType: "primary",
        });
      }

      if (t == 3) {
        times[i] = util.formatTimeMonth(tt);
        that.setData({
          btnMonthType: "primary",
        });
      }

      if (e[i].refePrice > maxrefePeice) maxrefePeice = e[i].refePrice
      if (e[i].refePrice < minrefePeice) minrefePeice = e[i].refePrice


      refePrices[i] = e[i].refePrice;
    }

    new wxcharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: times,
      series: [{
        name: that.data.fromname + '金额(' + that.data.amount + ')',
        data: refePrices,
        format: function (val) {
          return val.toFixed(2);
        }
      }],
      yAxis: {
        title: that.data.toname + '金额',
        format: function (val) {
          return val.toFixed(3);
        },
        min: minrefePeice,
        max: maxrefePeice
      },
      width: that.data.windowWidth,
      height: 400
    });
  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }

});

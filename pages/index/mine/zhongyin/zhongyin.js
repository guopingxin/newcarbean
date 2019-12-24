// pages/index/mine/zhongyin/zhongyin.js
var app = getApp();

// 引入SDK核心类
var QQMapWX = require('../../../../qqmap-wx-jssdk.js');

// 实例化API核心类
var demo = new QQMapWX({
  key: 'OEIBZ-MF2HD-B6U4J-HRVAP-AASNO-CMBEQ' // 必填
});

import {
  Servicestype
} from '../../../services/servicestype/servicestypemode.js';
import {
  Base
} from '../../../../utils/base.js';

import {
  Config
} from '../../../../utils/config.js'

import {
  Servicesdetails
} from '../../../services/servicesdetails/servicesdetailsmode.js'

import {
  Paystyle
} from '../../../services/paystyle/paystylemode.js'

var paystyle = new Paystyle();
var servicesdetails = new Servicesdetails();
var base = new Base();

var servicestype = new Servicestype();



Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: true,
    // region: ['陕西省', '全部', '全部'],
    // customItem: '全部',
    servicelist: [],
    // storeType: ['全部门店', '4s门店', '快修门店', '改装门店', '洗车美容', '道路救援', '轮胎门店'],
    // sortArr: ['默认排序', '附近优先', '评分最高', '销量优先'],
    // sortIndex: 0,
    // storeIndex: 0,
    total: [],
    noservice1: true,
    server: '',
    tags: '',
    hour: 0,
    min: 0,
    second: 0,
    hour1: "00",
    min1: "00",
    second1: '00',
    imgUrl: 'http://www.feecgo.com/level',
    pageOne: true,
    payFunction: 'free'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    console.log("eeee", options)

    // that.data.options = options;

    that.data.serviceitemclassify = options.classifyid;
    that.data.userid = app.globalData.userInfo.id;
    that.data.policyid = options.policyid;
    that.data.serviceId = options.serviceId
    that.data.menu = options.menu
    that.setData({
      frequency: options.frequency
    })

    console.log("GGGG",options.frequency);
    // if (parseInt(options.num) <= 0) {

    //   that.data.paytype = 1
    // } else {
    //   that.data.paytype = 2
    // }

    // 倒计时
    that.data.time = setInterval(function () {
      that.data.second++
      if (that.data.second < 10) {
        that.setData({
          second1: "0" + that.data.second
        })
      } else {

        if (that.data.second >= 60) {
          that.data.second = 0
          that.data.min = that.data.min + 1

          if (that.data.min < 10) {
            that.setData({
              second1: "0" + that.data.second,
              min1: "0" + that.data.min
            })
          } else {

            if (that.data.min >= 60) {
              that.data.min = 0;
              that.data.hour = that.data.hour + 1;

              if (that.data.hour < 10) {
                that.setData({
                  second1: "0" + that.data.second,
                  min1: "0" + that.data.min,
                  hour1: "0" + that.data.hour
                })
              } else {
                that.setData({
                  second1: "0" + that.data.second,
                  min1: "0" + that.data.min,
                  hour1: that.data.hour
                })

              }

            } else {

              that.setData({
                second1: "0" + that.data.second,
                min1: that.data.min
              })
            }
          }
        } else {
          that.setData({
            second1: that.data.second
          })
        }

      }

    }, 1000)

    // 获取地理位置
    wx.getLocation({
      type: "gcj02",
      altitude: true,
      success(res) {
        base.reverseGeocoder(demo, res.latitude, res.longitude, res => {

          var region = [];

          region.push(res.province);
          region.push(res.city);
          region.push(res.district);

          that.setData({
            region: region
          })

          that.data.total = [];

          var server = options.server;

          app.globalData.zhongyinserver = options.server;

          // if (server == "代办服务") {

          //   that.data.keywords = "代办维修";
          //   that.data.page = 1;
          //   console.log("ddd", server);

          //   that.getservicelistcommond();

          // } else {

          that.data.keywords = server;
          that.data.page = 1;
          // 河南中银（拖车、搭电救援）
          if (that.data.serviceId == 4065 && that.data.serviceitemclassify == '21') {
            console.log('进入指定服务商下单页面')
            that.heNanServiceOrder();
          } else {
            console.log('陕西服务商下单页面')
            that.getservicelistcommond();
          }
          // }

        })
      },
      fail: function (res) {
        that.setData({
          locationshow: true
        })
      }
    })

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
  },

  radioChange: function (e) {
    console.log('选择微信支付还是免费次数支付', e.detail.value)
    this.setData({
      payFunction: e.detail.value
    })
  },

  // 下单成功之后的支付
  sureToPay() {
    if (this.data.payFunction == 'free') {
      paystyle.policyPay(this.data.policyid, res => {
        console.log('免费次数', res)
        if (res.status == 1) {
          console.log("免费次数支付成功返回", res)
          clearInterval(this.data.time)
          wx.navigateTo({
            url: '../zhongyinorder/zhongyinorder'
          })
        } else {
          wx.showToast({
            title: res.msg ? res.msg : '支付失败',
            icon: 'none'
          })
        }
      })
    } else if (this.data.payFunction == 'wx') {
      paystyle.wxPay(res => {
        console.log('微信支付', res)
        if (res.status == 1) {
          this.data.payInfor = res.result

          wx.requestPayment({
            'timeStamp': this.data.payInfor.timeStamp.toString(),
            'nonceStr': this.data.payInfor.nonceStr,
            'package': this.data.payInfor.package,
            'signType': 'MD5',
            'paySign': this.data.payInfor.sign,
            'success': function (res) {

              paystyle.systemOk(res => {
                console.log("支付成功", res);
                if (res.status == 1) {

                  clearInterval(this.data.time)
                  wx.redirectTo({
                    url: '../zhongyinorder/zhongyinorder',
                  })
                  // wx.showToast({
                  //   title: '支付成功',
                  // })
                }
              })
            },
            'fail': function (res) {
              clearInterval(this.data.time)
              wx.showToast({
                title: '支付失败',
              })
            },
            'complete': function (res) { }
          });

        }
      })
    }
  },

  // 河南中银（拖车、搭电救援下单）
  heNanServiceOrder() {
    var that = this
    // 获取服务商详情
    app.globalData.serviceid = 4066;
    servicesdetails.getServerDetail(4066, res => {
      console.log(res.data.service)
      if (res.data.project) {
        for (var item in res.data.project) {
          for (var i in res.data.project[item]) {
            if (i == "classify_id") {
              if (that.data.serviceitemclassify == res.data.project[item][i]) {
                that.data.serviceitemid = res.data.project[item].id
                app.globalData.serviceclassify = res.data.project[item].classify // 商品描述
                app.globalData.serviceplatform_price = res.data.project[item].platform_price
                that.setData({
                  serviceitemprice: res.data.project[item].platform_price
                })
                // 下单
                servicesdetails.setOrder(that, response => {
                  console.log("response", response)
                  if (response.status == 1) {
                    clearInterval(that.data.time)
                    that.setData({
                      pageOne: false
                    })
                    app.globalData.serviceorderid = response.order.id
                    app.globalData.seviceorderno = response.order.order_no
                    app.globalData.servicetime = response.order.add_time


                  } else {
                    wx.showToast({
                      title: response.msg,
                      icon: "none",
                      duration: 3000
                    })

                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 3000)
                  }
                })
              }
            }
          }
        }
      } else {
        wx.showToast({
          title: "服务商没有添加服务项目",
          icon: "none",
          duration: 3000
        })

        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 3000)
      }
      let arrServiceList = []
      arrServiceList.push(res.data.service)
      // 计算服务商距离
      base.distance(demo, arrServiceList, (data) => {
        app.globalData.zhongyinserviceitem = data     
      })
    })
  },

  // 下单（最近服务商）
  getservicelistcommond: function () {

    var that = this;

    // app.globalData.region = that.data.region[2];
    app.globalData.keywords = that.data.keywords;
    // app.globalData.typeStore = that.data.typeStore
    // that.data.searchKeys = '',

    // 获取服务商
    servicestype.getServiceList(that, res => {
      // console.log("RRRR", res);
      // wx.hideNavigationBarLoading();
      // wx.stopPullDownRefresh() //停止下拉刷新

      if (res.status == 0) {

        // that.setData({
        //   noservice1: false,
        //   servicelist: []
        // })

        wx.showToast({
          title: res.msg,
          none: 'none',
          duration: 3000
        })

        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 3000)

      } else {

        that.data.servicelist = res.service
        console.log("888", res.service);
        var temparr = [];

        // 如果没有服务商
        if (res.service.length == 0) {

          // that.setData({
          //   noservice1: false,
          //   servicelist: that.data.total
          // })

          wx.showToast({
            title: '该区域没有合作服务商,请移驾到其他区域下单!',
            icon: 'none',
            duration: 3000
          })

          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 3000)

        } else {
          // 计算服务商距离
          base.distance(demo, res.service, (data) => {
            // console.log("fff", data)

            temparr.push(data);

            if (temparr.length == that.data.servicelist.length) {

              base.sort(temparr, res => {
                that.data.total = that.data.total.concat(temparr);
                app.globalData.zhongyinserviceitem = that.data.total[0]
                // 获取服务商详情
                servicesdetails.getServerDetail(that.data.total[0].id, res => {
                  console.log(res);
                  app.globalData.serviceid = that.data.total[0].id;

                  if (res.data.project) {
                    for (var item in res.data.project) {
                      for (var i in res.data.project[item]) {
                        if (i == "classify_id") {
                          if (that.data.serviceitemclassify == res.data.project[item][i]) {
                            that.data.serviceitemid = res.data.project[item].id
                            app.globalData.serviceclassify = res.data.project[item].classify // 商品描述
                            app.globalData.serviceplatform_price = res.data.project[item].platform_price
                            that.setData({
                              serviceitemprice: res.data.project[item].platform_price
                            })
                            // 下单
                            servicesdetails.setOrder(that, response => {
                              console.log("response", response)
                              if (response.status == 1) {
                                clearInterval(that.data.time)
                                that.setData({
                                  pageOne: false
                                })
                                app.globalData.serviceorderid = response.order.id
                                app.globalData.seviceorderno = response.order.order_no
                                app.globalData.servicetime = response.order.add_time


                              } else {
                                wx.showToast({
                                  title: response.msg,
                                  icon: "none",
                                  duration: 3000
                                })

                                setTimeout(function () {
                                  wx.navigateBack({
                                    delta: 1
                                  })
                                }, 3000)
                              }
                            })
                          }
                        }
                      }
                    }
                  } else {
                    wx.showToast({
                      title: "服务商没有添加服务项目",
                      icon: "none",
                      duration: 3000
                    })

                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 3000)
                  }
                })

                // that.setData({
                //   servicelist: that.data.total,
                //   hostName: Config.restUrl,
                //   noservice1: true
                // })
              })
            }
          })
        }
      }
    })
  },


})
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
    imgUrl:'http://www.feecgo.com/level'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    console.log("eeee", options)

    // that.data.options = options;

    that.data.serviceitemclassify = options.classifyid;
    that.data.userid = app.globalData.userInfo.id;
    that.data.policyid = options.policyid;

    // if (parseInt(options.num) <= 0) {

    //   that.data.paytype = 1
    // } else {
    //   that.data.paytype = 2
    // }


    that.data.time = setInterval(function() {
      that.data.second++
        if (that.data.second < 10) {
          that.setData({
            second1: "0" + that.data.second
          })
        } else {

          if (that.data.second >= 60) {
            that.data.second = 0
            that.data.min = that.data.min + 1

            if (that.data.min<10){
              that.setData({
                second1: "0" + that.data.second,
                min1: "0" + that.data.min
              })
            }else{

              if (that.data.min >= 60) {
                that.data.min = 0;
                that.data.hour = that.data.hour + 1;

                if (that.data.hour<10){
                  that.setData({
                    second1: "0" + that.data.second,
                    min1: "0" + that.data.min,
                    hour1: "0" + that.data.hour 
                  })
                }else{
                  that.setData({
                    second1: "0" + that.data.second,
                    min1: "0" + that.data.min,
                    hour1: that.data.hour
                  })

                }

              }else{

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
            that.getservicelistcommond();
          // }

        })
      },
      fail: function(res) {

        console.log("res222222", res)
        that.setData({
          locationshow: true
        })
      }
    })

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;


  },

  getservicelistcommond: function() {

    var that = this;

    // app.globalData.region = that.data.region[2];
    app.globalData.keywords = that.data.keywords;
    // app.globalData.typeStore = that.data.typeStore
    // that.data.searchKeys = '',

    servicestype.getServiceList(that, res => {

      console.log("RRRR", res);

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

        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 3000)

      } else {

        that.data.servicelist = res.service
        console.log("888", res.service);
        var temparr = [];

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

          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 3000)

        } else {

          base.distance(demo, res.service, (data) => {

            // console.log("fff", data)

            temparr.push(data);

            if (temparr.length == that.data.servicelist.length) {

              base.sort(temparr, res => {
                that.data.total = that.data.total.concat(temparr);
                console.log(that.data.total[0]);
                app.globalData.zhongyinserviceitem = that.data.total[0]
                servicesdetails.getServerDetail(that.data.total[0].id, res => {
                  console.log(res);
                  app.globalData.serviceid = that.data.total[0].id;

                  if (res.data.project) {
                    for (var item in res.data.project) {
                      for (var i in res.data.project[item]) {
                        if (i == "classify_id") {
                          if (that.data.serviceitemclassify == res.data.project[item][i]) {
                            that.data.serviceitemid = res.data.project[item].id
                            that.data.serviceitemprice = res.data.project[item].platform_price
                            app.globalData.serviceclassify = res.data.project[item].classify // 商品描述
                            app.globalData.serviceplatform_price = res.data.project[item].platform_price
                          
                            servicesdetails.setOrder(that, response => {
                              console.log("response", response)
                              if (response.status == 1) {
                                app.globalData.serviceorderid = response.order.id
                                app.globalData.seviceorderno = response.order.order_no
                                app.globalData.servicetime = response.order.add_time
                                // if(that.data.paytype == 2){
                                paystyle.policyPay(that.data.policyid, res1 => {
                                  console.log("res1", res1);
                                  clearInterval(that.data.time);
                                  wx.navigateTo({
                                    url: '../zhongyinorder/zhongyinorder'
                                  })
                                  // wx.redirectTo({
                                  //   url: '../zhongyinorder/zhongyinorder',
                                  // })
                                })
                                // }else{
                                //   paystyle.wxPay(res=>{
                                //     if (res.status == 1) {
                                //       that.data.payInfor = res.result;

                                //       wx.requestPayment({
                                //         'timeStamp': that.data.payInfor.timeStamp.toString(),
                                //         'nonceStr': that.data.payInfor.nonceStr,
                                //         'package': that.data.payInfor.package,
                                //         'signType': 'MD5',
                                //         'paySign': that.data.payInfor.sign,
                                //         'success': function (res) {

                                //           paystyle.systemOk(res => {
                                //             console.log("支付成功", res);
                                //             if (res.status == 1) {

                                //               clearInterval(that.data.time)
                                //               wx.redirectTo({
                                //                 url: '../zhongyinorder/zhongyinorder',
                                //               })
                                //               // wx.showToast({
                                //               //   title: '支付成功',
                                //               // })
                                //             }
                                //           })
                                //         },
                                //         'fail': function (res) {
                                //           clearInterval(that.data.time)
                                //           wx.showToast({
                                //             title: '支付失败',
                                //           })
                                //         },
                                //         'complete': function (res) {
                                //         }
                                //       });

                                //     }
                                //   })

                                // }

                              } else {
                                wx.showToast({
                                  title: response.msg,
                                  icon: "none",
                                  duration: 3000
                                })

                                setTimeout(function() {
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

                    setTimeout(function() {
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
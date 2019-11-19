// pages/index/mine/zhongyinorder/zhongyin.js
var app = getApp();
import {
  Payment
} from '../../../services/payment/paymentmode.js'

import { Servicesdetails } from '../../../services/servicesdetails/servicesdetailsmode.js';
import { Base } from '../../../../utils/base.js';
var QQMapWX = require('../../../../qqmap-wx-jssdk.js');
// 实例化API核心类
var demo = new QQMapWX({
  key: 'OEIBZ-MF2HD-B6U4J-HRVAP-AASNO-CMBEQ' // 必填
});

var payment = new Payment();
var servicesdetails = new Servicesdetails();
var base = new Base();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    zhongyinserviceitem:{},
    imgUrl:'http://www.feecgo.com/level'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (app.globalData.zhongyinserver == '洗车'){
      app.globalData.zhongyinserver = '清洗漆面'
    }

    var that = this;
    that.setData({
      zhongyinserviceitem: app.globalData.zhongyinserviceitem,
      server:app.globalData.zhongyinserver,
      ordertime: app.globalData.servicetime,
      orderno: app.globalData.seviceorderno
    })
  },

  //复制
  copyTBL: function (e) {
    console.log(e.currentTarget.id)
    wx.setClipboardData({
      data: e.currentTarget.id,
      success: function (res) {
        // self.setData({copyTip:true}),
        wx.showToast({
          title: '复制成功',
        })
      }
    });
  },

  //取消订单
  cancelorder: function (e) {
    var orderid = app.globalData.serviceorderid;

    payment.cancelorder(orderid, res => {
      console.log("￥￥", res);

      if (res.status == 1) {

        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];

        wx.showToast({
          title: '订单取消成功',
        })

        // prevPage.setData({
        //   cancelorder: '订单取消'
        // })

        setTimeout(function(){
          wx.navigateBack({
            delta: 2
          })
        },2000)  
      }
    });
  },

  //详情
  todetail: function (e) {
    var that = this;
    var serviceid = that.data.zhongyinserviceitem.id;

    servicesdetails.getServerDetail(serviceid, res => {

      if (res.status == 1) {
        var short_name = res.data.service.short_name;
        var order = res.data.service.order;
        var name = res.data.service.name;
        var comment = res.data.service.comment;
        var type = res.data.service.type;
        var address = res.data.service.address;

        base.geocoder(demo, address, response => {

          var location = response;
          base.calculateDistance(demo, response.lat, response.lng, response1 => {

            var distance = (response1 / 1000).toFixed(1);

            wx.navigateTo({
              url: '../../../services/servicesdetails/servicesdetails?detail=' + serviceid + "&shopname=" + short_name + '&order=' + order + '&comment=' + comment + '&distance=' + distance + '&name=' + name + '&type=' + type + '&address=' + address + '&lng=' + JSON.stringify(location),
            })

          })
        })

      }
    })
  },

  //导航
  openMap: function (e) {
    var that = this

    console.log("dddd", that.data.zhongyinserviceitem.location);
    if (that.data.zhongyinserviceitem.location) {
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude


          // wx.openLocation({
          //   latitude: that.data.zhongyinserviceitem.location.lat,
          //   longitude: that.data.zhongyinserviceitem.location.lng,
          //   scale: 28,
          //   name: e.currentTarget.dataset.name,
          //   address: e.currentTarget.id
          // })


          demo.direction({
            mode: 'driving',
            from: {
              latitude: latitude,
              longitude: longitude
            },
            to: {
              latitude: that.data.zhongyinserviceitem.location.lat,
              longitude: that.data.zhongyinserviceitem.location.lng,
            },
            success: res => {
              console.log(res)

              var ret = res;        
              var coors = ret.result.routes[0].polyline;
              app.globalData.coors = coors;
              app.globalData.mapmarker = [{
                latitude: that.data.zhongyinserviceitem.location.lat,
                longitude: that.data.zhongyinserviceitem.location.lng,
                iconPath:'/images/position.png',
                callout:{
                  content:'终点位置',
                  display: 'ALWAYS'
                }
              },{
                  latitude: latitude,
                  longitude: longitude,
                  iconPath: '/images/position.png',
                  callout: {
                    content: '当前起始位置',
                    display: 'ALWAYS'
                    }
              }]
              wx.navigateTo({
                url: './navigation/navigation',
              })
            },
            fail: res => {
              console.log(res)
            }
          })

        }
      })
    } else {

      console.log("没有经纬度");
    }

  },

  backpolic:function(){
    wx.navigateBack({
      delta: 2
    })
  }
})
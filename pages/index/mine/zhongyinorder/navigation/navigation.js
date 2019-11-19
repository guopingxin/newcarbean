// pages/index/mine/zhongyinorder/navigation/navigation.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that= this

    var coors = app.globalData.coors;
    var pl = [];

    //坐标解压（返回的点串坐标，通过前向差分进行压缩）

    var kr = 1000000;
    for (var i = 2; i < coors.length; i++) {
      coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
    }         //将解压后的坐标放入点串数组pl中

    for (var i = 0; i < coors.length; i += 2) {
      pl.push({
        latitude: coors[i],
        longitude: coors[i + 1]
      })
    }
    console.log(pl)         //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
    that.setData({
      latitude: pl[0].latitude,
      longitude: pl[0].longitude,
      polyline: [{
        points: pl,
        color: '#32CD32',
        width: 10
      }],
      markers: app.globalData.mapmarker
    })
  },
 
})
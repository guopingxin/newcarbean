// pages/henanzhongyin/henanzhongyin.js
// 引入SDK核心类
var QQMapWX = require('../../qqmap-wx-jssdk.js');

// 实例化API核心类
var demo = new QQMapWX({
  key: 'OEIBZ-MF2HD-B6U4J-HRVAP-AASNO-CMBEQ' // 必填
});

import {
  Base
} from '../../utils/base.js';
var base = new Base();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    wholeAddress: ["郑州市金水区花园路40号中国银行办公主楼6-8层", "许昌市建设路1488号中国银行3楼", "焦作市解放东路61号中国银行山阳支行办公楼4楼", "洛阳市西工区中州中路439号中国银行洛阳分行大楼19楼", "新乡市和平大道中段1号中国银行9楼", "河南省南阳市七一路124号","安阳市文峰大道立交桥西62号路北2层"],
    distanceArray:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getLocation({
      success: function(res) {
        that.data.latitude = res.latitude;
        that.data.longitude = res.longitude;
      },
    })

    that.data.wholeAddress.forEach((item,index)=>{

      base.geocoder(demo, item, res => {

        console.log("rrrrr",res);

        base.calculateDistance(demo, res.lat, res.lng, response => {
          
          var distance = (response / 1000).toFixed(1);
          
          that.data.distanceArray.push(distance)
          that.setData({
            distanceArray: that.data.distanceArray
          })

          console.log("ddd", that.data.distanceArray);
        })
      })
    })

    

    
    
    
  },

  onShow:function(){
    var that = this
    

    
  },



  //打电话
  callphone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },

  //导航
  navigation:function(e){

    base.geocoder(demo, e.currentTarget.dataset.address, res => {
      
      wx.openLocation({
        latitude: res.lat,
        longitude: res.lng,
        scale: 28,
        name: e.currentTarget.dataset.name,
        address: e.currentTarget.dataset.address
      })
    })
  },

})
// pages/common/member/examine/search/search.js
var QQMapWX = require('../../../../../qqmap-wx-jssdk.js');
var address = new QQMapWX({
  key: 'OEIBZ-MF2HD-B6U4J-HRVAP-AASNO-CMBEQ'
})

import location from '../../../../../utils/area.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchlist:[],
    isSearch: true,
    searchKeys:'nianshen'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onConfirm(){

    var that = this;
    that.setData({
      isSearch:false
    })


    address.search({
      keyword:this.data.title,
      success: function (res) {
        console.log("res",res);
        that.setData({
          searchlist:res.data
        })
      }
    })



    // location.getLocetion(that).then(function (that) {

    //   that.setData({
    //     latitude: app.globalData.location.latLong.lat,
    //     longitude: app.globalData.location.latLong.long,
    //     city: app.globalData.location.city,
    //     address: app.globalData.location.address,
    //     etitle: app.globalData.location.poistitle
    //   })
    // })

  },

  onCancel(){
    this.setData({
      isSearch: true
    })
  },

  onInput(e){
    this.setData({
      title: e.detail.value
    })
  }

  
})
// pages/common/member/examine/examineloaction/examinelocation.js
var QQMapWX = require('../../../../../qqmap-wx-jssdk.js'); 
var address = new QQMapWX({
  key: 'OEIBZ-MF2HD-B6U4J-HRVAP-AASNO-CMBEQ'
})

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
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        let lat = res.latitude
        let lng = res.longitude
        address.reverseGeocoder({
          location: lat + "," + lng || '',
          get_poi: 1,
          success: res => {
            let addList = []
            res.result.pois.forEach((item, index) => {
              addList.push({
                title: item.title,
                id: item.id,
                latitude: item.location.lat,
                longitude: item.location.lng,
                iconPath: '/images/position.png', //图标路径
                width: 20,
                height: 20
              })
            })

            this.setData({
              markers: addList,
              imageId: 0,
              poi: {
                latitude: res.result.location.lat,
                longitude: res.result.location.lng
              },
            })
          }
        })
      },
    })
  },

  // 选择地址
  selectlocation(e) {
    let locationid = e.target.dataset.licationid
    this.data.markers.forEach((item, index) => {
      if (locationid == index) {
        console.log(item.title)
        this.setData({
          imageId: locationid,
          imageTitle: item.title
        })
      }
    })
  },

  onConfirm() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
      fixedLossAdd: this.data.markers[this.data.imageId].title
    })
    wx.navigateBack({
      delta: 1
    })
  },


  onSearching(){
    wx.navigateTo({
      url: '../search/search',
    })
  }


})
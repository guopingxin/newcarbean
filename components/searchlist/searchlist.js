var app = getApp();

Component({

  properties: {
    searchlist: Array,
    searchkey:String
  },

  data: {

  },

  methods: {

    onService:function(e){

      var that = this;
      // wx.navigateTo({
      //   url: '/pages/services/servicestype/servicestype?server=' + that.properties.searchkey,
      // })



      var detail = e.currentTarget.dataset.item;

      app.globalData.servicelistitem = detail;
      console.log("eee", detail);

      app.globalData.serviceface = detail.face;

      if (!detail.location){
        detail.location={}
      }

      wx.navigateTo({
          url: '../servicesdetails/servicesdetails?detail=' + detail.id + "&shopname=" + detail.short_name + '&order=' + detail.order + '&comment=' + detail.comment + '&distance=' + detail.distance + '&name=' + detail.name + '&type=' + detail.type + '&address=' + detail.address + '&lng=' + JSON.stringify(detail.location)
        })

       

    },

    onNianshen(e){
      var that = this;
      var address = e.currentTarget.dataset.item;

      var pages = getCurrentPages();
      let prevPage = pages[pages.length - 3]  //上上一个页面
      prevPage.setData({
        fixedLossAdd: address
      })
      wx.navigateBack({
        delta: 2
      })  
    }
  }

})
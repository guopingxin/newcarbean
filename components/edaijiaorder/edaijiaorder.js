// 活动项目
Component({
  properties: {
    eorder:Array
  },
  data: {
    imgUrl:"http://www.feecgo.com/level"
  },
  methods: {

    todetail:function(e){  

      var orderid = e.currentTarget.dataset.detail.orderId;
      wx.navigateTo({
        url: '../eorderdetail/eorderdetail?orderid=' + orderid,
      })
    }
  }
})
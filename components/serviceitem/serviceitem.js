var app = getApp();

Component({

  properties: {
    serviceitem: Array,
    stores:Array
  },

  data: {
    ischecked:false
  },

  methods: {

    serviceitemdetail:function(e){

      var that = this

      var classify_id = e.currentTarget.dataset.itemdetails.classify_id;
      var projectid = e.currentTarget.dataset.itemdetails.id;
      var market_price = e.currentTarget.dataset.itemdetails.market_price;
      var platform_price = e.currentTarget.dataset.itemdetails.platform_price;
      var order = e.currentTarget.dataset.itemdetails.order;
      var classify = e.currentTarget.dataset.itemdetails.classify;


      app.globalData.servicedetailindex = e.currentTarget.dataset.index

      console.log("444", e.currentTarget.dataset);

      that.setData({
        serviceid: e.currentTarget.dataset.itemdetails.id,
        ischecked: true
      })
       

      wx.navigateTo({
        url: '../itemdetails/itemdetails?classify_id=' + classify_id + '&projectid=' + projectid + '&market_price=' + market_price + '&platform_price=' + platform_price + '&order=' + order + '&stores=' + that.properties.stores + '&classify=' + classify,
      })
    },

    oncheck:function(e){
      console.log(e);
      var that = this;

      app.globalData.servicedetailindex = e.currentTarget.dataset.index

     
        that.setData({
          serviceid: e.currentTarget.dataset.id,
          ischecked:true
        })
     
  
      // that.triggerEvent('confirm', {
      //   name: e.detail.name,
      //   telphone: e.detail.telphone
      // })

      that.triggerEvent('oncheck',{
        serviceitemid: e.currentTarget.dataset.id,
        serviceitemclassify: e.currentTarget.dataset.classify,
        serviceitemprice: e.currentTarget.dataset.price,
        serviceitemmarketprice: e.currentTarget.dataset.market_price,
        serviceprojectname: e.currentTarget.dataset.serviceprojectname
      })

    }

  }
})
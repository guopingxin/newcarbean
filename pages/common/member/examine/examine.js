// pages/common/member/examine/examine.js
var imgId1 = 0;
var imgId2 = 0;
var imgId3 = 0;
var imgId4 = 0;

import common from '../../../../utils/common.js';
import {
  Member
} from "../../models/member.js";
var member = new Member();
var app =getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartype: ['豫', '陕'],
    cartypeinddex: 0,
    text: '上门取车',
    onselectedimg: true,
    imagescell1: {},
    imagescell2: {},
    imagescell3: {},
    imagescell4: {},
    allimagescell: ['', '', '', ''],
    car_policy: '',
    driver_license: '',
    vehicle_license: '',
    type: 0,
    fileNameTemp: '',
    fixedLossAdd: '',
    addtext:"取车地址",
    province:"河南"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (app.globalData.province == '陕西'){
      this.setData({
        cartypeinddex:1,
        province: app.globalData.province,
      })
      this.data.service_id = 4037     //陕西文虎服务商

    }else{
      this.data.service_id = 4090     //河南审车之家
    }
    
  },

  onShow: function() {

    console.log("1111", this.data.fixedLossAdd);

    this.setData({
      fixedLossAdd: this.data.fixedLossAdd ? this.data.fixedLossAdd : '',
    })


  },

  bindOrdinaryChange(e) {
    this.setData({
      cartypeinddex: e.detail.value
    })
  },

  onselecttype(e) {

    if (e.currentTarget.dataset.type == '1') {
      this.setData({
        onselectedimg: true,
        text: '上门取车',
        type: 0,
        addtext:"取车地址"
      })
    } else {
      this.setData({
        onselectedimg: false,
        text: '上门取件',
        type: 1,
        addtext: "详细地址"
      })
    }
  },

  //选择位置
  onselectaddress() {
    wx.navigateTo({
      url: './examinelocation/examinelocation',
    })
  },

  //拍照
  onselectimg(e) {
    var that = this;
    var imagetype = e.currentTarget.dataset.imagetype;

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        if (imagetype == "driving") {

          that.data.imagescell1 = {
            id: imgId1++,
            path: res.tempFilePaths[0],
            key: "driving"
          }

          that.setData({
            imagescell1: that.data.imagescell1
          })

          that.data.allimagescell.splice(0, 1, that.data.imagescell1)

        } else if (imagetype == "drivingcopyfront") {

          that.data.imagescell2 = {
            id: imgId2++,
            path: res.tempFilePaths[0],
            key: "drivingcopy"
          }

          that.setData({
            imagescell2: that.data.imagescell2
          })

          that.data.allimagescell.splice(1, 1, that.data.imagescell2)

        } else if (imagetype == "drivingcopybehind") {
          that.data.imagescell3 = {
            id: imgId3++,
            path: res.tempFilePaths[0],
            key: "drivingcopy"
          }

          that.setData({
            imagescell3: that.data.imagescell3
          })

          that.data.allimagescell.splice(2, 1, that.data.imagescell3)

        } else {
          that.data.imagescell4 = {
            id: imgId4++,
            path: res.tempFilePaths[0],
            key: "insurancecopy"
          }

          that.setData({
            imagescell4: that.data.imagescell4
          })

          that.data.allimagescell.splice(3, 1, that.data.imagescell4)
        }

        console.log("hhh", that.data.allimagescell)

      },
      fail: function(res) {
        console.log(res);
      }
    })
  },

  //立即预约
  presubmit(e) {

    var that = this;

    if (!e.detail.value.name) {
      wx.showToast({
        title: '姓名不能为空!',
      })
      return;
    }
    if (!e.detail.value.tel) {
      wx.showToast({
        title: '电话不能为空!',
      })
      return;
    }
    if (!e.detail.value.carnumber) {
      wx.showToast({
        title: '车牌号不能为空!',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!e.detail.value.carposition) {
      wx.showToast({
        title: '地址不能为空!',
      })
      return;
    }

    wx.showLoading({
      title: '努力预约中,请稍等...',
    })

    that.data.name = e.detail.value.name
    that.data.mobile = e.detail.value.tel
    that.data.car_no = that.data.cartype[that.data.cartypeinddex] + e.detail.value.carnumber
    that.data.address = e.detail.value.carposition ? e.detail.value.carposition : that.data.fixedLossAdd
    that.data.take_car_address = e.detail.value.detailposition

    that.uploadimage(0, that)

  },

  //递归上传图片
  uploadimage(i, that) {

    if (i < that.data.allimagescell.length) {

      if (that.data.allimagescell[i].path) {

        that.upload(that, i, res => {
          that.uploadimage(i + 1, that)
        })

      } else {

        that.uploadimage(i + 1, that)
      }

    } else {



      wx.hideLoading();

      that.data.vehicle_license = that.data.fileNameTemp.substr(1, that.data.fileNameTemp.length)

      member.yearCareful(that, res => {
        console.log(res)
        if (res.status == 1) {
          wx.navigateTo({
            url: './order/order',
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none",
            duration: 1500
          })
        }
      })

    }
  },

  upload(that, i, callback) {

    that.data.mediaSrc = that.data.allimagescell[i].path
    that.data.key = that.data.allimagescell[i].key
    common.nianshengupload(that).then(function() {
      console.log('上传' + i)
      console.log(that.data.fileName)
      console.log(JSON.stringify(that.data))

      console.log("ggggg", that.data.key)

      if (that.data.key == "driving") {
        that.data.driver_license = that.data.fileName

      } else if (that.data.key == "drivingcopy") {

        that.data.fileNameTemp = that.data.fileNameTemp + ',' + that.data.fileName

      } else {
        that.data.car_policy = that.data.fileName
      }

      callback(that.data.fileNameTemp)
    })
  },

  //预览
  previewImage(e){
    var imgArr = [];
    imgArr.push(e.currentTarget.dataset.src)

    wx.previewImage({
      urls: imgArr,
      current: imgArr[0]
    })
  }
})
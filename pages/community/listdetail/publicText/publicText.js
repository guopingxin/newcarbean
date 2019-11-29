// pages/index/mine/myOrder/serviceRatings/serviceRatings.js
const app = getApp()
var test = getApp().globalData.hostName;
var test1 = getApp().globalData.hostName2;
var imgId = 0;

import utils from '../../../../utils/util.js';
import common from '../../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    container: 'container',
    back_cell: 'back_cell',
    title_cell: 'title_cell',
    fileType: 'img',
    fileTypePublic: 1,
    fileNameTemp: '',
    imagecell: [],
    imgNameArr: [],
    mess:200,
    type:["全部","保险","理赔","维修"],
    locationshow:false,
    isOver:false,
    isimgshow:"block",
    isvideoshow:'block',
    duration:0,
    videoSrc: '',
    fabumode:false,  //发布框
    imgUrl:'http://www.feecgo.com/level'
  },
  backPage: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    app.globalData.event_type = options.eventtype;

    common.pageCss(this)

    that.data.sessionId = app.globalData.userInfo.session_id
    that.data.userId = app.globalData.userInfo.id
    
    that.data.userInfo = app.globalData.userInfo


    var textReg = /市/i
    if (app.globalData.address.match(textReg)) {
      console.log(app.globalData.address.match(textReg))
      that.setData({
        address: app.globalData.address.slice(app.globalData.address.match(textReg).index + 1)
      })
    }

  },

  //回传发布类型的值
  onchecktype:function(e){

    var that= this;
    app.globalData.event_type = e.detail.typeindex
  },

  addImage: function() {
    var that = this
    var tempNum = 0
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {

        console.log("imgres",res);
        var tempPicLength = res.tempFilePaths.length;
      

        if (tempPicLength + that.data.imagecell.length > 9) {
          res.tempFilePaths = res.tempFilePaths.slice(0, 9 - that.data.imagecell.length)
        }
        for (let i in res.tempFilePaths) {
          that.data.imagecell.push({
            id: imgId++,
            path: res.tempFilePaths[i]
          })
        }
        that.setData({
          imagecell: that.data.imagecell,
          isvideoshow:"none",
          fileTypePublic:1,
          fileType:'img',
          isimgshow:'block'
        })
        console.log(that.data.imagecell)


      }
    })

  },
  deleteImg: function(e) {
    console.log(e)
    console.log(e.currentTarget.id)
    for (var i in this.data.imagecell) {
      if (this.data.imagecell[i].id == e.currentTarget.id) {
        console.log(i)
        this.data.imagecell.splice(i, 1)
        this.setData({
          imagecell: this.data.imagecell
        })
        break
      }
    }
  },

  //删除视频
  deleteVideo:function(e){
    var that = this;
    that.setData({
      mediaSrc:''
    })
  },

  //视频进入和退出全屏时触发
  bindfullscreenchange: function (e) {

    var that = this;
    console.log("eeee", e);
    if (e.detail.fullScreen) {

      that.setData({
        fabumode: true
      })

    } else {

      // that.data.videocontext.stop();

      that.setData({
        fabumode: false
      })
    }

  },

  //文本输入
  shareinput:function(e){
    console.log("eee",e);
    var that = this;
    var mess = e.detail.value.length;
    
    that.setData({
      mess:that.data.mess-mess
    })
  },

  hideLoginModal: function () {

    var that = this;
    app.getAuth(data => {
      app.getUserLogin(data, response => {
        console.log("hh", response);
        app.globalData.userInfo = response.data.data
        that.data.userInfo = app.globalData.userInfo
        that.data.sessionId = app.globalData.userInfo.session_id
        that.data.userId = app.globalData.userInfo.id
      })
    })
  },

  submitRatings: function(e) {

    console.log("^^^^^"+JSON.stringify(e));
    var that = this

    if(app.globalData.userInfo){
      that.data.publicContent = e.detail.value.intro

      if (app.globalData.latitude) {

        if (that.data.publicContent) {

          console.log("llll" + e.detail.value.intro)
          // openapi.security.msgSecCheck(that.data.publicContent,res=>{

          //   console.log("dddd",res);
          // })
          if(that.data.isimgshow == 'block'){

            that.data.publicContent = common.utf16toEntities(that.data.publicContent)

            that.setData({
              isOver: true
            })

            wx.showLoading({
              title: '上传中...',
            })

            

            that.uploadimg(0, that)

          }else{

            console.log("HHHHH" + that.data.mediaSrc);

            var fileType = that.data.mediaSrc.substr().toLowerCase();

            console.log("UUUUU" + JSON.stringify(fileType) + fileType)

            console.log("%%%%%%%" + e.detail.value.intro + that.data.videoSrc);


            if (that.data.duration > 60) {

              wx.showToast({
                title: '时长超过60s'
              })

              that.setData({
                isOver: false,
                mediaSrc: "",
                rating_contents: ""
              })

              return
            } else if (that.data.mediaSize > 20 * 1024 * 1024) {

              wx.showToast({
                title: '视频内存超过20MB'
              })

              that.setData({
                isOver: false,
                mediaSrc: "",
                rating_contents: ""
              })

              return
            }


            wx.showLoading({
              title: '发布中...',
            })

            that.setData({
              isOver: true
            })

            that.data.publicContent = e.detail.value.intro

            that.data.publicContent = common.utf16toEntities(that.data.publicContent)
            common.uploadDynamic(that).then(common.publicDynamic).then(function (res) {
              wx.showToast({
                title: '发布成功，等待审核!',
                icon:'none',
                duration:2000
              })
              console.log(that.data.fileName)
              console.log(JSON.stringify(that.data))
              //处理上个页面
              var tempType = 3
              if (!that.data.mediaSrc) {

                tempType = 1
                that.data.fileName = ''
              }
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              prevPage.data.dynamicArr.unshift({
                id: that.data.tempUploadId,
                add_time: '刚刚',
                comment: 0,
                content: that.data.fileName,
                //grade: app.globalData.userAllInfor.grade[0],
                grade: that.data.userInfo.grade[0],
                is_zan: 0,
                share: 0,
                title: common.entitiesToUtf16(that.data.publicContent),
                location: app.globalData.latitude + ',' + app.globalData.longitude,
                address: app.globalData.address,
                user_id: that.data.userId,
                user_info: {
                  nickname: that.data.userInfo.nickName,
                  face: that.data.userInfo.avatarUrl
                },
                zan: 0,
                type: tempType
              })
              prevPage.setData({
                dynamicArr: prevPage.data.dynamicArr
              })

              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000)

            })

          }
          

          // Promise.all(that.data.imagecell.map((item, index) => {
          //   return new Promise(function (resolve, reject) {
          //     console.log("@@@@@" + item)
          //     that.data.mediaSrc = item.path
          //     common.uploadDynamic(that).then(function () {
          //       console.log('上传' + index)
          //       console.log(that.data.fileName)
          //       console.log(JSON.stringify(that.data))
          //       that.data.fileNameTemp = that.data.fileName + ',' + that.data.fileNameTemp
          //       resolve(that)
          //     })
          //   }).then(function () { })
          // })).then(function (resolve, reject) {
          //   console.log('上传惋惜和')
          //   that.data.fileName = that.data.fileNameTemp.substr(0, that.data.fileNameTemp.length - 1);
          //   common.publicDynamic(that).then(function () {
          //     wx.hideLoading(that.data.fileName)
          //     wx.showToast({
          //       title: '发布成功',
          //     })
          //     console.log(that.data.fileName)
          //     //处理上个页面
          //     var tempFile = []
          //     if (that.data.fileName) {
          //       tempFile = that.data.fileName.split(',')
          //       console.log(tempFile)
          //     }
          //     var pages = getCurrentPages();
          //     var prevPage = pages[pages.length - 2];

          //     prevPage.data.dynamicArr.unshift({
          //       id: that.data.tempUploadId,
          //       add_time: '刚刚',
          //       comment: 0,
          //       content: that.data.fileName,
          //       grade: that.data.userInfo.grade[0],
          //       //grade:7,
          //       imagecell: tempFile,
          //       is_zan: 0,
          //       share: 0,
          //       title: common.entitiesToUtf16(that.data.publicContent),
          //       location: app.globalData.latitude + ',' + app.globalData.longitude,
          //       address: app.globalData.address,
          //       user_id: that.data.userId,
          //       user_info: { nickname: that.data.userInfo.nickname, face: that.data.userInfo.face },
          //       zan: 0,
          //       type: 1
          //     })
          //     prevPage.setData({
          //       dynamicArr: prevPage.data.dynamicArr
          //     })

          //     setTimeout(function () {
          //       wx.navigateBack({
          //         delta: 1
          //       })
          //     }, 1000)

          //   })
          // })

        } else {

          wx.showToast({
            title: '内容不能为空!',
          })
        }

      } else {

        that.setData({
          locationshow: true
        })
      }
    }else{
      that.setData({
        showLoginModal: true
      })
    }

    

  },


  //添加视频
  addVideo: function () {
    var that = this

    that.setData({
      isOver: false
    })
    console.log("1111")
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      compressed: true,
      success(res) {
        console.log(res)
        that.data.fileType = 'video';

        that.setData({
          mediaSrc: res.tempFilePath,
          duration: res.duration,
          mediaSize: res.size,
          isimgshow:'none',
          isvideoshow:'none',
          fileTypePublic:3
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete(res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
    var that = this;

    if(!app.globalData.latitude){
      utils.getlocation().then(function (res) {

        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;

        // that.data.latitude = res.latitude;
        // that.data.longitude = res.longitude;

      })
    }
    
  },


  //上传图片
  uploadimg: function (i, that) {

    if (i < that.data.imagecell.length) {

      that.upp(that, i, res => {
        that.uploadimg(i + 1, that)
      })
      
    } else {

      console.log('上传惋惜和' + that.data.fileNameTemp)
      that.data.fileName = that.data.fileNameTemp.substr(1, that.data.fileNameTemp.length);

      common.publicDynamic(that).then(function () {
        wx.hideLoading(that.data.fileName)
        wx.showToast({
          title: '发布成功，等待审核!',
          icon:"none",
          duration:2000
        })
        console.log(that.data.fileName)
        //处理上个页面
        var tempFile = []
        if (that.data.fileName) {
          tempFile = that.data.fileName.split(',')
          console.log(tempFile)
        }
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];

        prevPage.data.dynamicArr.unshift({
          id: that.data.tempUploadId,
          add_time: '刚刚',
          comment: 0,
          content: that.data.fileName,
          grade: that.data.userInfo.grade[0],
          //grade:7,
          imagecell: tempFile,
          is_zan: 0,
          share: 0,
          title: common.entitiesToUtf16(that.data.publicContent),
          location: app.globalData.latitude + ',' + app.globalData.longitude,
          address: app.globalData.address,
          user_id: that.data.userId,
          user_info: { nickname: that.data.userInfo.nickname, face: that.data.userInfo.face },
          zan: 0,
          type: 1
        })
        prevPage.setData({
          dynamicArr: prevPage.data.dynamicArr
        })

        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)

      })
    }
  },


  upp: function (that, i, callback) {

    that.data.mediaSrc = that.data.imagecell[i].path

    common.uploadDynamic(that).then(function () {
      console.log('上传' + i)
      console.log(that.data.fileName)
      console.log(JSON.stringify(that.data))
      that.data.fileNameTemp = that.data.fileNameTemp + ',' + that.data.fileName

      callback(that.data.fileNameTemp)
    })
  },


  //关闭授权地址的模化框
  hideLocationModal: function () {
    var that = this;
    that.setData({
      locationshow: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
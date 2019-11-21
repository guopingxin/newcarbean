// 中银保险
// pages/index/mine/myPolicy/myPolicy.js
import common from '../../../../utils/common.js'

var md5 = require('../../../../utils/md5.js')
var util = require('../../../../utils/eutil.js')
var redis = require('../../../../utils/redis.js')
var CryptoJS = require('../../../../utils/aes.js')

var test1 = getApp().globalData.hostName
const app = getApp()

import {
  Member
} from '../../../common/models/member.js'
var memberModel = new Member()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chinaNumber: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
    timer: 300,
    mobile: "",
    serviceArr: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    introArr: [],
    cleanflag: false,
    iscarclearshow: true,
    sysnotice: false,
    imgUrl: 'http://www.feecgo.com/level'
  },

  onLoad: function(options) {
    var that = this
    this.data.ifonshow = false

    wx.getLocation({
      type: 'gcj02',
      success: function(res) {},
    })
    console.log('xxx',options)
    var menu = options.menu
    // var menu = 2
      // 陕西中银
    if (menu == 1) {
      this.setData({
        menu: menu
      })
      // 河南中银
    } else if (menu == 2){
      this.setData({
        menu: menu
      })
    }
    if (!app.globalData.userInfo) {
      app.getAuth((res) => {
        if (!res) {
          that.setData({
            hasUserInfo: false
          })
        } else {
          app.getUserLogin(res, (response) => {
            app.globalData.userInfo = response.data.data
            if (response.data.status == 1) {
              that.setData({
                userId: response.data.data.id,
                userInfo: response.data.data,
                hasUserInfo: true,
                sessionId: response.data.data.session_id
              })

              if (response.data.data.is_policy == 1) {
                checkPolicy(that)
              } else {
                that.setData({
                  loaded: true,
                  hasBinling: false,
                  sysnotice: true
                })
              }
            }
          })
        }
      })
    } else {

      that.setData({
        userId: app.globalData.userInfo.id,
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        sessionId: app.globalData.userInfo.session_id
      })
      if (app.globalData.userInfo.is_policy == 1) {
        checkPolicy(that)
      } else {
        that.setData({
          loaded: true,
          hasBinling: false,
          sysnotice: true
        })
      }
    }
    //  else {
    //   that.setData({
    //     userId: app.globalData.userInfo.id,
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true,
    //     sessionId: app.globalData.userInfo.session_id
    //   })
    //   if (app.globalData.userInfo.is_policy == 1) {
    //     checkPolicy(that)
    //   } else {
    //     that.setData({
    //       loaded: true,
    //       hasBinling: false
    //     })
    //   }
    // }
    // that.setData({
    //   hasUserInfo: true
    // })
    // --------------------------------------------
    // wx.getSystemInfo({
    //   success: function (res) {
    //     console.log(res.model)
    //     app.globalData.mobileType = res.model
    //   }
    // })
    // var screenHeight = wx.getSystemInfoSync().screenHeight
    // var screenWidth = wx.getSystemInfoSync().screenWidth
    // that.setData({
    //   screenWidth: (screenWidth * 317) / 375 + 'px'
    // })
    // -------------------------------------------------
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    app.globalData.activePolicy = {}
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.is_policy == 1) {
        checkPolicy(that)
      } else {
        that.setData({
          loaded: true,
          hasBinling: false,
          sysnotice: true
        })
      }
    } else {
      that.onLoad()
    }
  },

  //系统通知
  sysnotice: function() {
    this.setData({
      sysnotice: false
    })
  },

  // 从增值服务包进入我的订单
  toMyOrder: function() {
    this.data.activeId = this.data.activeSertvice.id
    app.globalData.activePolicy = {
      id: this.data.activeSertvice.id
    }

    wx.navigateTo({
      url: '../../../services/orderlist/orderlist',
    })
  },

  // 添加保单
  addMore: function() {
    this.setData({
      hasBinling: false,
      ifAdd: true
    })
  },

  notAdd: function() {
    this.setData({
      hasBinling: true,
    })
  },

  bgcancel: function() {
    var that = this
    that.setData({
      iscarclearshow: true
    })
  },

  toserviceItem: function(e) {

    var that = this
    // console.log(e)
    app.globalData.policymoblie = e.currentTarget.dataset.mobile
    var currenttime = util.formatTime(new Date())

    that.data.hour = currenttime.substring(11, 13)
    that.data.min = currenttime.substring(14, 16)
    that.data.sec = currenttime.substring(17)

    if (parseInt(e.currentTarget.dataset.num) <= 0) {
      wx.showToast({
        title: '无免费使用次数,无法进行下单操作!',
        icon: "none",
        duration: 3000
      })
      return
    }

    that.data.policy_noId = e.currentTarget.dataset.id

    if (e.currentTarget.dataset.id == "14") {
      this.setData({
        openItem: true,
      })
      return

    } else if (e.currentTarget.dataset.id == '31') {
      that.setData({
        iscarclearshow: false
      })
      return
    } else {

      this.setData({
        opentip: true,
      })
    }

    app.globalData.activePolicy = {
      id: this.data.activeSertvice.id
    }
    this.data.ifonshow = true

    that.data.server = e.currentTarget.dataset.server
    that.data.classify_id = e.currentTarget.dataset.classify_id
    that.data.policyid = e.currentTarget.dataset.policyid

    // wx.navigateTo({
    //   url: '../zhongyin/zhongyin?server=' + e.currentTarget.dataset.server + '&classifyid=' + e.currentTarget.dataset.classify_id + '&policyid=' + e.currentTarget.dataset.policyid
    // })

    this.data.activeId = this.data.activeSertvice.id
    app.globalData.ifPolicy = true
  },


  okItem1: function() {

    var that = this

    if (that.data.policy_noId != '21') {

      if (parseInt(that.data.hour) >= 9 && parseInt(that.data.hour) <= 18) {

        if (parseInt(that.data.hour) == 18) {

          if (parseInt(that.data.min) == 0) {

            if (parseInt(that.data.sec) == 0) {

              wx.getSetting({
                success: function(res) {
                  if (!res.authSetting['scope.userLocation']) {
                    that.setData({
                      locationshow: true
                    })
                  } else {
                    wx.navigateTo({
                      url: '../zhongyin/zhongyin?server=' + that.data.server + '&classifyid=' + that.data.classify_id + '&policyid=' + that.data.policyid
                    })
                  }
                }
              })

            } else {
              wx.showToast({
                title: "服务商营业时间09:00~18:00\n请在服务时间下单!",
                icon: 'none',
                duration: 3000
              })
            }
          } else {
            wx.showToast({
              title: "服务商营业时间09:00~18:00\n请在服务时间下单!",
              icon: 'none',
              duration: 3000
            })
          }
        } else {

          wx.getSetting({
            success: function(res) {
              if (!res.authSetting['scope.userLocation']) {
                that.setData({
                  locationshow: true
                })
              } else {
                wx.navigateTo({
                  url: '../zhongyin/zhongyin?server=' + that.data.server + '&classifyid=' + that.data.classify_id + '&policyid=' + that.data.policyid
                })
              }
            }
          })
        }

      } else {

        wx.showToast({
          title: "服务商营业时间09:00~18:00\n请在服务时间下单!",
          icon: 'none',
          duration: 3000
        })
      }
    } else {


      wx.getSetting({
        success: function(res) {
          if (!res.authSetting['scope.userLocation']) {
            that.setData({
              locationshow: true
            })
          } else {
            wx.navigateTo({
              url: '../zhongyin/zhongyin?server=' + that.data.server + '&classifyid=' + that.data.classify_id + '&policyid=' + that.data.policyid
            })
          }
        }
      })

    }



    this.setData({
      opentip: false
    })

  },

  okItem: function() {

    var that = this
    that.setData({
      openItem: false
    })


    if (parseInt(that.data.hour) >= 9 && parseInt(that.data.hour) <= 18) {

      if (parseInt(that.data.hour) == 18) {

        if (parseInt(that.data.min) == 0) {

          if (parseInt(that.data.sec) == 0) {


            // wx.getSetting({
            //   success: function (res) {
            //     if (!res.authSetting['scope.userLocation']) {
            //       that.setData({
            //         locationshow: true
            //       })
            //     } else {
            memberModel.agentOrderDetail(app.globalData.userInfo.id, 2, res => {
              console.log(res)
              if (res.status == 1) {
                if (res.data.status < 2) {
                  wx.setStorageSync("agentType", res.data.type)
                  wx.navigateTo({
                    url: '../../../common/member/agent/order/order',
                  })
                } else {
                  wx.navigateTo({
                    url: '../../../common/member/agent/agent?content=' + '年审代办',
                  })
                }
              } else {
                wx.navigateTo({
                  url: '../../../common/member/agent/agent?content=' + '年审代办',
                })
              }
            })
            //     }
            //   }
            // })

          } else {
            wx.showToast({
              title: "服务商营业时间09:00~18:00\n请在服务时间下单!",
              icon: 'none',
              duration: 3000
            })
          }
        } else {
          wx.showToast({
            title: "服务商营业时间09:00~18:00\n请在服务时间下单!",
            icon: 'none',
            duration: 3000
          })
        }
      } else {

        // wx.getSetting({
        //   success: function (res) {
        //     if (!res.authSetting['scope.userLocation']) {
        //       that.setData({
        //         locationshow: true
        //       })
        //     } else {
        memberModel.agentOrderDetail(app.globalData.userInfo.id, 2, res => {
          console.log(res)
          if (res.status == 1) {
            if (res.data.status < 2) {
              wx.setStorageSync("agentType", res.data.type)
              wx.navigateTo({
                url: '../../../common/member/agent/order/order',
              })
            } else {
              wx.navigateTo({
                url: '../../../common/member/agent/agent?content=' + '年审代办',
              })
            }
          } else {
            wx.navigateTo({
              url: '../../../common/member/agent/agent?content=' + '年审代办',
            })
          }
        })
        //     }
        //   }
        // })
      }

    } else {

      wx.showToast({
        title: "服务商营业时间09:00~18:00\n请在服务时间下单!",
        icon: 'none',
        duration: 3000
      })
    }



    // console.log(this.data.activeSertvice)
    // app.globalData.activePolicy = {
    //   id: this.data.activeSertvice.id
    // }

    // this.data.activeId = this.data.activeSertvice.id
    // wx.navigateTo({
    //   url: '../../../services/servicestype/servicestype?server=代为送检(年审,不含上线)',
    // })
    // app.globalData.ifPolicy = true
  },

  closeItem1: function() {
    this.setData({
      opentip: false
    })
  },

  closeItem: function() {
    this.setData({
      openItem: false
    })
  },

  openIntro: function(e) {
    console.log(e.currentTarget.id)
    this.data.introArr[e.currentTarget.id] = !this.data.introArr[e.currentTarget.id]
    this.setData({
      introArr: this.data.introArr
    })
  },

  // 保单绑定
  veryifyCode: function(e) {
    var that = this

    if (e.detail.value.code.length != 6) {
      that.setData({
        codeError: true
      })
      return
    }
    wx.showLoading({
      title: '绑定中...',
    })
    clearInterval(that.data.timerCon)
    wx.request({
      url: test1 + '/user/user/codeVerify',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      },
      data: {
        car_no: that.data.bindCarNo,
        mobile: that.data.mobile,
        user_id: that.data.userId,
        code: e.detail.value.code,
      },
      success: function(res) {
        var dataType = typeof res.data
        if (dataType == 'string') {
          var jsonStr = res.data
          jsonStr = jsonStr.replace(" ", "")
          var temp
          if (typeof jsonStr != 'object') {
            jsonStr = jsonStr.replace(/\ufeff/g, "") //重点
            temp = JSON.parse(jsonStr)
            res.data = temp
          }
        }

        if (res.data.status == 1) {
          checkPolicy(that)
          that.setData({
            unionId: app.globalData.userInfo.unionId
          })
          wx.request({
            url: test1 + '/user/login/index',
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              unionid: that.data.unionId,
              source: 'chedou'
            },
            success(res) {
              console.log('登录成功', res)
              if (res.data.status == 1) {
                app.globalData.userInfo = res.data.data
              }
            }
          })
        } else if (res.data.status == 0) {
          wx.hideLoading()
          that.setData({
            codeError: true
          })
        } else if (res.data.status == -2) {
          wx.hideLoading()

        } else if (res.data.status == -1) {
          wx.hideLoading()
          that.setData({
            bindings: true
          })
        }
      },
    })
  },

  // 中银保单查询
  bingingPolicy: function(e) {
    var that = this
    var reCar = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/i
    if (reCar.test(e.detail.value.policyNum)) {
    } else {
      if (e.detail.value.policyNum.length == 6) {
      } else {
        this.setData({
          inforOk: true
        })
        return
      }
    }

    that.data.bindCarNo = e.detail.value.policyNum
    wx.showLoading({
      title: '查询中...',
    })
    // console.log(e.detail.value.policyNum)
    wx.request({
      url: test1 + '/user/user/bankGetPolicy',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      },
      data: {
        car_no: e.detail.value.policyNum,
      },
      success: function(res) {
        wx.hideLoading()
        if (res.data.status == 1) {
          that.setData({
            vertifing: true,
            mobile: res.data.mobile,
            mobile1: res.data.mobile.slice(0, 3) + '****' + res.data.mobile.slice(8, 11)
          })
          that.data.timerCon = setInterval(function() {
            if (that.data.timer == 0) {
              clearInterval(that.data.timerCon)
              that.setData({
                timer: 300
              })
            } else {
              that.data.timer--
                that.setData({
                  timer: that.data.timer
                })
            }

          }, 1000)

        } else if (res.data.status == 0) { //保单已过期或未查询到保单
          that.setData({
            no_policy: true
          })

        } else if (res.data.status == -1) { //该保单已绑定
          that.setData({
            bindings: true
          })
        } else if (res.data.status == -2) { //该保单已绑定
          that.setData({
            bindings: true
          })
        }
      }
    })
  },

  backIndex: function() {
    wx.switchTab({
      url: '../../service/service',
    })
  },

  // 保单切换
  changePolicy: function(e) {
    console.log("hhhhhhhhhh", this.data.policyArr)
    this.setData({
      activeItem: e.currentTarget.id,
      activeSertvice: this.data.policyArr[e.currentTarget.id]
    })

  },

  // 获取授权信息
  getUserInfo: function(e) {
    var that = this
    // app.getUser(e.detail.rawData)
    if (e.detail.userInfo) {
      wx.showLoading({
        title: '获取中...',
      })
      app.getAuth((res) => {
        if (!res) {
          that.setData({
            hasUserInfo: false
          })
        } else {
          app.getUserLogin(res, (response) => {
            app.globalData.userInfo = response.data.data
            if (response.data.status == 1) {
              wx.hideLoading()
              that.setData({
                userId: response.data.data.id,
                userInfo: response.data.data,
                hasUserInfo: true,
                sessionId: response.data.data.session_id,
                userface: response.data.data.face
              })
              if (response.data.data.is_policy == 1) {
                checkPolicy(that)
              } else {
                that.setData({
                  loaded: true,
                  hasBinling: false,
                  sysnotice: true
                })
              }
            }
          })
        }
      })
    }

  },

  toDriving: function(e) {
    var that = this
    this.data.ifonshow = true
    // console.log(JSON.stringify(this.data.activeSertvice) + "kk" + e.currentTarget.id)

    // console.log("gggggg", that.data.policyArr)

    wx.navigateTo({
      url: '../../../edaijia/driving_/driving_?card_length=' + e.currentTarget.id + '&policyId=' + this.data.activeSertvice.policy_no + '&menu=' + this.data.menu + '&policy=' + this.data.activeSertvice.id + '&policyphone=' + that.data.activeSertvice.mobile + '&title=',
    })
    this.data.activeId = this.data.activeSertvice.id


    // if (parseInt(e.currentTarget.id)> 0){

    //   if (redis.getkey("token")) {
    //     that.data.token = redis.getkey('token')
    //     wx.navigateTo({
    //       url: '../../../edaijia/webview/webview',
    //     })

    //     // that.getHistorylist()
    //   } else {
    //     that.orderlist()
    //   }
    // }

  },

  //h5免登获取token
  orderlist: function() {
    var that = this
    var currenttime = util.formatTime(new Date())

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'phone' + that.data.activeSertvice.mobile + 'strategyId1000123strategyServiceSign38aca56816beb721907etimestamp' + currenttime + 'ver3.4.2' + app.globalData.secret)
    var hash = md5.create()
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'phone' + that.data.activeSertvice.mobile + 'strategyId1000123strategyServiceSign38aca56816beb721907etimestamp' + currenttime + 'ver3.4.2' + app.globalData.secret)
    hash = hash.hex().substring(0, 30)

    wx.request({
      url: app.globalData.httpurl + '/customer/authorizeToken',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        appkey: app.globalData.appkey,
        from: app.globalData.efrom,
        phone: that.data.activeSertvice.mobile,
        strategyId: "1000123",
        strategyServiceSign: '38aca56816beb721907e',
        sig: hash,
        timestamp: currenttime,
        ver: '3.4.2'
      },
      success: function(res) {
        console.log('成功' + JSON.stringify(res))


        wx.navigateTo({
          url: '../../../edaijia/webview/webview?strategyToken=' + res.data.data + '&from=' + app.globalData.efrom,
        })

        // var key = CryptoJS.enc.Utf8.parse("ABCDEFG123456789")
        // var decryptData = CryptoJS.AES.decrypt(res.data.data, key, {
        //   mode: CryptoJS.mode.ECB,
        //   padding: CryptoJS.pad.Pkcs7
        // })
        // //对数据进行Utf-8设置,便成功解密了数据,生成result
        // var result = decryptData.toString(CryptoJS.enc.Utf8)

        // console.log("解密" + result)
        // that.data.token = result.substring(6)

        // redis.put("token", that.data.token, 2 * 60 * 60)

        // that.getHistorylist()

      },
      fail: function(res) {
        console.log('失败' + JSON.stringify(res))
      }
    })

  },


  cancelModal: function() {
    this.setData({
      showLogo: true,
    })
  },

  cancelRed: function() {
    this.setData({
      codeError: false,
      inforOk: false,
      no_policy: false,
      bindings: false
    })
  },
})

// 获取保单详情
function checkPolicy(that) {
  wx.request({
    url: test1 + '/user/user/policyInfo',
    method: 'GET',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'PHPSESSID=' + that.data.sessionId
    },
    data: {
      user_id: that.data.userId
    },
    success: function(res) {
      wx.hideLoading()
      if (res.data.status == 1) {
        that.setData({
          serviceArr: [],
          vertifing: false
        })
        that.data.policyArr = res.data.data
        // that.data.tempProject = res.data.data.project
        getItemClassify(that).then(function() {
          for (var i in that.data.policyArr) {
            that.data.policyArr[i].start_date = that.data.policyArr[i].start_date.slice(0, 10)
            that.data.policyArr[i].end_date = that.data.policyArr[i].end_date.slice(0, 10)

            var tempService = []
            for (var j in that.data.policyArr[i].project) {
              for (var m in that.data.classifyArr) {
                if (j == that.data.classifyArr[m].id) {
                  tempService.push({
                    id: that.data.classifyArr[m].id,
                    name: that.data.classifyArr[m].name,
                    num: that.data.policyArr[i].project[j],
                    intro: that.data.classifyArr[m].intro,
                    mobile: that.data.policyArr[i].mobile
                  })
                }
              }
            }

            if (j == 31) { //车辆清洗
              that.data.policyArr[i].project.cleanflag = true
            }
            that.data.policyArr[i].projectName = tempService
          }

          that.setData({
            policyArr: that.data.policyArr,
          })

          for (var i in that.data.policyArr) {
            if (that.data.policyArr[i].project.cleanflag) {
              for (var j in that.data.policyArr[i].projectName) {

                for (var k in that.data.policyArr[i].projectName[j]) {
                  if (that.data.policyArr[i].projectName[j].id == 17) {
                    that.data.policyArr[i].projectName.splice(j, 1)
                  } else if (that.data.policyArr[i].projectName[j].id == 20) {
                    that.data.policyArr[i].projectName.splice(j, 1)
                  }
                }
              }
            }
          }

          if (that.data.activeId) {
            for (var i in that.data.policyArr) {
              if (that.data.policyArr[i].id == that.data.activeId) {
                that.setData({
                  activeItem: i,
                  activeSertvice: that.data.policyArr[i]
                })
              }
            }
          } else {
            that.setData({
              activeItem: 0,
              activeSertvice: that.data.policyArr[0]
            })
          }

          // console.log("4444", that.data.activeSertvice)
          that.setData({
            serviceArr: that.data.serviceArr
          })
        })
        that.data.policyArr.forEach((item, index) => {
          that.data.serviceId = item.service_id
          getservice(that)
        })
      } else {
        that.setData({
          hasBinling: false,
          loaded: true,
          sysnotice: true
        })
      }
    },
  })
}


// 获取保单详情保险公司补充信息
function getservice(that) {
  wx.request({
    url: test1 + '/user/index/sponsors',
    method: 'GET',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'PHPSESSID=' + that.data.sessionId
    },
    data: {
      id: that.data.serviceId
    },
    success: function(res) {
      //保险公司id
      app.globalData.service_no = res.data.id
      if (res.data.status == 1) {
        // that.data.policyDetail.policy.service_name = res.data.name
        that.data.policyArr.forEach((item, index)=> {
          if (that.data.serviceId == item.service_id) {
            item.serviceName = res.data.name   
          } else  {
            that.data.policyArr[0].serviceName = res.data.name
            // that.setData({
            //   activeSertvice: that.data.policyArr[0],
            //   activeItem: 0
            // })
          }
        })
        that.setData({
          hasBinling: true,
          loaded: true
          // 修改屏蔽
          // policyDetail: that.data.policyDetail
        })
        setTimeout(function() {
          that.setData({
            showLogo: true
          })
        }, 2000)
        common.animationEvent(that)
      } else {
        wx.showModal({
          title: '操作超时',
          content: ''
        })
      }
    }
  })
}

// 分类列表
function getItemClassify(that) {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: test1 + '/user/user/classList',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      },
      success: function(res) {
        that.data.classifyArr = res.data
        resolve(that)
      }
    })
  })
}
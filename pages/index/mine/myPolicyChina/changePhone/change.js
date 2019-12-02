// 河南中银的重新绑定手机号
var app = getApp()
Page({
  data: {
    codetime: 0,
    phone: '',
    chejia: '',
    pageOne: true,
    
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      phone1: options.mobile.slice(0, 3) + '****' + options.mobile.slice(8, 11),
      policyChangeId: options.policyChangeId
    })
  },

  phoneInput(e) {
    this.data.phone = e.detail.value
  },

  chejiaInput(e) {
    this.data.chejia = e.detail.value
  },

  getCodeNum() {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    let params = this.data.phone
    if (!myreg.test(params)) {
      return wx.showToast({
        title: '请填写正确的手机号',
        icon: 'none'
      })
    } else {
      if (this.data.codetime > 0) return
      this.setData({
        codetime: 120
      })
      let timer = setInterval(() => {
        this.setData({
          codetime: this.data.codetime - 1
        })
        if (this.data.codetime < 1) {
          clearInterval(timer)
          this.setData({
            codetime: 0
          })
        }
      }, 1000)
      wx.request({
        url: app.globalData.hostName + '/user/user/getCode',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': 'PHPSESSID=' + app.globalData.userInfo.session_id
        },
        data: {
          mobile: this.data.phone,
        },
        success: function (res) {
         
        }
      })
    }
  },

  formSubmit(e) {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    let params = e.detail.value
    if (!myreg.test(params.phone)) {
      return wx.showToast({
        title: '请填写正确的手机号',
        icon: 'none'
      })
    } else if (params.code == '') {
      return wx.showToast({
        title: '请填写正确的验证码',
        icon: 'none'
      })
    } else if (params.chejia == '') {
      return wx.showToast({
        title: '请填写正确的车架号',
        icon: 'none'
      })
    }
    
    wx.request({
      url: app.globalData.hostName + '/user/user/policyChangeBind',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + app.globalData.userInfo.session_id
      },
      data: {
        mobile: params.phone,
        code: params.code,
        policy_id: this.data.policyChangeId,
        car_model: params.chejia
      },
      success: (res)=> {
        console.log(res)
        if(res.data.status == 1) {
          app.globalData.userInfo.is_policy = 1
          this.data.unionId = app.globalData.userInfo.unionId
          wx.request({
            url: app.globalData.hostName + '/user/login/index',
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              unionid: this.data.unionId,
              source: 'chedou'
            },
            success: (res)=> {
              if (res.data.status == 1) {
                app.globalData.userInfo = res.data.data
                let pages = getCurrentPages()
                let prevPage = pages[pages.length - 2]
                prevPage.setData({
                  change: true
                })
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })

          // this.setData({
          //   pageOne: false
          // })
        
        } else {
          wx.showToast({
            title: res.data.msg ? res.data.msg : '操作超时',
            icon: 'none'
          })
        }
      }
    })

  }

})
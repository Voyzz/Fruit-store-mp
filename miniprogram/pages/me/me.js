// page/component/new-pages/user/user.js
const app = getApp();

Page({
  data: {
    orders: [],
    hasAddress: false,
    address: {},
    isAdmin: -1,
    openid: '',
    adiminArr: [
      '',
      'oA9Ke4tObqwxqNSfALdVZPkVv7Yc',
      'oA9Ke4rH2nnqFgFbWIhyQu5bCXPA'
    ]
  },
  onLoad() {
    var that = this;
    that.getOpenidAndOrders();
    // console.log(that.data)
  },

  onShow() {
    var self = this;
    // console.log(self.data)
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function (res) {
        self.setData({
          hasAddress: true,
          address: res.data
        })
      }
    })
  },
  onPullDownRefresh: function () {
    var that = this
    that.getOpenidAndOrders()
    var timer

    (timer = setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500));

  },

  // 获取用户openid
  getOpenidAndOrders() {
    var that = this;
    wx.cloud.callFunction({
      name: 'add',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openId)
        var openid = res.result.openId;
        var isAdmin = null;
        that.setData({
          openid: openid,
          isAdmin: that.data.adiminArr.indexOf(openid)
        })
        app.getInfoWhere('order_master',{
          openid: openid
        },e=>{
          console.log(e.data)
          var tmp = []
          var len = e.data.length
          for (var i = 0; i < len;i++){
            tmp.push(e.data.pop())
          }
          that.setData({
            orders: tmp
          })
        })
      }
    })
  },

  

  goToBgInfo: function() {
    wx.navigateTo({
      url: '/pages/bgInfo/bgInfo',
    })
  },

  goToBgManage: function () {
    wx.navigateTo({
      url: '/pages/bgManage/bgManage',
    })
  }

})
const app = getApp()

Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,
    orders: [],
    myList: []
  },

  onReady() {
    const self = this;
    // console.log(app.globalData.carts)
    self.setData({
      orders: app.globalData.carts
    })
    
    this.getTotalPrice();
  },

  onShow: function () {
    const self = this;
    wx.getStorage({
      key: 'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.setData({
      total: total.toFixed(1)
    })
  },

  // 支付后的订单信息
  getListAfterPay: function(that) {
    var p = new Promise((resolve, reject) => {
      let theList = []
      that.data.orders.forEach((val, idx, obj) => {
        var { name, num, price } = val
        var tmpInfo = { name, num, price }
        theList.push(tmpInfo)
      })
      resolve(theList)
    }).then(res => {
      console.log(res)
      that.setData({
        myList: res
      })
    })
  },
  
  // 去支付
  toPay() {
    var that = this
    if (that.data.hasAddress) {
      console.log(that.data.address)
      console.log(that.data.total)
      that.getListAfterPay(that)
      // console.log(that.data.myList)
      wx.showToast({
        title: "需支付[" + this.data.total + "]元",
      })
    }else{
      wx.showToast({
        title: '请填写收货地址',
      })
    }
    
  }
})
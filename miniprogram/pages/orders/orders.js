const app = getApp()
const md5 = require("../../utils/md5.js")

Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,
    orders: [],
    myList: [],
    openid: '',
    nonce_str: ''
  },

  onReady() {
    const self = this;
    // console.log(app.globalData.carts)
    
    // 32位随机字符串
    var nonce_str = Math.random().toString(32).substr(2)

    // 获取ip地址
    wx.request({
      url: 'http://ip-api.com/json',
      success: function (e) {
        console.log(e.data.query);
        self.setData({
          spbill_create_ip: e.data.query
        })
      }
    })
    // 获取总价和openid
    self.setData({
      orders: app.globalData.carts,
      nonce_str: nonce_str
    })
    this.getOpenid();
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
  

  // 获取用户openid
  getOpenid() {
    var that = this;
    wx.cloud.callFunction({
      name: 'add',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openId)
        var openid = res.result.openId;
        that.setData({
          openid: openid,
        })
      }
    })
  },
  
  // 去支付
  toPay() {
    var that = this
    if (that.data.hasAddress) {
      // 地址信息
      console.log(that.data.address)
      // 总价信息
      console.log(that.data)
      // 支付后订单信息
      that.getListAfterPay(that)

      // 签名字符串
      var p = new Promise((resolve,reject)=>{
        // 生成字符串
        var stringA = "appid=" + app.globalData.appid + "&body=test&device_info=WEB&mch_id=" + app.globalData.mch_id + "&nonce_str=" + that.data.nonce_str;
        var stringSignTemp = stringA +"&key="+app.globalData.apikey
        // 签名MD5加密
        var sign = md5.md5(stringSignTemp).toUpperCase()
        console.log("签名：" + stringSignTemp)
        // openid
        var openid = that.data.openid
        // 订单号
        var out_trade_no = (new Date().getTime() + app.RndNum(6)).toString()

        resolve([sign,openid,out_trade_no])
      })
      p.then(e=>{
        
        // var obj = {
        //   appid: app.globalData.appid,
        //   mch_id: app.globalData.mch_id,
        //   nonce_str: that.data.nonce_str,
        //   sign: e[0],
        //   body: 'test',
        //   out_trade_no: e[2],
        //   total_fee: parseInt(that.data.total*100),
        //   spbill_create_ip: that.data.spbill_create_ip,
        //   notify_url: 'http://www.weixin.qq.com/wxpay/pay.php',
        //   trade_type: 'JSAPI',
        //   openid: that.data.openid
        // }
        // console.log('这是obj：',obj)

        var xmlData = '<xml>'+
          '<appid>'+app.globalData.appid+'</appid>'+
          '<attach>test</attach>'+
          '<body>JSAPItest</body>'+
          '<mch_id>'+app.globalData.mch_id+'</mch_id>' +
          '<nonce_str>'+that.data.nonce_str+'</nonce_str>' +
          '<notify_url>http://www.weixin.qq.com/wxpay/pay.php</notify_url>' +
          '<openid>'+that.data.openid+'</openid>'+
          '<out_trade_no>'+e[2]+'</out_trade_no>'+
          '<spbill_create_ip>'+that.data.spbill_create_ip+'</spbill_create_ip>'+
          '<total_fee>'+parseInt(that.data.total * 100)+'</total_fee>'+
          '<trade_type>JSAPI</trade_type>'+
          '<sign>'+e[0]+'</sign>'+
          '</xml>'
        
        // 发起请求
        wx.request({
          url: 'https://api.mch.weixin.qq.com/pay/unifiedorder', 
          method: 'POST',
          header: {
            'content-type': 'text/xml' ,
             "charset": "utf-8"
          },
          data: xmlData,
          success(res) {
            console.log(res)
          }
        })
        
      })

      
    }else{
      wx.showModal({
        title: 'Oh No',
        content: '请填写收货地址~',
      })
    }
  },


  // 支付后的订单信息
  getListAfterPay: function (that) {
    var p = new Promise((resolve, reject) => {
      let theList = []
      that.data.orders.forEach((val, idx, obj) => {
        var { name, num, price } = val
        var tmpInfo = { name, num, price }
        theList.push(tmpInfo)
      })
      resolve(theList)
    }).then(res => {
      // console.log(res)
      that.setData({
        myList: res
      })
    })
  },
})
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
    var nonce_str = app.RndNum()

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
      total: total.toFixed(2)
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

      // 获取prepay_id，所需的签名字符串
      var p = new Promise((resolve,reject)=>{
        // 生成订单号
        var out_trade_no = (new Date().getTime() + app.RndNum(6)).toString()

        // 生成字符串
        var stringA = 
          "appid="+app.globalData.appid
        + "&attach=test"
        + "&body=JSAPItest"
        + "&device_info=WEB"
        + "&mch_id="+app.globalData.mch_id
        + "&nonce_str="+that.data.nonce_str
        + "&notify_url=http://www.weixin.qq.com/wxpay/pay.php"
        + "&openid="+that.data.openid
        + "&out_trade_no="+out_trade_no
        + "&spbill_create_ip="+that.data.spbill_create_ip
        + "&time_expire="+app.beforeNowtimeByMin(-15)
        + "&time_start="+app.CurrentTime()
        + "&total_fee="+parseInt(that.data.total*100)
        + "&trade_type=JSAPI";

        var stringSignTemp = stringA +"&key="+app.globalData.apikey
        // 签名MD5加密
        var sign = md5.md5(stringSignTemp).toUpperCase()
        // console.log("签名：" + stringSignTemp)
        
        // openid
        var openid = that.data.openid

        resolve([sign,openid,out_trade_no])
      })
      p.then(e => {
        // 生成获取prepay_id请求的xml参数
        var xmlData = '<xml>'+
          '<appid>'+app.globalData.appid+'</appid>'+
          '<attach>test</attach>'+
          '<body>JSAPItest</body>'+
          '<device_info>WEB</device_info>'+
          '<mch_id>'+app.globalData.mch_id+'</mch_id>' +
          '<nonce_str>'+that.data.nonce_str+'</nonce_str>' +
          '<notify_url>http://www.weixin.qq.com/wxpay/pay.php</notify_url>' +
          '<openid>'+that.data.openid+'</openid>'+
          '<out_trade_no>'+e[2]+'</out_trade_no>'+
          '<spbill_create_ip>'+that.data.spbill_create_ip+'</spbill_create_ip>'+
          '<time_expire>'+app.beforeNowtimeByMin(-15)+'</time_expire>'+
          '<time_start>'+app.CurrentTime()+'</time_start>'+
          '<total_fee>'+parseInt(that.data.total * 100)+'</total_fee>'+
          '<trade_type>JSAPI</trade_type>'+
          '<sign>'+e[0]+'</sign>'+
          '</xml>'

        wx.cloud.callFunction({
          name:'pay',
          data:{
            xmlData:xmlData
          }
        })
        .then(res=>{
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
    
        // 发起获取prepay_id请求
        // wx.request({
        //   url: 'https://api.mch.weixin.qq.com/pay/unifiedorder', 
        //   method: 'POST',
        //   header: {
        //     "content-type":"text/xml",
        //     "charset": "utf-8"
        //   },
        //   data: xmlData,
        //   success(res) {
        //     if (res) { 
        //       // 得到prepay_id
        //       // console.log(res.data)
        //       var prepay_id = res.data.split("<prepay_id><![CDATA[")[1].split("]]></prepay_id>")[0];
        //       var timeStamp = Math.round((Date.now()/1000)).toString()
        //       var nonceStr = app.RndNum()
        //       var stringB =
        //         "appId=" + app.globalData.appid
        //         + "&nonceStr=" + nonceStr
        //         + "&package=" + 'prepay_id=' + prepay_id
        //         + "&signType=MD5"
        //         + "&timeStamp=" + timeStamp
        //       var paySignTemp = stringB + "&key=" + app.globalData.apikey
        //       console.log(paySignTemp)
        //       // 签名MD5加密
        //       var paySign = md5.md5(paySignTemp).toUpperCase()
        //       console.log(paySign)
              
        //       wx.requestPayment({
        //           appId: app.globalData.appid,
        //           timeStamp: timeStamp,
        //           nonceStr: nonceStr,
        //           package: 'prepay_id=' + prepay_id,
        //           signType: 'MD5',
        //           paySign: paySign,
        //           success: function(e){
        //             console.log(e)
        //           }
        //         })
        //       }
        //   }
        // })

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
const app = getApp()

Page({
  data: {
    orderList:{},
    sendingList:{},
    finishedList:{},
    cardNum: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllList()
  },

  // --------------------!!!  选项卡切换  !!!----------------------
  tapTo1: function () {  //添加
    var that = this
    that.setData({
      cardNum: 1
    })
  },
  tapTo2: function () { //修改和删除
    var that = this
    that.setData({
      cardNum: 2
    })
    // console.log(getCurrentPages())
  },
  tapTo3: function () {
    var that = this
    that.setData({
      cardNum: 3
    })
  },
  tapTo4: function () {
    var that = this
    that.setData({
      cardNum: 4
    })
  },

  // ----------------------!!!  订单管理  !!!----------------------
  // 已支付-发货
  boxFruit: function(e) {
    var that = this
    console.log(e.currentTarget.id)
    app.updateInfo('order_master', e.currentTarget.id, {
      sending: true,
      sendingTime: app.CurrentTime()
    }, e => {
      that.getAllList()
      wx.showToast({
        title: '【已发货】',
      })
    })
  },

  // 已发货-送达
  sendingFruit: function(e) {
    var that = this
    console.log(e.currentTarget.id)
    app.updateInfo('order_master', e.currentTarget.id, {
      finished: true,
      finishedTime: app.CurrentTime()
    }, e => {
      that.getAllList()
      wx.showToast({
        title: '【已送达】',
      })
    })
  },
  
  // 获取所有订单信息
  getAllList:function(){
    var that = this
    app.getInfoByOrder('order_master', 'orderTime', 'desc', e => {
      that.setData({
        orderList: e.data
      })
      console.log(e.data)
    })
    app.getInfoByOrder('order_master', 'sendingTime', 'desc', e => {
      that.setData({
        sendingList: e.data
      })
    })
    app.getInfoByOrder('order_master', 'finishedTime', 'desc', e => {
      that.setData({
        finishedList: e.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
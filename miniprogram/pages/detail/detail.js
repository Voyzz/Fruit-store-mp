// miniprogram/pages/detail/detail.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    fruitDetail: {}, //水果信息
    popUpHidden: true, //是否隐藏弹窗
    popCartCount: 1, //购物车数量
    curIndex: 0,
  },

  // 跳转至购物车
  goToCart: function() {
    // console.log('hhhh')
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },

  // 弹出购物车选项
  addToCart: function() {
    var that = this
    that.setData({
      popUpHidden: false
    })
  },

  // 关闭弹窗
  popCancel: function() {
    var that = this
    that.setData({
      popUpHidden: true
    })
  },

  // 数量加减
  plusCount: function() {
    var that = this
    var tmp = that.data.popCartCount + 1
    that.setData({
      popCartCount: tmp
    })
  },
  minusCount: function () {
    var that = this
    var tmp = that.data.popCartCount - 1
    if(tmp === 0) tmp = 1
    that.setData({
      popCartCount: tmp
    })
  },

  // 添加购物车
  toCart: function () {
    var that = this
    var newCartItem = that.data.fruitDetail
    newCartItem.num = that.data.popCartCount
    // console.log(newCartItem)
    app.isNotRepeteToCart(newCartItem)
    wx.showToast({
      title: '已添加至购物车',
    })
    that.setData({
      popUpHidden: true
    })
    // console.log(app.globalData.carts)        
  },

  // 立即购买
  toBuy: function () {
    var that = this
    var newCartItem = that.data.fruitDetail
    newCartItem.num = that.data.popCartCount
    // console.log(newCartItem)
    // app.globalData.carts.push(newCartItem)
    app.isNotRepeteToCart(newCartItem)
    // console.log(app.globalData.carts) 
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },

  // 详细信息切换
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    // console.log(e._id)
    var that = this
    app.getInfoWhere('fruit-board', { _id: e._id },
      e => {
        // console.log(e.data["0"])
        that.setData({
          fruitDetail: e.data["0"]
        })
      }
    )
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
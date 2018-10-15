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
    // console.log(that.data)
    // { fruitID: 2, name: '香蕉', imgUrl: '/images/icon/like.png', num: 1, price: 5, selected: true }
    var newCartItem = {
      fruitID: that.data.fruitDetail.fruitID,
      name: that.data.fruitDetail.name,
      imgUrl: that.data.fruitDetail.imgUrl,
      num: that.data.popCartCount,
      price: that.data.fruitDetail.price,
      selected: true
    }
    app.globalData.myCarts.push(newCartItem)
    console.log(app.globalData.myCarts)        
  },

  // 跳转至购物车
  goToCart: function() {
    
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
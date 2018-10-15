// miniprogram/pages/detail2/detail2.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: {},  //水果信息对象
    _id: null,  //水果的唯一id
    num: 1,   
    totalNum: 0,  //添加至购物车的数量
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var self = this
    self.setData({
      _id: e._id
    })
    app.getInfoWhere('fruit-board', { _id: e._id},
      e => {
        this.setData({
          goods: e.data["0"]
        })
      }
    )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this
    // console.log(self.data)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 传递购物车数据至全局
  dataTrans() {
    const self = this
    
  },

  minusCount() {
    let num = this.data.num;
    if(num === 1){
      return
    }
    else{
      num--;
      this.setData({
        num: num
      })
    }
  },

  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num: num
    })
  },

  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;

    self.setData({
      show: true
    })
    setTimeout(function (resolve, reject) {
      self.setData({
        show: false,
        scaleCart: true
      })
      setTimeout(function () {
        self.setData({
          scaleCart: false,
          hasCarts: true,
          totalNum: num + total
        })
      }, 200)
    }, 300)

    var cartItem = {}
    cartItem["_id"] = self.data._id
    cartItem["num"] = self.data.totalNum
    app.globalData.cart.push(cartItem)
  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
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
// miniprogram/pages/detail2/detail2.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: {},
    num: 1,
    totalNum: 0,
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
    // console.log(e._id)
    app.getInfoWhere('fruit-board', { _id: e._id},
      e => {
        // console.log(e)
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
    console.log(self.data)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    new Promise(
      setTimeout(function (resolve,reject) {
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
        resolve(totalNum)
      }, 300)
    ).then(resolve => console.log(resolve))
    

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
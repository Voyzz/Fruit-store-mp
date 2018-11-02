// miniprogram/pages/bgInfo/bgInfo.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fruitInfo: {},
    tmpUrl: "",
    delFruitId: "",
    cardNum: 1
  },

  // 选项卡切换
  tapTo1: function() {
    var that = this
    that.setData({
      cardNum: 1
    })
  },
  tapTo2: function () {
    var that = this
    that.setData({
      cardNum: 2
    })
  }, 
  tapTo3: function () {
    var that = this
    that.setData({
      cardNum: 3
    })
  },

  // 获取水果信息表单
  addFruitInfo: function(e){
    const self = this
    // console.log(e)
    // 获取本地图片
    new Promise((resolve,reject)=>{
      self.setData({
        fruitInfo: e.detail.value
      })
      self.data.fruitInfo.imgUrl = self.data.tmpUrl
      resolve(self.data.fruitInfo)
    }).then(fruitInfo=>{
      // 上传所有信息
      app.addRowToSet('fruit-board', fruitInfo, e => {
        console.log(e)
        wx.showToast({
          title: '添加成功',
        })
      })
    })
  },

  // 绑定删除水果名称参数
  getDelFruitId: function(e) {
    var that = this
    app.getInfoWhere('fruit-board',{
      name: e.detail.value
    },res=>{
      that.setData({
        delFruitId: res.data["0"]._id
      })
    })
  },

  // 删除水果
  deleteFruit: function() {
    // app.deleteInfoFromSet('fruit-board',"葡萄")
    var that = this
    console.log(that.data.delFruitId)
    app.deleteInfoFromSet('fruit-board', that.data.delFruitId)
  },

  // 上传图片返回tmpUrl
  selectImg:function(){
    const self = this
    app.selectImgUpToC(Math.random().toString(),tmpUrl=>{
      console.log(tmpUrl)
      self.setData({
        tmpUrl: tmpUrl
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app)
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
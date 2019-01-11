// miniprogram/pages/bgInfo/bgInfo.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fruitInfo: {},
    tmpUrlArr: [],
    delFruitId: "",
    cardNum: 1,
    files: [],
    time:0,
    manageList:[], //管理页面信息列表

    // 上传的信息
    fruitID:null, //水果编号
    name:null,    //水果名称
    price:null,   //价格
    unit:null,    //单位
    detail:"",    //描述
    myClass:0,  //今日特惠
    recommend:0,//店主推荐

    myClass_Arr: [
      '否',
      '是'
    ],
    recommend_Arr: [
      '否',
      '是'
    ],
  },

  //------------------------ 获取信息 ------------------------
  // 获取水果编号
  getFruitID: function (e) {
    this.setData({
      fruitID: parseInt(e.detail.value)
    })
  },

  // 获取水果名称
  getName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  // 获取价格
  getPrice: function (e) {
    this.setData({
      price: e.detail.value
    })
  },

  // 获取单位
  getUnit: function (e) {
    this.setData({
      unit: e.detail.value
    })
  },

  //选择照片并预览（预览地址在files，上传后的地址在tmpUrlArr）
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        
        app.upToClound("imgSwiper", that.data.name + Math.random().toString(), 
        res.tempFilePaths["0"], tmpUrl => {
          // console.log(tmpUrl)
          that.data.tmpUrlArr.push(tmpUrl)
          // console.log(getCurrentPages())
        })
      }
    })
    // console.log(getCurrentPages())
  },

  //预览图片
  previewImage: function (e) {
    var that = this
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: that.data.tmpUrlArr // 需要预览的图片http链接列表
    })
  },

  //水果详细信息
  getInfoText: function (e) {
    var that = this
    that.setData({

    })
    this.data.detail = e.detail.value;
  },

  // 今日特惠
  getMyClass: function (e) {
    var that = this
    this.setData({
      myClass: e.detail.value.toString()
    })
  },

  // 店主推荐
  getRecommend: function (e) {
    var that = this
    this.setData({
      recommend: e.detail.value.toString()
    })
  },



  // ------------点击按钮--------------
  // getInfo: function () {
  //   var that = this
  //   // 必要信息
  //   var { fruitID, name, price, unit, detail, myClass, recommend } = that.data
  //   var nec_info = { fruitID, name, price, unit, detail, myClass, recommend }
  //   for (var idx in nec_info) {
  //     if (nec_info[idx] === null) {
  //       wx.showModal({
  //         title: '错误',
  //         content: '必填信息缺失',
  //       })
  //     }
  //   }

  //   // console.log(nec_info)
  // },

  // --------------------  选项卡切换  ----------------------
  tapTo1: function() {  //添加
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
    console.log(getCurrentPages())
  }, 
  tapTo3: function () {
    var that = this
    that.setData({
      cardNum: 3
    })
  },

  // ----------------------  提交操作  ---------------------
  // 添加水果信息表单
  addFruitInfo: function(e){
    const that = this
    if (that.data.name && that.data.price){
      new Promise((resolve, reject) => {
        const { fruitID, name, price, unit, detail, myClass, recommend, tmpUrlArr } = that.data
        const theInfo = { fruitID, name, price, unit, detail, myClass, recommend, tmpUrlArr }
        theInfo['imgUrl'] = that.data.tmpUrlArr[0]
        theInfo['time'] = parseInt(app.CurrentTime())
        resolve(theInfo)
      }).then(theInfo => {
        // 上传所有信息
        app.addRowToSet('fruit-board', theInfo, e => {
          console.log(e)
          wx.showToast({
            title: '添加成功',
          })
        })
        app.getInfoByOrder('fruit-board', 'time', 'desc',
          e => {
            that.setData({
              manageList: e.data
            })
          }
        )
      })
    }
    else{
      wx.showToast({
        title: '信息不完全',
      })
    }
    
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



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getInfoByOrder('fruit-board', 'time', 'desc',
      e => {
        that.setData({
          manageList: e.data
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
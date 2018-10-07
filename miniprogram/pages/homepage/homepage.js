// miniprogram/pages/homepage/homepage.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgNo: 1,
    imgSwiperUrl: '',
    fruitInfo: [],
    typeCat: [
      { id: 0, name: "美味鲜果" },
      { id: 1, name: "今日特惠" },
      { id: 2, name: "销量排行" },
      { id: 3, name: "店主推荐" },
    ],
    activeTypeId: 0,
  },


  // 分类展示切换
  typeSwitch: function(e) {
    console.log(e.currentTarget.id)
    getCurrentPages()["0"].setData({
      activeTypeId: parseInt(e.currentTarget.id)
    })
    switch (e.currentTarget.id) {
      // 全部展示
      case '0':
        app.getInfoFromSet('fruit-board', {},
          e => {
            // console.log(e.data)
            getCurrentPages()["0"].setData({
              fruitInfo: e.data
            })
          }
        )
        break;
      // 今日特惠
      case '1':
        app.getInfoWhere('fruit-board', {myClass:'1'},
          e => {
            getCurrentPages()["0"].setData({
              fruitInfo: e.data
            })
          }
        )
        break;
      // 销量排行
      case '2':
        app.getInfoByOrder('fruit-board','purchaseFreq','desc',
          e => {
            getCurrentPages()["0"].setData({
              fruitInfo: e.data
            })
          }
        )
        break;
      // 店主推荐
      case '3':
        console.log("店主推荐")

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getInfoFromSet('fruit-board', {}, 
      e => {
        // console.log(e.data)
        getCurrentPages()["0"].setData({
          fruitInfo: e.data
        })
      }
    )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(getCurrentPages()["0"].data)
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

  },


  // 上传图片到云存储
  // uploadImg:function(){
  //   wx.chooseImage({
  //     count: 9,
  //     sourceType: ['album', 'camera'],
  //     success(res) {
  //       let _this = getCurrentPages()['0']
  //       // tempFilePath可以作为img标签的src属性显示图片
  //       const tempFilePaths = res.tempFilePaths
  //       console.log(tempFilePaths[0])
  //       app.upToClound('imgSwiper', `swiperImg${_this.data.swiperImgNo}.jpg`,tempFilePaths[0])
  //       _this.data.swiperImgNo += 1
  //       if(_this.data.swiperImgNo>3){
  //         _this.data.swiperImgNo = 1
  //       }
  //     }
  //   })

  // },
})
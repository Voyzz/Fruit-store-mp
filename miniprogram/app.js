//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      cloudRoot : "clo140d-voyz-cloud-86f82a/",
      carts:[],  //购物车
      tmpNum: 0,
    }
  },

  // --------------数据库操作----------------

  // 向集合内新增记录(集合名，要添加的数据对象，回调函数)
  addRowToSet: function(setName,infoObject,callback){
    const db = wx.cloud.database()
    db.collection(setName).add({
      data: infoObject,
      success:callback,
      fail: console.error
    })
  },

  // 从集合中取出数据
  getInfoFromSet: function (setName,selectConditionSet,callBack){
    const db = wx.cloud.database()
    db.collection(setName).where(selectConditionSet).get({
      success:callBack
    })
  },

  // 从集合中筛选数据
  getInfoWhere: function (setName,ruleObj,callback) {
    const db = wx.cloud.database()
    db.collection(setName).where(ruleObj)
      .get({
        success: callback,
        fail: console.error
      })
  },

  // 排序后取出数据
  getInfoByOrder: function (setName, ruleItem, orderFuc,callback) {
    const db = wx.cloud.database()
    db.collection(setName)
      .orderBy(ruleItem, orderFuc)
      .get()
      .then(callback)
      .catch(console.error)
  },

  // 上传图片到云端（云端文件夹，云端文件名，文件临时地址）
  upToClound: (imgFolder, imgName, myFilePath) => {
    wx.cloud.uploadFile({
      cloudPath: imgFolder + "/" + imgName, // 上传至云端的路径
      filePath: myFilePath, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        console.log(res.fileID)
      },
      fail: console.error
    })
  },

  // 获取云端文件tmpUrl
  getTmpUrl: (imgFolder, imgName,currentData)=>{
    wx.cloud.getTempFileURL({
      fileList: [getApp().globalData.cloudRoot+imgFolder + "/" + imgName],
      success: res => {
        // console.log(res.fileList["0"].tempFileURL)
        getCurrentPages().setData({
          currentData: res.fileList["0"].tempFileURL
        })
      },
      fail: console.error
    })
  }
})

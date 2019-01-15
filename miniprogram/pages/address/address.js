Page({
  data: {
    address: {
    name: '',
    phone: '',
    // detail: ''
    detail: 0,
    message: "",
    schoolName:0,  //学校
    addressItem:0, //地址类型
    apartmentNum:0,   //宿舍楼号
    },

    school: 0,
    school_Arr: [
      "交大",
      "华师大"
    ],

    // address: 0,
    address_Arr:[
      "宿舍楼","学院","图书馆","餐厅","教学楼","其他"
    ],

    // apartment:0,
    // apartment_Arr:[0,1,2,3]

  },

  onLoad() {
    var self = this;
    wx.getStorage({
      key: 'address',
      success: function (res) {
        self.setData({
          address: res.data
        })
      }
    })

  },

  // // 姓名
  // getName:function(e){
  //   var that = this
  //   that.setData({
  //     name:e.detail.value
  //   })
  // },

  // // 手机
  // getPhone: function (e) {
  //   var that = this
  //   that.setData({
  //     phone: e.detail.value
  //   })
  // },

  // 学校
  getSchool:function(e){
    var that = this
    // that.data.address['schoolName'] = parseInt(e.detail.value)
    // console.log(getCurrentPages()["0"].data)
    let tmp = getCurrentPages()["0"].data.address
    tmp['schoolName'] = parseInt(e.detail.value) 
    that.setData({
      // schoolName: that.data.school_Arr[e.detail.value],
      address:tmp
    })
  },

  // 地址类型
  getAddress: function (e) {
    var that = this
    let tmp = getCurrentPages()["0"].data.address
    tmp['addressItem'] = parseInt(e.detail.value) 
    that.setData({
      address: tmp
    })
  },

  // // 宿舍楼号
  // getApartment: function (e) {
  //   var that = this
  //   // console.log(e)
  //   that.setData({
  //     apartmentNum: that.data.address_Arr[e.detail.value].toString(),
  //     apartment: e.detail.value
  //   })
  // },

  // // 备注信息
  // getExtra: function (e) {
  //   var that = this
  //   that.setData({
  //     message: e.detail.value
  //   })
  // },

  // addToStorage:function(){
  //   console.log(getCurrentPages()["0"].data)
  //   var { name, phone, schoolName, addressItem, apartmentNum } = getCurrentPages()["0"].data;
  //   var value = { name, phone, schoolName, addressItem, apartmentNum } 
  //   console.log(value)
  //   if (value.name && value.phone.length === 11 && value.detail) {
  //     console.log(value)
  //     wx.setStorage({
  //       key: 'address',
  //       data: value,
  //       success() {
  //         wx.navigateBack();
  //       }
  //     })
  //   } else {
  //     wx.showModal({
  //       title: '提示',
  //       content: '请填写完整资料',
  //       showCancel: false
  //     })
  //   }
  // },

  formSubmit(e) {
    const value = e.detail.value;
    // console.log(value)
    if (value.name && value.phone.length === 11 && value.detail) {
      console.log(value)
      wx.setStorage({
        key: 'address',
        data: value,
        success() {
          wx.navigateBack();
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整资料',
        showCancel: false
      })
    }
  }
})
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
// 获取prepay_id
exports.main = async (event, context) => {
  wx.request({
    url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    method: 'POST',
    header: {
      "content-type": "text/xml",
      "charset": "utf-8"
    },
    data: event.xmlData,
  })
  .then(res=>{
    var prepay_id = res.data.split("<prepay_id><![CDATA[")[1].split("]]></prepay_id>")[0];
    return {
      prepay_id: prepay_id
    }
  }) 
}
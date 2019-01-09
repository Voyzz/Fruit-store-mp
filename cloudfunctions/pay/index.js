// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

cloud.init()

// 云函数入口函数
// 获取prepay_id
exports.main = async (event, context) => {  
  let result = await getPrepayIdPromise(event);
  return result
}

const getPrepayIdPromise = function (event) {
  return new Promise((resolve, reject) => {
    let options = {
      "url": 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      "method": "POST",
      "headers": {
        "Content-Type": "text/xml",
        "charset": "utf-8"
      },
      "form": event.xmlData
    };
    request.post(options, (err, result, body) => {
      resolve({
        err: err,
        body: body
      })
    })
  })
}
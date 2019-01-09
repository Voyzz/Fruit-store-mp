// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let result = await getIPAddressPromise();
  return result
}

const getIPAddressPromise = function () {
  return new Promise((resolve, reject) => {
    let options = {
      "url": 'http://ip-api.com/json'
    };
    request.post(options, (err, result, body) => {
      resolve({
        err: err,
        body: body
      })
    })
  })
}
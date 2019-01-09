const httpRequest = require("../utils/httpRequest");

/**
 * 调用云函数
 * @param {String} name  函数名
 * @param {Object} functionParam 函数参数
 * @return {Promise}
 */
function callFunction({ name, data }) {
  try {
    data = data ? JSON.stringify(data) : "";
  } catch (e) {
    return Promise.reject(e);
  }
  if (!name) {
    return Promise.reject(
      new Error({
        message: "函数名不能为空"
      })
    );
  }

  let params = {
    action: "functions.invokeFunction",
    function_name: name,
    request_data: data
  };

  return httpRequest({
    config: this.config,
    params,
    method: "post",
    headers: {
      "content-type": "application/json"
    }
  }).then(res => {
    // console.log(res);
    if (res.code) {
      return res;
    } else {
      let result = res.data.response_data
      try {
        result = JSON.parse(res.data.response_data)
      } catch (e) { }
      return {
        result,
        requestId: res.requestId
      };
    }
  });
}

exports.callFunction = callFunction;

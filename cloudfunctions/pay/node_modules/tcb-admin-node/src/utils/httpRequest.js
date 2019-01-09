var request = require("request");
var auth = require("./auth.js");
const version = require('../../package.json').version

module.exports = function (args) {
  var config = args.config,
    params = args.params,
    method = args.method || "get";

  const eventId = (new Date()).valueOf() + '_' + Math.random().toString().substr(2, 5)

  params = Object.assign({}, params, {
    envName: config.envName,
    timestamp: new Date().valueOf(),
    eventId
  });

  for (let key in params) {
    if (params[key] === undefined) {
      delete params[key];
    }
  }

  let file = null;
  if (params.action === "storage.uploadFile") {
    file = params["file"];
    delete params["file"];
  }

  if (!config.secretId || !config.secretKey) {
    if (process.env.TENCENTCLOUD_RUNENV === 'SCF') {
      throw Error("missing authoration key, redeploy the function")
    }
    throw Error("missing secretId or secretKey of tencent cloud");
  }

  const authObj = {
    SecretId: config.secretId,
    SecretKey: config.secretKey,
    Method: method,
    pathname: "/admin",
    Query: params,
    Headers: Object.assign(
      {
        "user-agent": `tcb-admin-sdk/${version}`
      },
      args.headers || {}
    )
  };

  var authorization = auth.getAuth(authObj);

  params.authorization = authorization;
  file && (params.file = file);
  config.sessionToken && (params.sessionToken = config.sessionToken);
  params.sdk_version = version

  var opts = {
    // url: 'http://localhost:8002/admin',
    url: config.serviceUrl || "http://tcb-admin.tencentcloudapi.com/admin",
    method: args.method || "get",
    // 先取模块的timeout，没有则取sdk的timeout，还没有就使用默认值
    timeout: args.timeout || config.timeout || 15000,
    headers: authObj.Headers,
    proxy: config.proxy
  };

  if (params.action === "storage.uploadFile") {
    opts.formData = params;
    opts.formData.file = {
      value: params.file,
      options: {
        filename: params.path
      }
    };
  } else if (args.method == "post") {
    opts.body = params;
    opts.json = true;
  } else {
    opts.qs = params;
  }

  if (params.action === 'wx.api') {
    opts.url = 'https://tcb-open.tencentcloudapi.com/admin'
  }

  if (args.proxy) {
    opts.proxy = args.proxy;
  }

  opts.url = `${opts.url}?eventId=${eventId}`

  // console.log(JSON.stringify(opts));
  return new Promise(function (resolve, reject) {
    request(opts, function (err, response, body) {
      // console.log(err, body);
      args && args.callback && args.callback(response)

      if (err === null && response.statusCode == 200) {
        let res;
        try {
          res = typeof body === "string" ? JSON.parse(body) : body;
        } catch (e) {
          res = body;
        }
        return resolve(res);
      } else {
        return reject(err);
      }
    });
  });
};

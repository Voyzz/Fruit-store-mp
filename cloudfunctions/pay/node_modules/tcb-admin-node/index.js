const storage = require("./src/storage");
const database = require("./src/db").Db;
const functions = require("./src/functions");
const wx = require("./src/wx");

function Tcb(config) {
  // console.log(config)
  this.config = config ? config : this.config
}

Tcb.prototype.init = function ({
  secretId,
  secretKey,
  sessionToken,
  env,
  proxy,
  timeout,
  serviceUrl
} = {}) {
  if ((secretId && !secretKey) || (!secretId && secretKey)) {
    throw Error("secretId and secretKey must be a pair");
  }

  this.config = {
    get secretId() {
      return this._secretId
        ? this._secretId
        : process.env.TENCENTCLOUD_SECRETID;
    },
    set secretId(id) {
      this._secretId = id;
    },
    get secretKey() {
      return this._secretKey
        ? this._secretKey
        : process.env.TENCENTCLOUD_SECRETKEY;
    },
    set secretKey(key) {
      this._secretKey = key;
    },
    get sessionToken() {
      if (this._sessionToken === undefined) {
        //默认临时密钥
        return process.env.TENCENTCLOUD_SESSIONTOKEN;
      } else if (this._sessionToken === false) {
        //固定秘钥
        return undefined;
      } else {
        //传入的临时密钥
        return this._sessionToken;
      }
    },
    set sessionToken(token) {
      this._sessionToken = token;
    },
    envName: env,
    proxy: proxy
  };

  this.config.secretId = secretId;
  this.config.secretKey = secretKey;
  this.config.timeout = timeout || 15000
  this.config.serviceUrl = serviceUrl
  this.config.sessionToken = sessionToken ? sessionToken : (secretId && secretKey ? false : undefined);

  return new Tcb(this.config);
};

Tcb.prototype.database = function (dbConfig) {
  return new database({ ...this, ...dbConfig });
};

function each(obj, fn) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      fn(obj[i], i);
    }
  }
}

function extend(target, source) {
  each(source, function (val, key) {
    target[key] = source[key];
  });
  return target;
}

extend(Tcb.prototype, functions);
extend(Tcb.prototype, storage);
extend(Tcb.prototype, wx)

module.exports = new Tcb();

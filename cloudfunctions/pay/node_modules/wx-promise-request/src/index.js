import Promise from 'es6-promise';
import queue from 'async/queue';

let defaultConfig = {
  request: wx.request,
  Promise,
  concurrency: 10,
};

const q = queue((task, callback) => task(callback), defaultConfig.concurrency);

const request = object => new defaultConfig.Promise((resolve, reject) => {
  q.push((callback) => {
    defaultConfig.request(Object.assign({}, object, {
      success: resolve,
      fail: reject,
      complete: callback,
    }));
  });
});

const setConfig = (config) => {
  const hasConcurrencyChange = config.concurrency !== defaultConfig.concurrency;

  defaultConfig = Object.assign({}, defaultConfig, config);
  if (hasConcurrencyChange) {
    q.concurrency = defaultConfig.concurrency;
  }
};

export {
  request,
  setConfig,
  Promise,
};

const request = require("request");
const fs = require('fs');
const httpRequest = require("../utils/httpRequest");

/*
 * 上传文件
 * @param {string} cloudPath 上传后的文件路径
 * @param {fs.ReadStream} fileContent  上传文件的二进制流
 */
function uploadFile({ cloudPath, fileContent }, { onResponseReceived } = {}) {
  let params = {
    action: "storage.uploadFile",
    path: cloudPath,
    file: fileContent
  };

  return httpRequest({
    config: this.config,
    params,
    method: "post",
    headers: {
      // "content-type": "multipart/form-data"
    },
    callback: (response) => {
      onResponseReceived && typeof onResponseReceived === 'function' && onResponseReceived(response)
    }
  }).then((res) => {
    if (res.code) {
      return res;
    } else {
      return {
        fileID: res.data.fileID,
        requestId: res.requestId
      };
    }
  });
}

/**
 * 删除文件
 * @param {Array.<string>} fileList 文件id数组
 */
async function deleteFile({ fileList }) {
  if (!fileList || !Array.isArray(fileList)) {
    return {
      code: "INVALID_PARAM",
      message: "fileList必须是非空的数组"
    };
  }

  for (let file of fileList) {
    if (!file || typeof file != "string") {
      return {
        code: "INVALID_PARAM",
        message: "fileList的元素必须是非空的字符串"
      };
    }
  }

  let params = {
    action: "storage.batchDeleteFile",
    fileid_list: fileList
  };

  return httpRequest({
    config: this.config,
    params,
    method: "post",
    headers: {
      "content-type": "application/json"
    }
  }).then(res => {
    if (res.code) {
      return res;
    } else {
      return {
        fileList: res.data.delete_list,
        requestId: res.requestId
      };
    }
  });
}

/**
 * 获取文件下载链接
 * @param {Array.<Object>} fileList
 */
async function getTempFileURL({ fileList }) {
  if (!fileList || !Array.isArray(fileList)) {
    return {
      code: "INVALID_PARAM",
      message: "fileList必须是非空的数组"
    };
  }

  let file_list = [];
  for (let file of fileList) {
    if (typeof file === 'object') {
      if (
        !file.hasOwnProperty("fileID") ||
        !file.hasOwnProperty("maxAge")
      ) {
        return {
          code: "INVALID_PARAM",
          message: "fileList的元素必须是包含fileID和maxAge的对象"
        };
      }

      file_list.push({
        fileid: file.fileID,
        max_age: file.maxAge
      });
    } else if (typeof file === 'string') {
      file_list.push({
        fileid: file,
      });
    } else {
      return {
        code: "INVALID_PARAM",
        message: "fileList的元素必须是字符串"
      };
    }
  }

  let params = {
    action: "storage.batchGetDownloadUrl",
    file_list
  };
  // console.log(params);

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
      return {
        fileList: res.data.download_list,
        requestId: res.requestId
      };
    }
  });
}

async function downloadFile({ fileID, tempFilePath }) {
  let tmpUrl,
    self = this;
  try {
    const tmpUrlRes = await this.getTempFileURL({
      fileList: [
        {
          fileID,
          maxAge: 600
        }
      ]
    });
    // console.log(tmpUrlRes);
    const res = tmpUrlRes.fileList[0]

    if (
      res.code != 'SUCCESS'
    ) {
      return res;
    }

    tmpUrl = res.tempFileURL;
  } catch (e) {
    throw e
  }

  let req = request({
    url: tmpUrl,
    encoding: null,
    proxy: self.config.proxy
  });

  return new Promise((resolve, reject) => {
    let fileContent = Buffer.alloc(0)
    req.on('response', function (response) {
      if (response && +response.statusCode === 200) {
        if (tempFilePath) {
          response.pipe(fs.createWriteStream(tempFilePath));
        } else {
          response.on('data', (data) => {
            fileContent = Buffer.concat([fileContent, data])
          })
        }
        response.on('end', () => {
          resolve({
            fileContent: tempFilePath ? undefined : fileContent,
            message: '文件下载完成'
          })
        })
      } else {
        reject(response)
      }
    });
  });
}

exports.uploadFile = uploadFile;
exports.deleteFile = deleteFile;
exports.getTempFileURL = getTempFileURL;
exports.downloadFile = downloadFile;

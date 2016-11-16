'use strict';

const scp2 = require('scp2');
const Base = require('./baseUploader');
const path = require('path');
/**
 * sftp的方式，需要使用ssh账户和密码，配置对应的权限，特别是nginx的目录权限
 */
module.exports = class Scp extends Base {
  constructor(options) {
    super(options);
    // 此处参考源代码https://github.com/spmjs/node-scp2/blob/master/lib/scp.js 的最后，把client对象传递进去
    // 源代码内已经注册error事件到scp函数的callback中，这里注册监听write方法可以获取哪些文件被写入了
    this.client = new scp2.Client();
    // this.client.on('write', (obj) => {
    //   console.log(obj.destination);
    // });
  }

  upload(root, target, upPath) {
    const uploadInfo = this.getUploadInfo(upPath);

    return new Promise((resolve, reject) => {
      // scp2直接支持文件到文件和目录到目录的复制
      scp2.scp(path.resolve(root, uploadInfo.path), {
        host: this.options.host,
        username: this.options.user,
        password: this.options.password,
        port: this.options.port,
        path: path.join(this.options.rootPrefix, target, uploadInfo.path)
      }, this.client, (err) => {
        if (err) {
          reject(err);
        }
        else {
          this.client.close();
          resolve()
        }
      })
    })

  }
}

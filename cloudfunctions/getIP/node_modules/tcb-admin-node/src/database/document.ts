import { Request } from "./request";
import { Db } from "./db";
import { Util } from "./util";
// import { Command } from "./command";
import { UpdateSerializer } from './serializer/update'
import { serialize } from './serializer/datatype'
import { UpdateCommand } from './commands/update'

/**
 * 文档模块
 *
 * @author haroldhu
 */
export class DocumentReference {
  /**
   * 数据库引用
   *
   * @internal
   */
  private _db: Db;

  /**
   * 集合名称
   *
   * @internal
   */
  private _coll: string;

  /**
   * 文档ID
   */
  readonly id: string;

  /**
   *
   */
  readonly projection: Object;

  /**
   * Request 实例
   *
   * @internal
   */
  private request: Request;

  /**
   * 初始化
   *
   * @internal
   *
   * @param db    - 数据库的引用
   * @param coll  - 集合名称
   * @param docID - 文档ID
   */
  constructor(db: Db, coll: string, docID: string, projection = {}) {
    this._db = db;
    this._coll = coll;
    this.id = docID;
    this.request = new Request(this._db);
    this.projection = projection;
  }

  /**
   * 创建一篇文档
   *
   * @param data - 文档数据
   * @internal
   */
  create(data): Promise<any> {
    let params = {
      collectionName: this._coll,
      // data: Util.encodeDocumentDataForReq(data, false, false)
      data: serialize(data)
    };

    if (this.id) {
      params["_id"] = this.id;
    }

    return new Promise<any>(resolve => {
      this.request.send("addDocument", params).then(res => {
        if (res.code) {
          resolve(res);
        }
        resolve({
          id: res.data._id,
          requestId: res.requestId
        });
      });
    });
  }

  /**
   * 创建或添加数据
   *
   * 如果文档ID不存在，则创建该文档并插入数据，根据返回数据的 upserted_id 判断
   * 添加数据的话，根据返回数据的 set 判断影响的行数
   *
   * @param data - 文档数据
   */
  set(data: Object): Promise<any> {
    if (!data || typeof data !== "object") {
      return Promise.resolve({
        code: 'INVALID_PARAM',
        message: '参数必需是非空对象'
      })
    }

    if (data.hasOwnProperty('_id')) {
      return Promise.resolve({
        code: 'INVALID_PARAM',
        message: '不能更新_id的值'
      })
    }

    let hasOperator = false;
    const checkMixed = (objs) => {
      // console.log(objs)
      if (typeof objs === 'object') {
        for (let key in objs) {
          if (objs[key] instanceof UpdateCommand) {
            hasOperator = true
          } else if (typeof objs[key] === 'object') {
            checkMixed(objs[key])
          }
        }
      }

    }
    checkMixed(data)
    // console.log('hasOperator', hasOperator)

    if (hasOperator) {  //不能包含操作符
      return Promise.resolve({
        code: 'DATABASE_REQUEST_FAILED',
        message: 'update operator complicit'
      })
    }

    // console.log(data, JSON.stringify(data))
    const merge = false; //data不能带有操作符
    let param = {
      collectionName: this._coll,
      // data: Util.encodeDocumentDataForReq(data, merge, false),
      data: serialize(data),
      multi: false,
      merge,
      upsert: true
    };

    if (this.id) {
      param["query"] = { _id: this.id };
    }

    return new Promise<any>(resolve => {
      this.request.send("updateDocument", param).then(res => {
        if (res.code) {
          resolve(res);
        } else {
          resolve({
            updated: res.data.updated,
            upsertedId: res.data.upserted_id,
            requestId: res.requestId
          });
        }
      });
    });
  }

  /**
   * 更新数据
   *
   * @param data - 文档数据
   */
  update(data: Object) {
    if (!data || typeof data !== "object") {
      return Promise.resolve({
        code: 'INVALID_PARAM',
        message: '参数必需是非空对象'
      })
    }

    if (data.hasOwnProperty('_id')) {
      return Promise.resolve({
        code: 'INVALID_PARAM',
        message: '不能更新_id的值'
      })
    }

    const query = { _id: this.id };
    const merge = true; //把所有更新数据转为带操作符的
    const param = {
      collectionName: this._coll,
      // data: Util.encodeDocumentDataForReq(data, merge, true),
      data: UpdateSerializer.encode(data),
      query: query,
      multi: false,
      merge,
      upsert: false
    };
    return new Promise<any>(resolve => {
      this.request.send("updateDocument", param).then(res => {
        if (res.code) {
          resolve(res);
        } else {
          resolve({
            updated: res.data.updated,
            upsertedId: res.data.upserted_id,
            requestId: res.requestId
          });
        }
      });
    });
  }

  /**
   * 删除文档
   */
  remove(): Promise<any> {
    const query = { _id: this.id };
    const param = {
      collectionName: this._coll,
      query: query,
      multi: false
    };
    return new Promise<any>(resolve => {
      this.request.send("deleteDocument", param).then(res => {
        if (res.code) {
          resolve(res);
        } else {
          resolve({
            deleted: res.data.deleted,
            requestId: res.requestId
          });
        }
      });
    });
  }

  /**
   * 返回选中的文档（_id）
   */
  get(): Promise<any> {
    const query = { _id: this.id };
    const param = {
      collectionName: this._coll,
      query: query,
      multi: false,
      projection: this.projection
    };
    return new Promise<any>(resolve => {
      this.request.send("queryDocument", param).then(res => {
        if (res.code) {
          resolve(res);
        } else {
          const documents = Util.formatResDocumentData(res.data.list);
          resolve({
            data: documents,
            requestId: res.requestId,
            total: res.TotalCount,
            limit: res.Limit,
            offset: res.Offset
          });
        }
      });
    });
  }

  /**
   *
   */
  field(projection: Object): DocumentReference {
    for (let k in projection) {
      if (projection[k]) {
        projection[k] = 1;
      } else {
        projection[k] = 0;
      }
    }
    return new DocumentReference(this._db, this._coll, this.id, projection);
  }
}

import { Request } from "./request";
import { OrderByDirection } from "./constant";
import { Db } from "./db";
import { Validate } from "./validate";
import { Util } from "./util";
import { Command } from "./command";

interface getRes {
  data: any[];
  requestId: string;
  total: number;
  limit: number;
  offset: number;
}

interface QueryOrder {
  field?: string;
  direction?: "asc" | "desc";
}

interface QueryOption {
  // 查询数量
  limit?: number;
  // 偏移量
  offset?: number;
  // 指定显示或者不显示哪些字段
  projection?: Object;
}

/**
 * 查询模块
 *
 * @author haroldhu
 */
export class Query {
  /**
   * Db 的引用
   *
   * @internal
   */
  protected _db: Db;

  /**
   * Collection name
   *
   * @internal
   */
  protected _coll: string;

  /**
   * 过滤条件
   *
   * @internal
   */
  private _fieldFilters: Object;

  /**
   * 排序条件
   *
   * @internal
   */
  private _fieldOrders: QueryOrder[];

  /**
   * 查询条件
   *
   * @internal
   */
  private _queryOptions: QueryOption;

  /**
   * 请求实例
   *
   * @internal
   */
  private _request: Request;

  /**
   * 初始化
   *
   * @internal
   *
   * @param db            - 数据库的引用
   * @param coll          - 集合名称
   * @param fieldFilters  - 过滤条件
   * @param fieldOrders   - 排序条件
   * @param queryOptions  - 查询条件
   */
  constructor(
    db: Db,
    coll: string,
    fieldFilters?: Object,
    fieldOrders?: QueryOrder[],
    queryOptions?: QueryOption
  ) {
    this._db = db;
    this._coll = coll;
    this._fieldFilters = fieldFilters;
    this._fieldOrders = fieldOrders || [];
    this._queryOptions = queryOptions || {};
    this._request = new Request(this._db);
  }

  /**
   * 发起请求获取文档列表
   *
   * - 默认获取集合下全部文档数据
   * - 可以把通过 `orderBy`、`where`、`skip`、`limit`设置的数据添加请求参数上
   */
  get(): Promise<getRes> {
    let newOder = [];
    if (this._fieldOrders) {
      this._fieldOrders.forEach(order => {
        newOder.push(order);
      });
    }
    interface Param {
      collectionName: string;
      query?: Object;
      order?: string[];
      offset?: number;
      limit?: number;
      projection?: Object;
    }
    let param: Param = {
      collectionName: this._coll
    };
    if (this._fieldFilters) {
      param.query = this._fieldFilters;
    }
    if (newOder.length > 0) {
      param.order = newOder;
    }
    if (this._queryOptions.offset) {
      param.offset = this._queryOptions.offset;
    }
    if (this._queryOptions.limit) {
      param.limit =
        this._queryOptions.limit < 100 ? this._queryOptions.limit : 100;
    } else {
      param.limit = 100;
    }
    if (this._queryOptions.projection) {
      param.projection = this._queryOptions.projection;
    }
    // console.log("this._queryOptions", this._queryOptions);
    // console.log(param);
    return new Promise<any>(resolve => {
      this._request.send("queryDocument", param).then(res => {
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
   * 获取总数
   */
  count() {
    interface Param {
      collectionName: string;
      query?: Object;
    }
    let param: Param = {
      collectionName: this._coll
    };
    if (this._fieldFilters) {
      param.query = this._fieldFilters;
    }
    return new Promise<any>(resolve => {
      this._request.send("countDocument", param).then(res => {
        // console.log(res);
        if (res.code) {
          resolve(res);
        } else {
          resolve({
            requestId: res.requestId,
            total: res.data.total
          });
        }
      });
    });
  }

  /**
   * 查询条件
   *
   * @param query
   */
  where(query: object) {
    return new Query(
      this._db,
      this._coll,
      this.convertParams(query),
      this._fieldOrders,
      this._queryOptions
    );
  }

  /**
   * 设置排序方式
   *
   * @param fieldPath     - 字段路径
   * @param directionStr  - 排序方式
   */
  orderBy(fieldPath: string, directionStr: OrderByDirection): Query {
    Validate.isFieldPath(fieldPath);
    Validate.isFieldOrder(directionStr);

    const newOrder: QueryOrder = {
      field: fieldPath,
      direction: directionStr
    };
    const combinedOrders = this._fieldOrders.concat(newOrder);

    return new Query(
      this._db,
      this._coll,
      this._fieldFilters,
      combinedOrders,
      this._queryOptions
    );
  }

  /**
   * 设置查询条数
   *
   * @param limit - 限制条数
   */
  limit(limit: number): Query {
    Validate.isInteger("limit", limit);

    let option = Object.assign({}, this._queryOptions);
    option.limit = limit;

    return new Query(
      this._db,
      this._coll,
      this._fieldFilters,
      this._fieldOrders,
      option
    );
  }

  /**
   * 设置偏移量
   *
   * @param offset - 偏移量
   */
  skip(offset: number): Query {
    Validate.isInteger("offset", offset);

    let option = Object.assign({}, this._queryOptions);
    option.offset = offset;

    return new Query(
      this._db,
      this._coll,
      this._fieldFilters,
      this._fieldOrders,
      option
    );
  }

  /**
   * 发起请求批量更新文档
   *
   * @param data 数据
   */
  update(data: Object): Promise<any> {
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

    let param = {
      collectionName: this._coll,
      query: this._fieldFilters,
      multi: true,
      merge: true,
      upsert: false,
      data: Util.encodeDocumentDataForReq(data, true)
      // data: this.convertParams(data)
    };

    return new Promise<any>(resolve => {
      this._request.send("updateDocument", param).then(res => {
        if (res.code) {
          resolve(res);
        } else {
          resolve({
            requestId: res.requestId,
            updated: res.data.updated,
            upsertId: res.data.upsert_id
          });
        }
      });
    });
  }

  /**
   * 指定要返回的字段
   *
   * @param projection
   */
  field(projection: Object): Query {
    for (let k in projection) {
      if (projection[k]) {
        projection[k] = 1;
      } else {
        projection[k] = 0;
      }
    }

    let option = Object.assign({}, this._queryOptions);
    option.projection = projection;

    return new Query(
      this._db,
      this._coll,
      this._fieldFilters,
      this._fieldOrders,
      option
    );
  }

  /**
   * 条件删除文档
   */
  remove() {
    const param = {
      collectionName: this._coll,
      query: this._fieldFilters,
      multi: true
    }
    // console.log("this._queryOptions", this._queryOptions);
    // console.log(param);
    return new Promise<any>(resolve => {
      this._request.send("deleteDocument", param).then(res => {
        console.log(res)
        if (res.code) {
          resolve(res);
        } else {
          resolve({
            requestId: res.requestId,
            deleted: res.data.deleted
          });
        }
      });
    });
  }

  convertParams(query: object) {
    // console.log(query);
    let queryParam = {};
    if (query instanceof Command) {
      queryParam = query.parse();
    } else {
      for (let key in query) {
        if (query[key] instanceof Command) {
          queryParam = Object.assign(
            {},
            queryParam,
            query[key].parse(key)
          );
        } else if (typeof query[key] === "object") {
          let command = new Command();
          let tmp = command.concatKeys({ [key]: query[key] });
          // console.log(tmp)
          let value
          if (tmp.value instanceof Command) {
            value = tmp.value.parse(tmp.keys);
          } else {
            value = { [tmp.keys]: tmp.value }
          }

          queryParam = Object.assign({}, queryParam, value);
        } else {
          queryParam = Object.assign({}, queryParam, { [key]: query[key] });
        }
      }
    }
    // console.log(JSON.stringify(queryParam));
    return queryParam;
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./request");
const validate_1 = require("./validate");
const util_1 = require("./util");
const query_1 = require("./serializer/query");
const update_1 = require("./serializer/update");
class Query {
    constructor(db, coll, fieldFilters, fieldOrders, queryOptions) {
        this._db = db;
        this._coll = coll;
        this._fieldFilters = fieldFilters;
        this._fieldOrders = fieldOrders || [];
        this._queryOptions = queryOptions || {};
        this._request = new request_1.Request(this._db);
    }
    get() {
        let newOder = [];
        if (this._fieldOrders) {
            this._fieldOrders.forEach(order => {
                newOder.push(order);
            });
        }
        let param = {
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
        }
        else {
            param.limit = 100;
        }
        if (this._queryOptions.projection) {
            param.projection = this._queryOptions.projection;
        }
        return new Promise(resolve => {
            this._request.send("queryDocument", param).then(res => {
                if (res.code) {
                    resolve(res);
                }
                else {
                    const documents = util_1.Util.formatResDocumentData(res.data.list);
                    const result = {
                        data: documents,
                        requestId: res.requestId
                    };
                    if (res.TotalCount)
                        result.total = res.TotalCount;
                    if (res.Limit)
                        result.limit = res.Limit;
                    if (res.Offset)
                        result.offset = res.Offset;
                    resolve(result);
                }
            });
        });
    }
    count() {
        let param = {
            collectionName: this._coll
        };
        if (this._fieldFilters) {
            param.query = this._fieldFilters;
        }
        return new Promise(resolve => {
            this._request.send("countDocument", param).then(res => {
                if (res.code) {
                    resolve(res);
                }
                else {
                    resolve({
                        requestId: res.requestId,
                        total: res.data.total
                    });
                }
            });
        });
    }
    where(query) {
        return new Query(this._db, this._coll, query_1.QuerySerializer.encode(query), this._fieldOrders, this._queryOptions);
    }
    orderBy(fieldPath, directionStr) {
        validate_1.Validate.isFieldPath(fieldPath);
        validate_1.Validate.isFieldOrder(directionStr);
        const newOrder = {
            field: fieldPath,
            direction: directionStr
        };
        const combinedOrders = this._fieldOrders.concat(newOrder);
        return new Query(this._db, this._coll, this._fieldFilters, combinedOrders, this._queryOptions);
    }
    limit(limit) {
        validate_1.Validate.isInteger("limit", limit);
        let option = Object.assign({}, this._queryOptions);
        option.limit = limit;
        return new Query(this._db, this._coll, this._fieldFilters, this._fieldOrders, option);
    }
    skip(offset) {
        validate_1.Validate.isInteger("offset", offset);
        let option = Object.assign({}, this._queryOptions);
        option.offset = offset;
        return new Query(this._db, this._coll, this._fieldFilters, this._fieldOrders, option);
    }
    update(data) {
        if (!data || typeof data !== "object") {
            return Promise.resolve({
                code: "INVALID_PARAM",
                message: "参数必需是非空对象"
            });
        }
        if (data.hasOwnProperty("_id")) {
            return Promise.resolve({
                code: "INVALID_PARAM",
                message: "不能更新_id的值"
            });
        }
        let param = {
            collectionName: this._coll,
            query: this._fieldFilters,
            multi: true,
            merge: true,
            upsert: false,
            data: update_1.UpdateSerializer.encode(data)
        };
        return new Promise(resolve => {
            this._request.send("updateDocument", param).then(res => {
                if (res.code) {
                    resolve(res);
                }
                else {
                    resolve({
                        requestId: res.requestId,
                        updated: res.data.updated,
                        upsertId: res.data.upsert_id
                    });
                }
            });
        });
    }
    field(projection) {
        for (let k in projection) {
            if (projection[k]) {
                projection[k] = 1;
            }
            else {
                projection[k] = 0;
            }
        }
        let option = Object.assign({}, this._queryOptions);
        option.projection = projection;
        return new Query(this._db, this._coll, this._fieldFilters, this._fieldOrders, option);
    }
    remove() {
        const param = {
            collectionName: this._coll,
            query: query_1.QuerySerializer.encode(this._fieldFilters),
            multi: true
        };
        return new Promise(resolve => {
            this._request.send("deleteDocument", param).then(res => {
                if (res.code) {
                    resolve(res);
                }
                else {
                    resolve({
                        requestId: res.requestId,
                        deleted: res.data.deleted
                    });
                }
            });
        });
    }
}
exports.Query = Query;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./request");
const util_1 = require("./util");
const update_1 = require("./serializer/update");
const datatype_1 = require("./serializer/datatype");
const update_2 = require("./commands/update");
class DocumentReference {
    constructor(db, coll, docID, projection = {}) {
        this._db = db;
        this._coll = coll;
        this.id = docID;
        this.request = new request_1.Request(this._db);
        this.projection = projection;
    }
    create(data) {
        let params = {
            collectionName: this._coll,
            data: datatype_1.serialize(data)
        };
        if (this.id) {
            params["_id"] = this.id;
        }
        return new Promise(resolve => {
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
    set(data) {
        if (!data || typeof data !== "object") {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '参数必需是非空对象'
            });
        }
        if (data.hasOwnProperty('_id')) {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '不能更新_id的值'
            });
        }
        let hasOperator = false;
        const checkMixed = (objs) => {
            if (typeof objs === 'object') {
                for (let key in objs) {
                    if (objs[key] instanceof update_2.UpdateCommand) {
                        hasOperator = true;
                    }
                    else if (typeof objs[key] === 'object') {
                        checkMixed(objs[key]);
                    }
                }
            }
        };
        checkMixed(data);
        if (hasOperator) {
            return Promise.resolve({
                code: 'DATABASE_REQUEST_FAILED',
                message: 'update operator complicit'
            });
        }
        const merge = false;
        let param = {
            collectionName: this._coll,
            data: datatype_1.serialize(data),
            multi: false,
            merge,
            upsert: true
        };
        if (this.id) {
            param["query"] = { _id: this.id };
        }
        return new Promise(resolve => {
            this.request.send("updateDocument", param).then(res => {
                if (res.code) {
                    resolve(res);
                }
                else {
                    resolve({
                        updated: res.data.updated,
                        upsertedId: res.data.upserted_id,
                        requestId: res.requestId
                    });
                }
            });
        });
    }
    update(data) {
        if (!data || typeof data !== "object") {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '参数必需是非空对象'
            });
        }
        if (data.hasOwnProperty('_id')) {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '不能更新_id的值'
            });
        }
        const query = { _id: this.id };
        const merge = true;
        const param = {
            collectionName: this._coll,
            data: update_1.UpdateSerializer.encode(data),
            query: query,
            multi: false,
            merge,
            upsert: false
        };
        return new Promise(resolve => {
            this.request.send("updateDocument", param).then(res => {
                if (res.code) {
                    resolve(res);
                }
                else {
                    resolve({
                        updated: res.data.updated,
                        upsertedId: res.data.upserted_id,
                        requestId: res.requestId
                    });
                }
            });
        });
    }
    remove() {
        const query = { _id: this.id };
        const param = {
            collectionName: this._coll,
            query: query,
            multi: false
        };
        return new Promise(resolve => {
            this.request.send("deleteDocument", param).then(res => {
                if (res.code) {
                    resolve(res);
                }
                else {
                    resolve({
                        deleted: res.data.deleted,
                        requestId: res.requestId
                    });
                }
            });
        });
    }
    get() {
        const query = { _id: this.id };
        const param = {
            collectionName: this._coll,
            query: query,
            multi: false,
            projection: this.projection
        };
        return new Promise(resolve => {
            this.request.send("queryDocument", param).then(res => {
                if (res.code) {
                    resolve(res);
                }
                else {
                    const documents = util_1.Util.formatResDocumentData(res.data.list);
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
    field(projection) {
        for (let k in projection) {
            if (projection[k]) {
                projection[k] = 1;
            }
            else {
                projection[k] = 0;
            }
        }
        return new DocumentReference(this._db, this._coll, this.id, projection);
    }
}
exports.DocumentReference = DocumentReference;

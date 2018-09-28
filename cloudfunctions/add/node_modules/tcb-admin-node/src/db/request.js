"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestHandler = require("../utils/httpRequest");
class Request {
    constructor(db) {
        this.db = db;
    }
    send(api, data) {
        const params = Object.assign({}, data, {
            action: `database.${api}`
        });
        return requestHandler({
            config: this.db.config.config,
            params,
            method: "post",
            headers: {
                "content-type": "application/json"
            }
        });
    }
}
exports.Request = Request;

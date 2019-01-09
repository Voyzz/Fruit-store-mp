"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const requestHandler = require("../utils/httpRequest");
class Request {
    constructor(db) {
        this.db = db;
    }
    send(api, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = Object.assign({}, data, {
                action: `database.${api}`
            });
            const slowQueryWarning = setTimeout(() => {
                console.warn('Database operation is longer than 3s. Please check query performance and your network environment.');
            }, 3000);
            try {
                return yield requestHandler({
                    timeout: this.db.config.timeout,
                    config: this.db.config.config,
                    params,
                    method: "post",
                    headers: {
                        "content-type": "application/json"
                    }
                });
            }
            finally {
                clearTimeout(slowQueryWarning);
            }
        });
    }
}
exports.Request = Request;

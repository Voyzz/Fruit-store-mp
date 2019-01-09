"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Geo = require("./geo");
const collection_1 = require("./collection");
const command_1 = require("./command");
const serverDate_1 = require("./serverDate");
const request_1 = require("./request");
const regexp_1 = require("./regexp");
class Db {
    constructor(config) {
        this.config = config;
        this.Geo = Geo;
        this.serverDate = serverDate_1.ServerDateConstructor;
        this.command = command_1.Command;
        this.RegExp = regexp_1.RegExpConstructor;
    }
    collection(collName) {
        if (!collName) {
            throw new Error("Collection name is required");
        }
        return new collection_1.CollectionReference(this, collName);
    }
    createCollection(collName) {
        let request = new request_1.Request(this);
        const params = {
            collectionName: collName
        };
        return request.send("addCollection", params);
    }
}
exports.Db = Db;

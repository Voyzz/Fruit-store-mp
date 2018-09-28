"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("./constant");
const point_1 = require("./geo/point");
const command_1 = require("./command");
const deepAssign = require("deep-assign");
const serverDate_1 = require("./serverDate");
class Util {
}
Util.encodeGeoPoint = (point) => {
    if (!(point instanceof point_1.Point)) {
        throw new Error("encodeGeoPoint: must be GeoPoint type");
    }
    return {
        type: "Point",
        coordinates: [point.latitude, point.longitude]
    };
};
Util.encodeServerDate = (serverDate) => {
    return { $date: { offset: serverDate.offset } };
};
Util.encodeTimestamp = (stamp) => {
    if (!(stamp instanceof Date)) {
        throw new Error("encodeTimestamp: must be Date type");
    }
    return {
        $timestamp: Math.floor(stamp.getTime() / 1000)
    };
};
Util.encodeDocumentDataForReq = (document, merge = false, concatKey = true) => {
    const keys = Object.keys(document);
    let params = {};
    if (Array.isArray(document)) {
        params = [];
    }
    const getCommandVal = (key, item) => {
        let value;
        let command = new command_1.Command();
        let tmp = command.concatKeys({ [key]: item });
        if (tmp.value instanceof command_1.Command) {
            value = tmp.value.parse(tmp.keys);
        }
        else {
            value = { [tmp.keys]: tmp.value };
        }
        return value;
    };
    keys.forEach(key => {
        const item = document[key];
        const type = Util.whichType(item);
        let realValue;
        if (type === constant_1.FieldType.GeoPoint) {
            realValue = { [key]: Util.encodeGeoPoint(item).coordinates };
        }
        else if (type === constant_1.FieldType.Timestamp) {
            realValue = { [key]: Util.encodeTimestamp(item) };
        }
        else if (type === constant_1.FieldType.ServerDate) {
            realValue = { [key]: Util.encodeServerDate(item) };
        }
        else if (type === constant_1.FieldType.Object) {
            if (concatKey) {
                realValue = getCommandVal(key, item);
            }
            else {
                realValue = { [key]: Util.encodeDocumentDataForReq(item, merge, concatKey) };
            }
        }
        else if (type === constant_1.FieldType.Command) {
            realValue = getCommandVal(key, item);
        }
        else {
            realValue = { [key]: item };
        }
        if (constant_1.UpdateOperatorList.indexOf(Object.keys(realValue)[0]) === -1 && merge === true) {
            realValue = { $set: realValue };
        }
        if (Array.isArray(params)) {
            params.push(realValue);
        }
        else {
            params = deepAssign({}, params, realValue);
        }
    });
    return params;
};
Util.formatResDocumentData = (documents) => {
    return documents.map(document => {
        return Util.formatField(document);
    });
};
Util.formatField = document => {
    const keys = Object.keys(document);
    let protoField = {};
    if (Array.isArray(document)) {
        protoField = [];
    }
    keys.forEach(key => {
        const item = document[key];
        const type = Util.whichType(item);
        let realValue;
        switch (type) {
            case constant_1.FieldType.GeoPoint:
                realValue = new point_1.Point(item.coordinates[0], item.coordinates[1]);
                break;
            case constant_1.FieldType.Timestamp:
                realValue = new Date(item.$timestamp * 1000);
                break;
            case constant_1.FieldType.Object:
            case constant_1.FieldType.Array:
                realValue = Util.formatField(item);
                break;
            case constant_1.FieldType.ServerDate:
                realValue = new Date(item.$date);
                break;
            default:
                realValue = item;
        }
        if (Array.isArray(protoField)) {
            protoField.push(realValue);
        }
        else {
            protoField[key] = realValue;
        }
    });
    return protoField;
};
Util.whichType = (obj) => {
    let type = Object.prototype.toString.call(obj).slice(8, -1);
    if (type === constant_1.FieldType.Object) {
        if (obj instanceof point_1.Point) {
            return constant_1.FieldType.GeoPoint;
        }
        else if (obj instanceof Date) {
            return constant_1.FieldType.Timestamp;
        }
        else if (obj instanceof command_1.Command) {
            return constant_1.FieldType.Command;
        }
        else if (obj instanceof serverDate_1.ServerDate) {
            return constant_1.FieldType.ServerDate;
        }
        if (obj.$timestamp) {
            type = constant_1.FieldType.Timestamp;
        }
        else if (obj.$date) {
            type = constant_1.FieldType.ServerDate;
        }
        else if (Array.isArray(obj.coordinates) && obj.type === "Point") {
            type = constant_1.FieldType.GeoPoint;
        }
    }
    return type;
};
Util.generateDocId = () => {
    let chars = "ABCDEFabcdef0123456789";
    let autoId = "";
    for (let i = 0; i < 24; i++) {
        autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return autoId;
};
exports.Util = Util;
